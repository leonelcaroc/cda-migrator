import connection from "./utils/connectToMySqlDb.js";
import { prismaAuth } from "./utils/prismaAuth.js";
import { prismaCoop } from "./utils/prismaCoop.js";
import fs from "fs";
import path from "path";
import hashPasswordUtil from "./utils/hashPasswordUtil.js";
import randomPassword from "./utils/randomPassword.js";

const getAllPrimaryCoops = `
SELECT
  rc.*,
  c.id                  AS mysql_coop_id,
  c.users_id            AS mysql_users_id,
  u.id                  AS user_id,
  u.email               AS user_email,
  u.first_name          AS user_first_name,
  u.last_name           AS user_last_name,
  u.middle_name         AS user_middle_name,
  u.birthdate           AS user_birthdate,
  u.contact_number      AS user_contact_number,
  u.address             AS user_address
FROM (
  SELECT *,
         ROW_NUMBER() OVER (
           PARTITION BY regNo
           ORDER BY id DESC
         ) AS rn
  FROM registeredcoop
) rc
LEFT JOIN cooperatives c
  ON rc.application_id = c.id
LEFT JOIN users u
  ON c.users_id = u.id
WHERE rc.rn = 1
  AND rc.category = 'Primary'
LIMIT 1000;
`;

let mockEmailCounter = 1000;

// Generate random string
function randomString(length = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  const nums = "0123456789";
  let str = "";
  for (let i = 0; i < length; i++) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }
  for (let i = 0; i < length; i++) {
    str += nums[Math.floor(Math.random() * nums.length)];
  }
  return str;
}

// Log file path
const logFilePath = path.join(process.cwd(), "user_credentials_log.txt");

// Clear previous log
fs.writeFileSync(logFilePath, "email,password\n");

export default function runMigration() {
  connection.query(getAllPrimaryCoops, async (err, results) => {
    if (err) throw err;

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    console.log(
      `Starting migration of ${results.length} primary cooperatives...`
    );

    for (const [index, row] of results.entries()) {
      try {
        if ((index + 1) % 100 === 0 || index === results.length - 1) {
          console.log(`Processing record ${index + 1} of ${results.length}...`);
        }

        if (!row.regNo?.trim()) {
          skipCount++;
          continue;
        }

        const regNo = row.regNo.trim();
        let coopName = row.coopName?.trim() || `Unknown_${regNo}`;
        let acronym = row.acronym?.trim() || "";

        const acronymRegex = /\(([^)]+)\)/;
        const acronymMatch = coopName.match(acronymRegex);
        if (acronymMatch) {
          if (!acronym) acronym = acronymMatch[1].trim();
          coopName = coopName.replace(acronymRegex, "").trim();
          coopName = coopName.replace(/\s+/g, " ").replace(/[,|-]\s*$/, "");
        }

        // Coop Compliance
        const coopCompliance = {
          complianceStatusId: 0,
          complianceCategoryId: 0,
          complianceTypeId: 0,
        };

        // Check if org already exists
        let existingOrg = await prismaCoop.cooperativeOrg.findUnique({
          where: { regNo },
        });
        if (!existingOrg) {
          existingOrg = await prismaCoop.cooperativeOrg.findUnique({
            where: { cooperativeName: coopName },
          });
        }
        if (existingOrg) {
          skipCount++;
          continue;
        }

        // Create or find user
        let userId = null;
        let email = row.user_email?.trim();
        let plainPassword = randomPassword();

        if (!email) {
          email = `user_cda+_${randomString()}_${mockEmailCounter}@gmail.com`;
          mockEmailCounter++;
        }

        let existingUser = await prismaAuth.user.findFirst({
          where: { email },
        });

        if (!existingUser) {
          const hashedPassword = await hashPasswordUtil(plainPassword);
          existingUser = await prismaAuth.user.create({
            data: {
              email,
              firstname: row.user_first_name?.trim() || "Mock",
              lastname: row.user_last_name?.trim() || "User",
              middlename: row.user_middle_name?.trim() || "",
              mobile: row.user_contact_number?.trim() || "",
              address: row.user_address?.trim() || "",
              status: "APPROVED",
              migrated: 1,
              verified_at: new Date(),
              password: hashedPassword,
            },
          });

          // Log email & plain password
          fs.appendFileSync(logFilePath, `${email},${plainPassword}\n`);
        }

        userId = existingUser.id;

        // Create Cooperative Org
        const org = await prismaCoop.cooperativeOrg.create({
          data: {
            cooperativeName: coopName,
            acronym,
            regNo,
            prevComplianceRemarks: row.compliant,
            migrated: 1,
            ownedBy: userId,
          },
        });

        // Create Cooperative (approved)
        const cooperative = await prismaCoop.cooperatives.create({
          data: {
            cooperativeOrgId: org.id,
            cooperativeName: org.cooperativeName,
            cooperativeCategory: row.category?.toLowerCase().trim(),
            registrationId: regNo,
            isAmendment: false,
            formOfRegistration: "none",
          },
        });

        // Update CooperativeOrg to set approvedCooperativeId
        await prismaCoop.cooperativeOrg.update({
          where: { id: org.id },
          data: { approvedCooperativeId: cooperative.id },
        });

        successCount++;
      } catch (error) {
        errorCount++;
        console.error(`[${index + 1}] ❌ Error`, error.message);
      }
    }

    console.log("MIGRATION COMPLETED");
    console.log(`✅ Created: ${successCount}`);
    console.log(`⏭️  Skipped: ${skipCount}`);
    console.log(`❌ Errors: ${errorCount}`);

    await prismaCoop.$disconnect();
    await prismaAuth.$disconnect();
    connection.end();
  });
}

