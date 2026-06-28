// import fs from "fs";
// import path from "path";
// import connection from "./utils/connectToMySqlDb.js";
// import { prismaAuth } from "./utils/prismaAuth.js";
// import { prismaCoop } from "./utils/prismaCoop.js";

// import hashPasswordUtil from "./utils/hashPasswordUtil.js";
// import randomPassword from "./utils/randomPassword.js";
// import randomString from "./utils/randomString.js";
// import { generateReferenceId } from "./utils/generateReferenceId.js";

// import { resolveCompliance } from "./utils/resolveData.js";
// import { resolveCoopType } from "./utils/resolveData.js";
// import { normalizeDate } from "./utils/resolveData.js";
// import { normalizeAddress } from "./utils/resolveData.js";
// import { normalizeCategory } from "./utils/resolveData.js";
// import { normalizeAreaOfOperation } from "./utils/resolveData.js";
// import { RowDataPacket } from "mysql2";
// import { ApplicationStatus } from "@prisma/client/coop/index.js";
// import { generateUuid } from "./utils/generateUuid.js";
// import ref_regions from "./data/refregion.json" with { type: "json" };
// import { createCoopApplication } from "./utils/createCoopApplication.js";
// import { CoopRow } from "./types/coop.js";
// import {
//   createApplication,
//   createCoopOrg,
//   createRepresentative,
// } from "./utils/createCoopOrg.js";

// import {
//   TCoopCategory,
//   TCoopApplication,
// } from "./utils/createCoopApplication.js";

// const counterCoop = 1;

// const getCoop = `
// SELECT
//   rc.*,

//   c.id                    		AS mysql_coop_id,
//   c.users_id              		AS mysql_users_id,
//   c.category_of_cooperative   	AS c_coop_category,
//   c.type_of_cooperative   		AS c_coop_type,
//   c.field_of_membership   		AS c_field_of_membership,

//   u.id                   AS user_id,
//   u.email                AS user_email,
//   u.first_name           AS user_first_name,
//   u.last_name            AS user_last_name,
//   u.middle_name          AS user_middle_name,
//   u.birthdate            AS user_birthdate,
//   u.contact_number       AS user_contact_number,
//   u.address              AS user_address,
//   u.type_id              AS user_typeId,
//   u.valid_id_number      AS user_id_no,
//   u.is_verified          AS user_isVerified,

//   (
//     SELECT COALESCE(
//       JSON_ARRAYAGG(
//         JSON_OBJECT(
//           'id', ca.id,
//           'fullname', ca.fullname,
//           'position', ca.position,
// 		  'email', ca.email,
//           'mobileNo', ca.mobileNo,
// 		  'idType', ca.idType,
// 		  'idNo', ca.idNo
//         )
//       ),
//       JSON_ARRAY()
//     )
//     FROM ca_user ca
//     WHERE ca.regNo = rc.regNo
//       AND ca.is_verified = '1'
//       AND ca.status <> 'Denied'
//   ) AS ca_users,

//    -- COOPERATORS
//   (
//     SELECT COALESCE(
//       JSON_ARRAYAGG(
//         JSON_OBJECT(
//           'id', coop.id,
//           'fullName', coop.full_name
//         )
//       ),
//       JSON_ARRAY()
//     )
//     FROM cooperators coop
//     WHERE coop.cooperatives_id = rc.application_id
//   ) AS cooperators,

//    -- Business Activities
//   (
//     SELECT COALESCE(
//       JSON_ARRAYAGG(
//         JSON_OBJECT(
//           'industrySubclassByCooTypeId', b_act.industry_subclass_by_coop_type_id
//         )
//       ),
//       JSON_ARRAY()
//     )
//     FROM business_activities_cooperative b_act
//     WHERE b_act.cooperatives_id = rc.application_id
//   ) AS business_act,

//    -- Composition Of Members
//   (
//     SELECT COALESCE(
//       JSON_ARRAYAGG(
//         JSON_OBJECT(
//           'composition', comp_members.composition
//         )
//       ),
//       JSON_ARRAY()
//     )
//     FROM members_composition_of_cooperative comp_members
//     WHERE comp_members.coop_id = rc.application_id
//   ) AS composition_members,