// --------------------------------------------------------

// This is good but approvedCooperative not yet set, if log in, it looks like for Registration
// import connection from "./utils/connectToMySqlDb.js";
// import { prismaAuth } from "./utils/prismaAuth.js";
// import { prismaCoop } from "./utils/prismaCoop.js";
// import fs from "fs";
// import path from "path";
// import hashPasswordUtil from "./utils/hashPasswordUtil.js";
// import randomPassword from "./utils/randomPassword.js";

// const getAllPrimaryCoops = `
// SELECT
//   rc.*,
//   c.id                  AS mysql_coop_id,
//   c.users_id            AS mysql_users_id,
//   u.id                  AS user_id,
//   u.email               AS user_email,
//   u.first_name          AS user_first_name,
//   u.last_name           AS user_last_name,
//   u.middle_name         AS user_middle_name,
//   u.birthdate           AS user_birthdate,
//   u.contact_number      AS user_contact_number,
//   u.address             AS user_address

// FROM (
//   SELECT *,
//          ROW_NUMBER() OVER (
//            PARTITION BY regNo
//            ORDER BY id DESC
//          ) AS rn
//   FROM registeredcoop
// ) rc
// LEFT JOIN cooperatives c
//   ON rc.application_id = c.id
// LEFT JOIN users u
//   ON c.users_id = u.id
// WHERE rc.rn = 1
//   AND rc.category = 'Primary'
// LIMIT 5000;
// `;

// let mockEmailCounter = 1000;

// // Generate random string
// function randomString(length = 6) {
//   const chars = "abcdefghijklmnopqrstuvwxyz";
//   const nums = "0123456789";
//   let str = "";
//   for (let i = 0; i < length; i++) {
//     str += chars[Math.floor(Math.random() * chars.length)];
//   }
//   for (let i = 0; i < length; i++) {
//     str += nums[Math.floor(Math.random() * nums.length)];
//   }
//   return str;
// }

// // Log file path
// const logFilePath = path.join(process.cwd(), "user_credentials_log.txt");

// // Clear previous log
// fs.writeFileSync(logFilePath, "email,password\n");

// export default function runMigration() {
//   connection.query(getAllPrimaryCoops, async (err, results) => {
//     if (err) throw err;

//     let successCount = 0;
//     let skipCount = 0;
//     let errorCount = 0;

//     console.log(
//       `Starting migration of ${results.length} primary cooperatives...`
//     );

//     for (const [index, row] of results.entries()) {
//       try {
//         if ((index + 1) % 100 === 0 || index === results.length - 1) {
//           console.log(`Processing record ${index + 1} of ${results.length}...`);
//         }

//         if (!row.regNo?.trim()) {
//           skipCount++;
//           continue;
//         }

//         const regNo = row.regNo.trim();
//         let coopName = row.coopName?.trim() || `Unknown_${regNo}`;
//         let acronym = row.acronym?.trim() || "";

//         const acronymRegex = /\(([^)]+)\)/;
//         const acronymMatch = coopName.match(acronymRegex);
//         if (acronymMatch) {
//           if (!acronym) acronym = acronymMatch[1].trim();
//           coopName = coopName.replace(acronymRegex, "").trim();
//           coopName = coopName.replace(/\s+/g, " ").replace(/[,|-]\s*$/, "");
//         }

//         // Check if org already exists
//         let existingOrg = await prismaCoop.cooperativeOrg.findUnique({
//           where: { regNo },
//         });
//         if (!existingOrg) {
//           existingOrg = await prismaCoop.cooperativeOrg.findUnique({
//             where: { cooperativeName: coopName },
//           });
//         }
//         if (existingOrg) {
//           skipCount++;
//           continue;
//         }

//         // Create or find user
//         let userId = null;
//         let email = row.user_email?.trim();
//         let plainPassword = randomPassword();

//         if (!email) {
//           email = `user_cda+_${randomString()}_${mockEmailCounter}@gmail.com`;
//           mockEmailCounter++;
//         }

//         let existingUser = await prismaAuth.user.findFirst({
//           where: { email },
//         });

//         if (!existingUser) {
//           const hashedPassword = await hashPasswordUtil(plainPassword);
//           existingUser = await prismaAuth.user.create({
//             data: {
//               email,
//               firstname: row.user_first_name?.trim() || "Mock",
//               lastname: row.user_last_name?.trim() || "User",
//               middlename: row.user_middle_name?.trim() || "",
//               mobile: row.user_contact_number?.trim() || "",
//               address: row.user_address?.trim() || "",
//               status: "APPROVED",
//               migrated: 1,
//               verified_at: new Date(),
//               password: hashedPassword, // store hashed password
//             },
//           });

//           // Log email & plain password
//           fs.appendFileSync(logFilePath, `${email},${plainPassword}\n`);
//         }

//         userId = existingUser.id;

//         // Create Cooperative Org
//         const org = await prismaCoop.cooperativeOrg.create({
//           data: {
//             cooperativeName: coopName,
//             acronym,
//             regNo,
//             prevComplianceRemarks: row.compliant,
//             migrated: 1,
//             ownedBy: userId,
//           },
//         });

//         // Create Cooperative
//         await prismaCoop.cooperatives.create({
//           data: {
//             cooperativeOrgId: org.id,
//             cooperativeName: org.cooperativeName,
//             cooperativeCategory: row.category?.toLowerCase().trim(),
//             registrationId: regNo,
//             isAmendment: false,
//             formOfRegistration: "none",
//           },
//         });

//         successCount++;
//       } catch (error) {
//         errorCount++;
//         console.error(`[${index + 1}] ❌ Error`, error.message);
//       }
//     }

//     console.log("MIGRATION COMPLETED");
//     console.log(`✅ Created: ${successCount}`);
//     console.log(`⏭️  Skipped: ${skipCount}`);
//     console.log(`❌ Errors: ${errorCount}`);

//     await prismaCoop.$disconnect();
//     await prismaAuth.$disconnect();
//     connection.end();
//   });
// }