//    -- Branches/Satellites
//   (
//     SELECT COALESCE(
//       JSON_ARRAYAGG(
//         JSON_OBJECT(
//           'branchName', branch.branchName,
//           'certNo', branch.certNo
//         )
//       ),
//       JSON_ARRAY()
//     )
//     FROM branches branch
//     WHERE branch.regNo = rc.regNo
//   ) AS branchSatellite,

//    -- Laboratory
//   (
//     SELECT COALESCE(
//       JSON_ARRAYAGG(
//         JSON_OBJECT(
//           'labName', lab.labName,
//           'laboratoryName', lab.laboratoryName
//         )
//       ),
//       JSON_ARRAY()
//     )
//     FROM laboratories lab
//     WHERE lab.coop_id = rc.regNo
//   ) AS laboratory,

//    aoc.years_of_existence            AS aoc_yearsOfExistence,

//    bl.kinds_of_members				 AS bl_kindsOfMembers,

//    cap.regular_members				 AS cap_regularMembers,
//    cap.authorized_share_capital		 AS cap_authorizedShareCapital,

//    purp.content				 		 AS purposes_content

// FROM registeredcoop rc

// LEFT JOIN cooperatives c
//   ON rc.application_id = c.id

// LEFT JOIN users u
//   ON c.users_id = u.id

// LEFT JOIN articles_of_cooperation aoc
//   ON rc.application_id = aoc.cooperatives_id

// LEFT JOIN bylaws bl
//   ON rc.application_id = bl.cooperatives_id

// LEFT JOIN capitalization cap
//   ON rc.application_id = cap.cooperatives_id

// LEFT JOIN purposes purp
//   ON rc.application_id = purp.cooperatives_id

// WHERE rc.regNo = '9520-100400031130'

// ORDER BY rc.id ASC
// `;

// // LIMIT 100 OFFSET 200;

// // let mockEmailCounter = 1000;

// /**
//  * Log file path
//  */
// const logFilePath = path.join(process.cwd(), "user_credentials_log.txt");

// /**
//  * Clear previous log
//  */
// fs.writeFileSync(logFilePath, "Cooperatives Credentials\n");

// let mockEmailCounter = 1000;
// let successCount = 0;
// let skipCount = 0;
// let noRegNoCount = 0;
// let unknownTypeCount = 0;
// let duplicateCount = 0;
// let errorCount = 0;

// export default function sixthTestMigration() {
//   connection.query<any>(getCoop, async (err, res) => {
//     if (err) throw err;

//     const results = res[0];

//     console.log(results);
//     //  return console.log(results)

//     // console.log("Results: ", results);

//     // console.log("Reg No: ", results.regNo);
//     // console.log("Coop Name: ", results.coopName);

//     if (!results?.regNo) {
//       skipCount++;
//       noRegNoCount++;
//       console.log("No Reg Number: ", results.coopName);
//     }

//     // console.log("New Rep: ", newRepresentative);

//     // console.log(`Starting migration of ${results.length} cooperatives...`);

//     const newRepresentative = createRepresentative(results, mockEmailCounter);

//     // Create User in Auth Service
//     let existingUser;

//     try {
//       existingUser = await prismaAuth.user.findFirst({
//         where: { email: newRepresentative.email },
//       });

//       // console.log("Existing User: ", existingUser);

//       if (!existingUser) {
//         const hashedPassword = await hashPasswordUtil(
//           newRepresentative.password,
//         );

//         existingUser = await prismaAuth.user.create({
//           data: {
//             id: generateUuid(),
//             email: newRepresentative.email,
//             firstname: newRepresentative.firstname,
//             middlename: newRepresentative.middlename,
//             lastname: newRepresentative.lastname,
//             mobile: newRepresentative.contactNumber,
//             address: newRepresentative.address,
//             status: "approved",
//             migrated: 1,
//             verified_at: new Date(),
//             password: hashedPassword,
//           },
//         });

//         const spacer = "   ";