// ------------------------------------------------------

// Good but no hashed password and backup file yet
// import connection from "./utils/connectToMySqlDb.js";
// import { prismaAuth } from "./utils/prismaAuth.js";
// import { prismaCoop } from "./utils/prismaCoop.js";

// const getAllPrimaryCoops = `
// SELECT
//   rc.*,
//   c.id                  AS mysql_coop_id,
//   c.users_id            AS mysql_users_id,
//   u.id                  AS user_id,
//   u.email               AS user_email,
//   u.first_name          AS user_first_name,
//   u.last_name           AS user_last_name,
//   u.middle_name         AS user_middle_name,
//   u.birthdate           AS user_birthdate,
//   u.contact_number      AS user_contact_number,
//   u.address             AS user_address

// FROM (
//   SELECT *,
//          ROW_NUMBER() OVER (
//            PARTITION BY regNo
//            ORDER BY id DESC
//          ) AS rn
//   FROM registeredcoop
// ) rc
// LEFT JOIN cooperatives c
//   ON rc.application_id = c.id
// LEFT JOIN users u
//   ON c.users_id = u.id
// WHERE rc.rn = 1
//   AND rc.category = 'Primary'
// LIMIT 5000;
// `;

// export default function runMigration() {
//   connection.query(getAllPrimaryCoops, async (err, results) => {
//     if (err) throw err;

//     let successCount = 0;
//     let skipCount = 0;
//     let errorCount = 0;

//     console.log(
//       `Starting migration of ${results.length} primary cooperatives...`
//     );

//     for (const [index, row] of results.entries()) {
//       try {
//         if ((index + 1) % 100 === 0 || index === results.length - 1) {
//           console.log(`Processing record ${index + 1} of ${results.length}...`);
//         }

//         if (!row.regNo?.trim()) {
//           skipCount++;
//           continue;
//         }

//         const regNo = row.regNo.trim();
//         let coopName = row.coopName?.trim() || `Unknown_${regNo}`;
//         let acronym = row.acronym?.trim() || "";

//         const acronymRegex = /\(([^)]+)\)/;
//         const acronymMatch = coopName.match(acronymRegex);

//         if (acronymMatch) {
//           if (!acronym) acronym = acronymMatch[1].trim();
//           coopName = coopName.replace(acronymRegex, "").trim();
//           coopName = coopName.replace(/\s+/g, " ").replace(/[,|-]\s*$/, "");
//         }

//         // Check if org already exists
//         let existingOrg = await prismaCoop.cooperativeOrg.findUnique({
//           where: { regNo },
//         });
//         if (!existingOrg) {
//           existingOrg = await prismaCoop.cooperativeOrg.findUnique({
//             where: { cooperativeName: coopName },
//           });
//         }
//         if (existingOrg) {
//           skipCount++;
//           continue;
//         }

//         // Create or find user first
//         let userId = null;
//         if (row.user_email?.trim()) {
//           const email = row.user_email.trim();
//           let existingUser = await prismaAuth.user.findFirst({
//             where: { email },
//           }); // <-- changed

//           if (!existingUser) {
//             existingUser = await prismaAuth.user.create({
//               data: {
//                 email,
//                 firstname: row.user_first_name?.trim() || "",
//                 lastname: row.user_last_name?.trim() || "",
//                 middlename: row.user_middle_name?.trim() || "",
//                 mobile: row.user_contact_number?.trim() || "",
//                 address: row.user_address?.trim() || "",
//                 status: "APPROVED",
//                 migrated: 1,
//                 verified_at: new Date(),
//               },
//             });
//           }

//           userId = existingUser.id; // UUID assigned here
//         }

//         // Create Cooperative Org with ownedBy
//         const org = await prismaCoop.cooperativeOrg.create({
//           data: {
//             cooperativeName: coopName,
//             acronym,
//             regNo,
//             prevComplianceRemarks: row.compliant,
//             migrated: 1,
//             ownedBy: userId, // now points to newly created user
//           },
//         });

//         // Create Cooperative
//         await prismaCoop.cooperatives.create({
//           data: {
//             cooperativeOrgId: org.id,
//             cooperativeName: org.cooperativeName,
//             cooperativeCategory: row.category?.toLowerCase().trim(),
//             registrationId: regNo,
//             isAmendment: false,
//             formOfRegistration: "none",
//           },
//         });

//         successCount++;
//       } catch (error) {
//         errorCount++;
//         // Optionally log a concise error message
//         // console.error(`[${index + 1}] ❌ Error`, error.message);
//       }
//     }

//     console.log("MIGRATION COMPLETED");
//     console.log(`✅ Created: ${successCount}`);
//     console.log(`⏭️  Skipped: ${skipCount}`);
//     console.log(`❌ Errors: ${errorCount}`);

//     await prismaCoop.$disconnect();
//     await prismaAuth.$disconnect();
//     connection.end();
//   });
// }

// -----------------------------------------------------------------------------------

// Working fine but ownedBy of user not saving in the coop org and console log of batch improved
// import connection from "./utils/connectToMySqlDb.js";
// import { prismaAuth } from "./utils/prismaAuth.js";
// import { prismaCoop } from "./utils/prismaCoop.js";

// const getAllPrimaryCoops = `
// SELECT
//   rc.*,
//   c.id                  AS mysql_coop_id,
//   c.users_id            AS mysql_users_id,
//   u.id                  AS user_id,
//   u.email               AS user_email,
//   u.first_name          AS user_first_name,
//   u.last_name           AS user_last_name,
//   u.middle_name         AS user_middle_name,
//   u.birthdate           AS user_birthdate,
//   u.contact_number      AS user_contact_number,
//   u.address             AS user_address

// FROM (
//   SELECT *,
//          ROW_NUMBER() OVER (
//            PARTITION BY regNo
//            ORDER BY id DESC
//          ) AS rn
//   FROM registeredcoop
// ) rc
// LEFT JOIN cooperatives c
//   ON rc.application_id = c.id
// LEFT JOIN users u
//   ON c.users_id = u.id
// WHERE rc.rn = 1
//   AND rc.category = 'Primary'
// LIMIT 5000;
// `;

// export default function runMigration() {
//   connection.query(getAllPrimaryCoops, async (err, results) => {
//     if (err) throw err;

//     let successCount = 0;
//     let skipCount = 0;
//     let errorCount = 0;

//     console.log(
//       `Starting migration of ${results.length} primary cooperatives...`
//     );

//     for (const [index, row] of results.entries()) {
//       try {
//         // Only log progress in batches of 100
//         if ((index + 1) % 100 === 0 || index === results.length - 1) {
//           console.log(`Processing record ${index + 1} of ${results.length}...`);
//         }

//         if (!row.regNo?.trim()) {
//           skipCount++;
//           continue;
//         }

//         const regNo = row.regNo.trim();
//         let coopName = row.coopName?.trim() || `Unknown_${regNo}`;
//         let acronym = row.acronym?.trim() || "";

//         const acronymRegex = /\(([^)]+)\)/;
//         const acronymMatch = coopName.match(acronymRegex);

//         if (acronymMatch) {
//           if (!acronym) acronym = acronymMatch[1].trim();
//           coopName = coopName.replace(acronymRegex, "").trim();
//           coopName = coopName.replace(/\s+/g, " ").replace(/[,|-]\s*$/, "");
//         }

//         // Check if org already exists
//         let existingOrg = await prismaCoop.cooperativeOrg.findUnique({
//           where: { regNo },
//         });
//         if (!existingOrg) {
//           existingOrg = await prismaCoop.cooperativeOrg.findUnique({
//             where: { cooperativeName: coopName },
//           });
//         }
//         if (existingOrg) {
//           skipCount++;
//           continue;
//         }