//         fs.appendFileSync(
//           logFilePath,
//           // `${results.regNo}${spacer}${results.coopName}${spacer}${results.email}${spacer}${results.plainPassword}${spacer}${results.myRegion.regCode}${spacer}${results.myRegion.regDesc}\n`, // Add Region
//           // `${results.regNo}${spacer}${results.coopName}${spacer}${results.email}${spacer}${results.plainPassword}`, // Add Region
//           `${newRepresentative.email}${spacer}${newRepresentative.password}\n`, // Add Region
//         );
//       }
//     } catch (error) {
//       console.error("Error creating representative:", error);
//     }

//     // Create Coop Org
//     try {
//       // const newReferenceId = generateReferenceId();

//       // const newCoopOrg = createCoopOrg(results, newRepresentative);
//       const {
//         cooperativeName,
//         acronym,
//         regNo,
//         dateOfRegistration,
//         email,
//         contact_number,
//         ...rest
//       } = createCoopOrg(results, newRepresentative);

//       await prismaCoop.cooperativeOrg.create({
//         data: {
//           cooperativeName: cooperativeName,
//           acronym: acronym,
//           regNo: regNo,
//           dateOfRegistration: dateOfRegistration,
//           // // prevComplianceRemarks: row.compliant,
//           // recentAmendmentDate: recentAmendmentDateRegistration || null,
//           // amendmentCount: registeredAmendment.amendmentNo || null,
//           email: email,
//           // alternate_email: "",
//           contact_number: contact_number,
//           // alternate_contact_number: "",
//           // //     finalName = {
//           // //   firstName: row?.user_first_name?.trim(),
//           // //   middleName: row?.user_middle_name?.trim(),
//           // //   lastName: row?.user_last_name?.trim(),
//           // // };
//           primaryRepresentative: {
//             create: {
//               firstname: newRepresentative.firstname,
//               lastname: newRepresentative.lastname,
//               middlename: newRepresentative.middlename,
//               title: "",
//               designation: newRepresentative.designation,
//               // gender: "Male",
//               nationality: newRepresentative.nationality,
//               birth_date: newRepresentative.birth_date,
//               id_no: newRepresentative.id_no,
//               // governmentId: "Passport",
//             },
//           },
//           // // alternateRepresentative: "",
//           // // laboratories: []
//           // // BranchSatellite: []
//           ownedBy: existingUser?.id,
//           ...rest,

//           // cooperatives: {
//           //   connect: [
//           //     { id: initial.id },
//           //     ...(amendment ? [{ id: amendment.id }] : []),
//           //   ],
//           // },

//           // approvedCooperative: {
//           //   connect: { id: approvedCoopData.id },
//           // },
//         },
//       });

//       // console.log(newCoopOrg);
//     } catch (error) {
//       console.error("Error creating coop org:", error);
//     }

//     // Create Application
//     try {
//       const {
//         // cooperativeName: _coopName,
//         // cooperativeNameAcronym: _coopAcronym,

//         ...coopRest
//       } = createApplication(results);
//     } catch (error) {
//       console.error("Error creating application:", error);
//     }

//     // console.log("MIGRATION COMPLETED");
//     // console.log(`✅ Created: ${successCount}`);
//     // console.log(`⏭️  Skipped: ${skipCount}`);
//     // console.log(`⏭️  No Reg: ${noRegNoCount}`);
//     // console.log(`⏭️  Unknown Type: ${unknownTypeCount}`);

//     // console.log(`❌ Errors: ${errorCount}`);

//     await prismaCoop.$disconnect();
//     await prismaAuth.$disconnect();
//     connection.end();

//     console.log("✅ Migration finished");
//   });
// }

// // Feb 11, Wed - Query for MySQL ---------------------------------

// // SELECT
// //   rc.*,

// //   c.id                    		AS mysql_coop_id,
// //   c.users_id              		AS mysql_users_id,
// //   c.category_of_cooperative   	AS c_coop_category,
// //   c.type_of_cooperative   		AS c_coop_type,
// //   c.field_of_membership   		AS c_field_of_membership,

// //   u.id                   AS user_id,
// //   u.email                AS user_email,
// //   u.first_name           AS user_first_name,
// //   u.last_name            AS user_last_name,
// //   u.middle_name          AS user_middle_name,
// //   u.birthdate            AS user_birthdate,
// //   u.contact_number       AS user_contact_number,
// //   u.address              AS user_address,