//         // Create Cooperative Org
//         const org = await prismaCoop.cooperativeOrg.create({
//           data: {
//             cooperativeName: coopName,
//             acronym,
//             regNo,
//             prevComplianceRemarks: row.compliant,
//             migrated: 1,
//           },
//         });

//         // Create Cooperative
//         await prismaCoop.cooperatives.create({
//           data: {
//             cooperativeOrgId: org.id,
//             cooperativeName: org.cooperativeName,
//             cooperativeCategory: row.category?.toLowerCase().trim(),
//             registrationId: regNo,
//             isAmendment: false,
//             formOfRegistration: "none",
//           },
//         });

//         // Create User if email exists
//         if (row.user_email?.trim()) {
//           const email = row.user_email.trim();
//           const existingUser = await prismaAuth.user.findUnique({
//             where: { email },
//           });
//           if (!existingUser) {
//             await prismaAuth.user.create({
//               data: {
//                 email,
//                 firstname: row.user_first_name?.trim() || "",
//                 lastname: row.user_last_name?.trim() || "",
//                 middlename: row.user_middle_name?.trim() || "",
//                 mobile: row.user_contact_number?.trim() || "",
//                 address: row.user_address?.trim() || "",
//                 status: "APPROVED",
//                 migrated: 1,
//               },
//             });
//           }
//         }

//         successCount++;
//       } catch (error) {
//         errorCount++;
//         // Optionally log a concise error message for reference
//         // console.error(`[${index + 1}] ❌ Error`, error.message);
//       }
//     }

//     console.log("MIGRATION COMPLETED");
//     console.log(`✅ Created: ${successCount}`);
//     console.log(`⏭️  Skipped: ${skipCount}`);
//     console.log(`❌ Errors: ${errorCount}`);

//     await prismaCoop.$disconnect();
//     await prismaAuth.$disconnect();
//     connection.end();
//   });
// }

// ----------------------------------------------------------------

// Working fine but too much console log and user id not yet put in the coop org
// import connection from "./utils/connectToMySqlDb.js";
// import { prismaAuth } from "./utils/prismaAuth.js";
// import { prismaCoop } from "./utils/prismaCoop.js";

// const getAllPrimaryCoops = `
// SELECT
//   rc.*,
//   c.id                  AS mysql_coop_id,
//   c.users_id            AS mysql_users_id,
//   u.id                  AS user_id,
//   u.email               AS user_email,
//   u.first_name          AS user_first_name,
//   u.last_name           AS user_last_name,
//   u.middle_name         AS user_middle_name,
//   u.birthdate           AS user_birthdate,
//   u.contact_number      AS user_contact_number,
//   u.address             AS user_address

// FROM (
//   SELECT *,
//          ROW_NUMBER() OVER (
//            PARTITION BY regNo
//            ORDER BY id DESC
//          ) AS rn
//   FROM registeredcoop
// ) rc
// LEFT JOIN cooperatives c
//   ON rc.application_id = c.id
// LEFT JOIN users u
//   ON c.users_id = u.id
// WHERE rc.rn = 1
//   AND rc.category = 'Primary'
// LIMIT 5000;
// `;

// export default function runMigration() {
//   connection.query(getAllPrimaryCoops, async (err, results) => {
//     if (err) throw err;

//     let successCount = 0;
//     let skipCount = 0;
//     let errorCount = 0;
//     const duplicateNames = new Set();

//     console.log(
//       `Starting migration of ${results.length} primary cooperatives...`
//     );

//     for (const [index, row] of results.entries()) {
//       try {
//         if (index % 100 === 0) {
//           console.log(`Processing record ${index + 1} of ${results.length}...`);
//         }

//         if (!row.regNo?.trim()) {
//           skipCount++;
//           continue;
//         }

//         const regNo = row.regNo.trim();
//         let coopName = row.coopName?.trim() || `Unknown_${regNo}`;
//         let acronym = row.acronym?.trim() || "";