// //   (
// //     SELECT COALESCE(
// //       JSON_ARRAYAGG(
// //         JSON_OBJECT(
// //           'id', ca.id,
// //           'fullname', ca.fullname,
// //           'position', ca.position,
// //           'email', ca.email,
// //           'mobileNo', ca.mobileNo
// //         )
// //       ),
// //       JSON_ARRAY()
// //     )
// //     FROM `e-coopris`.ca_user ca
// //     WHERE ca.regNo = rc.regNo
// //       AND ca.is_verified = '1'
// //       AND ca.status <> 'Denied'
// //   ) AS ca_users,

// //    -- COOPERATORS
// //   (
// //     SELECT COALESCE(
// //       JSON_ARRAYAGG(
// //         JSON_OBJECT(
// //           'id', coop.id,
// //           'fullName', coop.full_name
// //         )
// //       ),
// //       JSON_ARRAY()
// //     )
// //     FROM `e-coopris`.cooperators coop
// //     WHERE coop.cooperatives_id = rc.application_id
// //   ) AS cooperators,

// //    -- Business Activities
// //   (
// //     SELECT COALESCE(
// //       JSON_ARRAYAGG(
// //         JSON_OBJECT(
// //           'industrySubclassByCooTypeId', b_act.industry_subclass_by_coop_type_id
// //         )
// //       ),
// //       JSON_ARRAY()
// //     )
// //     FROM `e-coopris`.business_activities_cooperative b_act
// //     WHERE b_act.cooperatives_id = rc.application_id
// //   ) AS business_act,

// //    -- Composition Of Members
// //   (
// //     SELECT COALESCE(
// //       JSON_ARRAYAGG(
// //         JSON_OBJECT(
// //           'composition', comp_members.composition
// //         )
// //       ),
// //       JSON_ARRAY()
// //     )
// //     FROM `e-coopris`.members_composition_of_cooperative comp_members
// //     WHERE comp_members.coop_id = rc.application_id
// //   ) AS composition_members,

// //    -- Branches/Satellites
// //   (
// //     SELECT COALESCE(
// //       JSON_ARRAYAGG(
// //         JSON_OBJECT(
// //           'branchName', branch.branchName,
// //           'certNo', branch.certNo
// //         )
// //       ),
// //       JSON_ARRAY()
// //     )
// //     FROM `e-coopris`.branches branch
// //     WHERE branch.regNo = rc.regNo
// //   ) AS branchSatellite,

// //    -- Laboratory
// //   (
// //     SELECT COALESCE(
// //       JSON_ARRAYAGG(
// //         JSON_OBJECT(
// //           'labName', lab.labName,
// //           'laboratoryName', lab.laboratoryName
// //         )
// //       ),
// //       JSON_ARRAY()
// //     )
// //     FROM `e-coopris`.laboratories lab
// //     WHERE lab.coop_id = rc.regNo
// //   ) AS laboratory,

// //    aoc.years_of_existence            AS aoc_yearsOfExistence,

// //    bl.kinds_of_members				 AS bl_kindsOfMembers,

// //    cap.regular_members				 AS cap_regularMembers,
// //    cap.authorized_share_capital		 AS cap_authorizedShareCapital,

// //    purp.content				 		 AS purposes_content

// // FROM `e-coopris`.registeredcoop rc

// // LEFT JOIN `e-coopris`.cooperatives c
// //   ON rc.application_id = c.id

// // LEFT JOIN `e-coopris`.users u
// //   ON c.users_id = u.id

// // LEFT JOIN `e-coopris`.articles_of_cooperation aoc
// //   ON rc.application_id = aoc.cooperatives_id

// // LEFT JOIN `e-coopris`.bylaws bl
// //   ON rc.application_id = bl.cooperatives_id

// // LEFT JOIN `e-coopris`.capitalization cap
// //   ON rc.application_id = cap.cooperatives_id

// // LEFT JOIN `e-coopris`.purposes purp
// //   ON rc.application_id = purp.cooperatives_id

// // WHERE rc.regNo = '9520-100400031130'

// // ORDER BY rc.id ASC