//         const acronymRegex = /\(([^)]+)\)/;
//         const acronymMatch = coopName.match(acronymRegex);

//         if (acronymMatch) {
//           if (!acronym) acronym = acronymMatch[1].trim();
//           coopName = coopName.replace(acronymRegex, "").trim();
//           coopName = coopName.replace(/\s+/g, " ").replace(/[,|-]\s*$/, "");
//         }

//         duplicateNames.add(coopName);

//         // Check if org already exists
//         let existingOrg = await prismaCoop.cooperativeOrg.findUnique({
//           where: { regNo },
//         });
//         if (!existingOrg) {
//           existingOrg = await prismaCoop.cooperativeOrg.findUnique({
//             where: { cooperativeName: coopName },
//           });
//         }
//         if (existingOrg) {
//           skipCount++;
//           continue;
//         }

//         // Create Cooperative Org
//         const org = await prismaCoop.cooperativeOrg.create({
//           data: {
//             cooperativeName: coopName,
//             acronym,
//             regNo,
//             prevComplianceRemarks: row.compliant,
//             migrated: 1,
//           },
//         });

//         // Create Cooperative
//         await prismaCoop.cooperatives.create({
//           data: {
//             cooperativeOrgId: org.id,
//             cooperativeName: org.cooperativeName,
//             cooperativeCategory: row.category?.toLowerCase().trim(),
//             registrationId: regNo,
//             isAmendment: false,
//             formOfRegistration: "none",
//           },
//         });

//         // Create User if email exists
//         if (row.user_email?.trim()) {
//           const email = row.user_email.trim();

//           const existingUser = await prismaAuth.user.findUnique({
//             where: { email },
//           });

//           if (!existingUser) {
//             await prismaAuth.user.create({
//               data: {
//                 email,
//                 firstname: row.user_first_name?.trim() || "",
//                 lastname: row.user_last_name?.trim() || "",
//                 middlename: row.user_middle_name?.trim() || "",
//                 mobile: row.user_contact_number?.trim() || "",
//                 address: row.user_address?.trim() || "",
//                 status: "APPROVED", // default approved
//               },
//             });
//           }
//         }

//         successCount++;

//         if (row.user_id) {
//           console.log(`[${index + 1}] 👤 Linked User`, {
//             coop: coopName,
//             application_id: row.application_id,
//             mysql_coop_id: row.mysql_coop_id,
//             users_id: row.mysql_users_id,
//             user: `${row.user_first_name} ${row.user_last_name}`,
//             email: row.user_email,
//           });
//         } else {
//           console.warn(
//             `[${index + 1}] ⚠️ No linked user for application_id ${
//               row.application_id
//             }`
//           );
//         }
//       } catch (error) {
//         console.error(`[${index + 1}] ❌ Error`, error.message);
//         errorCount++;
//       }
//     }

//     console.log("MIGRATION COMPLETED");
//     console.log(`✅ Created: ${successCount}`);
//     console.log(`⏭️  Skipped: ${skipCount}`);
//     console.log(`❌ Errors: ${errorCount}`);

//     await prismaCoop.$disconnect();
//     await prismaAuth.$disconnect();
//     connection.end();
//   });
// }

// -----------------------------------------------------
// import connection from "./utils/connectToMySqlDb.js";
// import { prismaAuth } from "./utils/prismaAuth.js";
// import { prismaCoop } from "./utils/prismaCoop.js";
// // import { RowDataPacket } from "mysql2";

// const getAllPrimaryCoops = `
// SELECT
//   rc.*,
//   c.id                  AS mysql_coop_id,
//   c.users_id            AS mysql_users_id,
//   u.id                  AS user_id,
//   u.email               AS user_email,
//   u.first_name          AS user_first_name,
//   u.last_name           AS user_last_name,
//   u.middle_name         AS user_middle_name,
//   u.birthdate           AS user_birthdate,
//   u.contact_number      AS user_contact_number,
//   u.address             AS user_address

// FROM (
//   SELECT *,
//          ROW_NUMBER() OVER (
//            PARTITION BY regNo
//            ORDER BY id DESC
//          ) AS rn
//   FROM registeredcoop
// ) rc
// LEFT JOIN cooperatives c
//   ON rc.application_id = c.id
// LEFT JOIN users u
//   ON c.users_id = u.id
// WHERE rc.rn = 1
//   AND rc.category = 'Primary'
// LIMIT 5000;
// `;

// export default function runMigration() {
//   connection.query(getAllPrimaryCoops, async (err, results) => {
//     if (err) throw err;

//     let successCount = 0;
//     let skipCount = 0;
//     let errorCount = 0;
//     const duplicateNames = new Set();

//     console.log(
//       `Starting migration of ${results.length} primary cooperatives...`
//     );

//     for (const [index, row] of results.entries()) {
//       try {
//         if (index % 100 === 0) {
//           console.log(`Processing record ${index + 1} of ${results.length}...`);
//         }

//         if (!row.regNo?.trim()) {
//           skipCount++;
//           continue;
//         }

//         const regNo = row.regNo.trim();
//         let coopName = row.coopName?.trim() || `Unknown_${regNo}`;
//         let acronym = row.acronym?.trim() || "";

//         const acronymRegex = /\(([^)]+)\)/;
//         const acronymMatch = coopName.match(acronymRegex);

//         if (acronymMatch) {
//           if (!acronym) acronym = acronymMatch[1].trim();
//           coopName = coopName.replace(acronymRegex, "").trim();
//           coopName = coopName.replace(/\s+/g, " ").replace(/[,|-]\s*$/, "");
//         }

//         duplicateNames.add(coopName);

//         let existingOrg = await prismaCoop.cooperativeOrg.findUnique({
//           where: { regNo },
//         });

//         if (!existingOrg) {
//           existingOrg = await prismaCoop.cooperativeOrg.findUnique({
//             where: { cooperativeName: coopName },
//           });
//         }

//         if (existingOrg) {
//           skipCount++;
//           continue;
//         }

//         const org = await prismaCoop.cooperativeOrg.create({
//           data: {
//             cooperativeName: coopName,
//             acronym,
//             regNo,
//             prevComplianceRemarks: row.compliant,
//             migrated: 1,
//             // createdBy: "migration",
//           },
//         });

//         await prismaCoop.cooperatives.create({
//           data: {
//             cooperativeOrgId: org.id,
//             cooperativeName: org.cooperativeName,
//             cooperativeCategory: row.category?.toLowerCase().trim(),
//             registrationId: regNo,
//             isAmendment: false,
//             formOfRegistration: "none",
//             // createdBy: "migration",
//           },
//         });

//         successCount++;

//         // 🔎 LOG JOINED USER INFO
//         if (row.user_id) {
//           console.log(`[${index + 1}] 👤 Linked User`, {
//             coop: coopName,
//             application_id: row.application_id,
//             mysql_coop_id: row.mysql_coop_id,
//             users_id: row.mysql_users_id,
//             user: `${row.user_first_name} ${row.user_last_name}`,
//             email: row.user_email,
//           });
//         } else {
//           console.warn(
//             `[${index + 1}] ⚠️ No linked user for application_id ${
//               row.application_id
//             }`
//           );
//         }
//       } catch (error) {
//         console.error(`[${index + 1}] ❌ Error`, error.message);
//         errorCount++;
//       }
//     }

//     console.log("MIGRATION COMPLETED");
//     console.log(`✅ Created: ${successCount}`);
//     console.log(`⏭️  Skipped: ${skipCount}`);
//     console.log(`❌ Errors: ${errorCount}`);

//     await prismaCoop.$disconnect();
//     connection.end();
//   });
// }
