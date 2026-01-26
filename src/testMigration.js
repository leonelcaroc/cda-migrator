import connection from "./utils/connectToMySqlDb.js";
import { prismaAuth } from "./utils/prismaAuth.js";
import { prismaCoop } from "./utils/prismaCoop.js";
import fs from "fs";
import path from "path";
import hashPasswordUtil from "./utils/hashPasswordUtil.js";
import randomPassword from "./utils/randomPassword.js";
import randomString from "./utils/randomString.js";
import { generateReferenceId } from "./utils/generateReferenceId.js";

/**
 * GET ALL PRIMARY COOPERATIVES
 * with capitalization data
 */

// All Coops

const getAllCoops = `
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
  u.address             AS user_address,

  cap.id                AS capitalization_id,
  cap.regular_members,
  cap.associate_members,
  cap.authorized_share_capital,
  cap.par_value,
  cap.common_share,
  cap.preferred_share,
  cap.total_amount_of_subscribed_capital,
  cap.total_no_of_subscribed_capital,
  cap.total_amount_of_paid_up_capital,
  cap.total_no_of_paid_up_capital,
  cap.minimum_subscribed_share_regular,
  cap.minimum_paid_up_share_regular,
  cap.minimum_subscribed_share_associate,
  cap.minimum_paid_up_share_associate,
  cap.amount_of_common_share_subscribed,
  cap.amount_of_common_share_subscribed_pervalue,
  cap.amount_of_preferred_share_subscribed,
  cap.amount_of_preferred_share_subscribed_pervalue,
  cap.amount_of_common_share_paidup,
  cap.amount_of_common_share_paidup_pervalue,
  cap.amount_of_preferred_share_paidup,
  cap.amount_of_preferred_share_paidup_pervalue
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
LEFT JOIN capitalization cap
  ON rc.application_id = cap.cooperatives_id
LEFT JOIN purposes p
  ON p.cooperatives_id = c.id

WHERE rc.rn = 1

LIMIT 500;
`;
// Limit to 500 coops

// Get 5 coops for testing
// const getAllCoops = `
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
//   u.address             AS user_address,

//   cap.id                AS capitalization_id,
//   cap.regular_members,
//   cap.associate_members,
//   cap.authorized_share_capital,
//   cap.par_value,
//   cap.common_share,
//   cap.preferred_share,
//   cap.total_amount_of_subscribed_capital,
//   cap.total_no_of_subscribed_capital,
//   cap.total_amount_of_paid_up_capital,
//   cap.total_no_of_paid_up_capital,
//   cap.minimum_subscribed_share_regular,
//   cap.minimum_paid_up_share_regular,
//   cap.minimum_subscribed_share_associate,
//   cap.minimum_paid_up_share_associate,
//   cap.amount_of_common_share_subscribed,
//   cap.amount_of_common_share_subscribed_pervalue,
//   cap.amount_of_preferred_share_subscribed,
//   cap.amount_of_preferred_share_subscribed_pervalue,
//   cap.amount_of_common_share_paidup,
//   cap.amount_of_common_share_paidup_pervalue,
//   cap.amount_of_preferred_share_paidup,
//   cap.amount_of_preferred_share_paidup_pervalue
// FROM (
//   SELECT *,
//          ROW_NUMBER() OVER (
//            PARTITION BY regNo
//            ORDER BY id DESC
//          ) AS rn
//   FROM registeredcoop
//    WHERE id IN (26130, 26137, 30056, 33121, 33253)
// ) rc
// LEFT JOIN cooperatives c
//   ON rc.application_id = c.id
// LEFT JOIN users u
//   ON c.users_id = u.id
// LEFT JOIN capitalization cap
//   ON rc.application_id = cap.cooperatives_id
// LEFT JOIN purposes p
//   ON p.cooperatives_id = c.id

// WHERE rc.rn = 1
// `;

// id 29420, 29754, 29886
// new id 26130, 26137, 30056, 33121, 33253
// new
// LIMIT 100;

let mockEmailCounter = 1000;

/**
 * Log file path
 */
const logFilePath = path.join(process.cwd(), "user_credentials_log.txt");

/**
 * Clear previous log
 */
fs.writeFileSync(logFilePath, "email,password\n");

export default function runTestMigration() {
  connection.query(getAllCoops, async (err, results) => {
    if (err) throw err;

    let successCount = 0;
    let skipCount = 0;
    let noRegNoCount = 0;
    let unknownTypeCount = 0;
    let duplicateCount = 0;
    let errorCount = 0;

    console.log(`Starting migration of ${results.length} cooperatives...`);

    for (const [index, row] of results.entries()) {
      try {
        if ((index + 1) % 100 === 0 || index === results.length - 1) {
          console.log(`Processing record ${index + 1} of ${results.length}...`);
        }

        const regNo = row.regNo.trim();

        const newReferenceId = generateReferenceId();

        const dateOfRegistration = normalizeDate(row.dateRegistered);

        let coopName = row.coopName?.trim();

        if (!regNo) {
          skipCount++;
          noRegNoCount++;
          console.log("No Reg Number: ", coopName);
          continue;
        }

        if (row.content && row.content.trim() !== "") {
          console.log(`Coop Name: ${coopName} | RegNo: ${regNo}`);
        }

        const coopCategory =
          row.category?.toLowerCase().trim() === "others"
            ? "secondary"
            : row.category?.toLowerCase().trim();
        let acronym = row.acronym?.trim() || "";

        const acronymRegex = /\(([^)]+)\)/;
        const acronymMatch = coopName.match(acronymRegex);

        if (acronymMatch) {
          if (!acronym) acronym = acronymMatch[1].trim();
          coopName = coopName.replace(acronymRegex, "").trim();
          coopName = coopName.replace(/\s+/g, " ").replace(/[,|-]\s*$/, "");
        }

        let addrCode = row.addrCode?.toString().trim() || "";

        // Remove /n /r and any hidden characters
        addrCode = addrCode.replace(/\D+/g, "");

        if (addrCode.startsWith("00")) {
          // Remove only the first character
          addrCode = addrCode.slice(1);
        }

        // Remove first character string if length is 10
        if (addrCode.length === 10) {
          addrCode = addrCode.slice(1);
        }

        // pad if needed
        if (addrCode.length === 1 || addrCode.length === 3)
          addrCode = "0" + addrCode;

        if (addrCode.length === 2 && addrCode === "18") addrCode = "17";

        // just slice — no nulls
        const regCode = addrCode.slice(0, 2);
        const provCode = addrCode.slice(0, 4);
        const citymunCode = addrCode.slice(0, 6);
        const brgyCode = addrCode.slice(0, 9);

        // if (addrCode.length !== 9) {
        //   console.log("Incomplete addrCode:", coopName, regNo, addrCode);
        // }

        const coopCompliance = resolveCompliance(row);

        const coopType = resolveCoopType(row, row.cooperativeName);

        if (coopType.type === "unknown") {
          skipCount++;
          console.log(coopName);
          console.log("No Coop Type: ", coopName);
          console.warn(
            `[SKIP] Missing coop type | RegNo: ${regNo} | Name: ${coopName} | Raw type: ${row.type}`,
          );
          continue;
        }

        /**
         * SAFE NUMBERS
         */
        const totalAuthorizedShareCapital = Number.isFinite(
          Number(row.authorized_share_capital),
        )
          ? Number(row.authorized_share_capital)
          : 0;

        const totalNoOfRegularMembers = Number.isFinite(
          Number(row.regular_members),
        )
          ? Number(row.regular_members)
          : 0;

        const totalNoOfAssociateMembers = Number.isFinite(
          Number(row.associate_members),
        )
          ? Number(row.associate_members)
          : 0;

        const parValueCommonShare = row.par_value;
        const noOfCommonShare = row.common_share;
        const noOfPreferredShare = row.preferred_share;
        const totalAmountOfSubscribedCapita =
          row.total_amount_of_subscribed_capital;
        const totalNoOfSubscribedCapital = row.total_no_of_subscribed_capital;
        const totalAmountOfPaidUpCapital = row.total_amount_of_paid_up_capital;
        const totalNoOfPaidUpCapital = row.total_no_of_paid_up_capital;
        const minimumSubscribeRegular = row.minimum_subscribed_share_regular;
        const minimumPaidUpRegular = row.minimum_paid_up_share_regular;
        const minimumPaidUpAssociate = row.minimum_subscribed_share_associate;
        const amountOfCommonShareSubscribed =
          row.amount_of_common_share_subscribed;
        // const parValueCommonShare = row.amount_of_common_share_subscribed_pervalue;
        const amountOfPreferredShareSubscribed =
          row.amount_of_preferred_share_subscribed;
        // const parValueCommonShare = row.amount_of_preferred_share_subscribed_pervalue;

        const amountOfCommonSharePaidUp = row.amount_of_common_share_paidup;
        // const parValueCommonShare = row.amount_of_common_share_paidup_pervalue;
        const amountOfPreferredSharePaidUp =
          row.amount_of_preferred_share_paidup;
        // const parValueCommonShare = row.amount_of_preferred_share_paidup_pervalue;

        /**
         * Skip if org already exists
         */
        let existingOrg = await prismaCoop.cooperativeOrg.findUnique({
          where: { regNo },
        });

        if (!existingOrg) {
          existingOrg = await prismaCoop.cooperativeOrg.findUnique({
            where: { cooperativeName: coopName },
          });
        }

        if (existingOrg) {
          duplicateCount++;
          console.log("Existing ORG: ", coopName);
          continue;
        }

        /**
         * USER
         */
        let email = row.user_email?.trim();
        let plainPassword = randomPassword();

        if (!email) {
          email = `user_cda_${randomString()}_${mockEmailCounter}@gmail.com`;
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

          fs.appendFileSync(logFilePath, `${email},${plainPassword}\n`);
        }

        try {
          await prismaCoop.cooperativeOrg.create({
            data: {
              cooperativeName: coopName,
              acronym,
              regNo,
              dateOfRegistration: dateOfRegistration,
              prevComplianceRemarks: row.compliant,
              migrated: 1,
              ownedBy: existingUser.id,

              ...(coopCompliance.complianceStatusId &&
              coopCompliance.complianceStatusId > 0
                ? {
                    complianceStatus: {
                      connect: { id: coopCompliance.complianceStatusId },
                    },
                  }
                : {}),

              ...(coopCompliance.complianceCategoryId &&
              coopCompliance.complianceCategoryId > 0
                ? {
                    complianceCategory: {
                      connect: { id: coopCompliance.complianceCategoryId },
                    },
                  }
                : {}),

              ...(coopCompliance.complianceTypeId &&
              coopCompliance.complianceTypeId > 0
                ? {
                    complianceType: {
                      connect: { id: coopCompliance.complianceTypeId },
                    },
                  }
                : {}),

              approvedCooperative: {
                create: {
                  cooperativeName: coopName,
                  cooperativeCategory: coopCategory,
                  cooperativeType: {
                    connect: { id: coopType.id },
                  },
                  coopTypeList: coopType.coopTypeList,
                  registrationId: newReferenceId,
                  isAmendment: false,
                  formOfRegistration: "none",
                  totalAuthorizedShareCapital,
                  totalNoOfRegularMembers,
                  totalNoOfAssociateMembers,
                  isDraft: false,
                  applicationStatus: "APPROVED",
                  ...(regCode && regCode.length === 2
                    ? { region: { connect: { regCode } } }
                    : {}),

                  ...(provCode && provCode.length === 4
                    ? { province: { connect: { provCode } } }
                    : {}),

                  ...(citymunCode && citymunCode.length === 6
                    ? { cityMunicipality: { connect: { citymunCode } } }
                    : {}),

                  ...(brgyCode && brgyCode.length === 9
                    ? { barangay: { connect: { brgyCode } } }
                    : {}),
                },
              },
            },
          });
        } catch (error) {
          errorCount++;

          // if (error.code === "P2002") {
          //   console.warn(
          //     `[${index + 1}] ⚠️ DUPLICATE coopName`,
          //     coopName,
          //     "| regNo:",
          //     regNo
          //   );
          // } else

          if (error.code === "P2025" && error.meta?.cause) {
            const cause = error.meta.cause;

            if (cause.includes("Regions")) {
              console.warn(`[REGION ERROR]`, regCode, coopName, regNo);
            } else if (cause.includes("Provinces")) {
              console.warn(`[PROVINCE ERROR]`, provCode, coopName, regNo);
            } else if (cause.includes("CityMunicipalities")) {
              console.warn(`[CITYMUN ERROR]`, citymunCode, coopName, regNo);
            } else if (cause.includes("Barangays")) {
              console.warn(`[BARANGAY ERROR]`, brgyCode, coopName, regNo);
            } else {
              console.error(`[${index + 1}] ❌ Unknown P2025 Error`, error);
            }
          } else {
            console.error(`[${index + 1}] ❌ Error`, coopName, regNo, error);
          }

          continue;

          // if (error.code === "P2025" && error.meta?.cause) {
          //   const cause = error.meta.cause;

          //   if (cause.includes("Regions")) {
          //     console.warn(
          //       `[REGION ERROR] regCode: ${regCode}, coopName: ${coopName}, regNo: ${regNo}`
          //     );
          //   } else if (cause.includes("Provinces")) {
          //     console.warn(
          //       `[PROVINCE ERROR] provCode: ${provCode}, coopName: ${coopName}, regNo: ${regNo}`
          //     );
          //   } else if (cause.includes("CityMunicipalities")) {
          //     console.warn(
          //       `[CITYMUN ERROR] citymunCode: ${citymunCode}, coopName: ${coopName}, regNo: ${regNo}`
          //     );
          //   } else if (cause.includes("Barangays")) {
          //     console.warn(
          //       `[BARANGAY ERROR] brgyCode: ${brgyCode}, coopName: ${coopName}, regNo: ${regNo}`
          //     );
          //   } else {
          //     console.error(`[${index + 1}] ❌ Unknown P2025 Error`, error);
          //   }
          // } else {
          //   console.error(`[${index + 1}] ❌ Error`, error);
          // }
          // continue;
        }

        successCount++;
      } catch (error) {
        errorCount++;
        console.log("Error: ", coopName, regNo);
        console.error(`[${index + 1}] ❌ Error`, error);
      }
    }

    console.log("MIGRATION COMPLETED");
    console.log(`✅ Created: ${successCount}`);
    console.log(`⏭️  Skipped: ${skipCount}`);
    console.log(`⏭️  No Reg: ${noRegNoCount}`);
    console.log(`⏭️  Unknown Type: ${unknownTypeCount}`);

    console.log(`❌ Errors: ${errorCount}`);

    await prismaCoop.$disconnect();
    await prismaAuth.$disconnect();
    connection.end();
  });
}

//   AND rc.category = 'Secondary'
// LIMIT 1000;

// Coop from 5000 - 10000

// const getAllCoops = `SELECT *
// FROM (
//   SELECT
//     rc.*,

//     c.id                  AS mysql_coop_id,
//     c.users_id            AS mysql_users_id,

//     u.id                  AS user_id,
//     u.email               AS user_email,
//     u.first_name          AS user_first_name,
//     u.last_name           AS user_last_name,
//     u.middle_name         AS user_middle_name,
//     u.birthdate           AS user_birthdate,
//     u.contact_number      AS user_contact_number,
//     u.address             AS user_address,

//     cap.id                AS capitalization_id,
//     cap.regular_members,
//     cap.associate_members,
//     cap.authorized_share_capital,
//     cap.par_value,
//     cap.common_share,
//     cap.preferred_share,
//     cap.total_amount_of_subscribed_capital,
//     cap.total_no_of_subscribed_capital,
//     cap.total_amount_of_paid_up_capital,
//     cap.total_no_of_paid_up_capital,
//     cap.minimum_subscribed_share_regular,
//     cap.minimum_paid_up_share_regular,
//     cap.minimum_subscribed_share_associate,
//     cap.minimum_paid_up_share_associate,
//     cap.amount_of_common_share_subscribed,
//     cap.amount_of_common_share_subscribed_pervalue,
//     cap.amount_of_preferred_share_subscribed,
//     cap.amount_of_preferred_share_subscribed_pervalue,
//     cap.amount_of_common_share_paidup,
//     cap.amount_of_common_share_paidup_pervalue,
//     cap.amount_of_preferred_share_paidup,
//     cap.amount_of_preferred_share_paidup_pervalue,

//     ROW_NUMBER() OVER (ORDER BY rc.id) AS row_num
//   FROM (
//     SELECT *,
//            ROW_NUMBER() OVER (
//              PARTITION BY regNo
//              ORDER BY id DESC
//            ) AS rn
//     FROM registeredcoop
//   ) rc
//   LEFT JOIN cooperatives c
//     ON rc.application_id = c.id
//   LEFT JOIN users u
//     ON c.users_id = u.id
//   LEFT JOIN capitalization cap
//     ON rc.application_id = cap.cooperatives_id
//   WHERE rc.rn = 1
// ) t
// WHERE t.row_num BETWEEN 5000 AND 10000;
// `;

function resolveCompliance(row) {
  const complianceMap = [
    { match: "compliant: issued with coc", statusId: 1, categoryId: 2 },
    { match: "compliant", statusId: 1, categoryId: 2 },

    {
      match: "non-compliant: issued with sho",
      statusId: 2,
      categoryId: 4,
    },
    { match: "issued with show cause", statusId: 2, categoryId: 4 },

    {
      match: "non-compliant: issued with not",
      statusId: 2,
      categoryId: 3,
    },

    {
      match: "non-compliant: under dissoluti",
      statusId: 2,
      categoryId: 5,
    },
    { match: "under dissolution", statusId: 2, categoryId: 5 },

    {
      match: "non-compliant: under liquidati",
      statusId: 3,
      categoryId: 7,
    },
    { match: "under liquidation", statusId: 3, categoryId: 7 },

    { match: "non-compliant: dissolved", statusId: 3, categoryId: 6 },
    {
      match: "non-compliant: dissolved due t",
      statusId: 3,
      categoryId: 6,
    },
    { match: "dissolved", statusId: 3, categoryId: 6 },

    { match: "non-compliant: cancelled", statusId: 3, categoryId: 8 },
    { match: "cancelled", statusId: 3, categoryId: 8 },

    { match: "non-compliant: delisted", statusId: 3, categoryId: 9 },
    { match: "delisted", statusId: 3, categoryId: 9 },

    { match: "consolidated", statusId: 5 },
    { match: "merged", statusId: 4 },
  ];

  if (!row.compliant || !row.compliant.trim()) {
    return {
      complianceStatusId: 6, // Unclassified
      complianceCategoryId: 0,
      complianceTypeId: 0,
    };
  }

  const value = row.compliant.toLowerCase();

  const found = complianceMap.find((item) => value.includes(item.match));

  if (!found) {
    // fallback if no rule matched

    console.error("[COMPLIANCE] No matching rule found:", row.compliant);
    return {
      complianceStatusId: 6,
      complianceCategoryId: 0,
      complianceTypeId: 0,
    };
  }

  return {
    complianceStatusId: found.statusId,
    complianceCategoryId: found.categoryId ?? 0,
    complianceTypeId: 0,
  };
}

function resolveCoopType(row, coopName) {
  const coopTypeMap = [
    {
      id: "1a869d61-bc9e-4f84-b96f-1dd71103e66c",
      name: "Advocacy",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "e8e1a2a3-5d32-45b3-bd5f-280b3025f2ce",
      name: "Agrarian Reform",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "c6f3c80e-0a38-4054-a90d-e140eaeff7ee",
      name: "Agriculture",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "81f77162-318e-4e0f-9c47-f5c4e6cbf6e6",
      name: "Consumers",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "6d4600f5-b816-4f85-b89c-ea1ec81c6d90",
      name: "Credit",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "be9c37d5-3e3e-498b-bf1b-1b8f5fd29435",
      name: "Dairy",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "eb3e11de-bbf2-44f5-bf57-e6d2266de48c",
      name: "Education",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "e61ad64a-1c22-4cd6-b994-ff68b47c07de",
      name: "Electric",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "c9ceea96-c0e7-435c-89c0-c55d8f49a314",
      name: "Financial Service",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "f536c132-45a6-4bfb-9d82-1b54a40f24c5",
      name: "Fishermen",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "678891de-d783-4d00-b2e6-26d882aa340b",
      name: "Health Service",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "3e826b2c-b1db-4d51-810e-fb8b66efbfeb",
      name: "Housing",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "57b19c89-c004-42e5-87a7-8b2b2f8bcad1",
      name: "Labor Service",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "f2e7a8c3-9b4d-4e2a-8c1a-7e3b2d4f5a6b",
      name: "Logistics Service",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "d307e98b-08f5-4518-bd2c-e2bfb24d2335",
      name: "Marketing",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "5a1f4c7e-83b3-4e73-8b6b-2c8e4d0bb08c",
      name: "Multipurpose",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "acc2055e-1b01-4e3c-a2b1-b14646aa8224",
      name: "Producers",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "9b9c66ef-0f58-498b-9384-6c826961d75f",
      name: "Professionals",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "d38d7c63-086d-47a4-871e-7c9e4e6b3bd4",
      name: "Small Scale Mining",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "2e7cb8a9-4b13-47c7-843f-d01a88969e63",
      name: "Service",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "ccf7fce3-bf80-4bc7-8a48-94ea03faef7e",
      name: "Transport",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "f6fae7b4-8b37-4f8b-810e-32ac5104cf47",
      name: "Technology Service",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "f74db779-b4ee-4295-8d1b-4c2b715e63f3",
      name: "Water Service",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "ef8eb865-cb11-421b-921b-e2f46b31b0a0",
      name: "Workers",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "c464a3d0-5ff1-4dbb-a77f-dcdfd1c25c1a",
      name: "Cooperative Bank",
      category: ["secondary", "tertiary"],
      isActive: true,
    },
    {
      id: "6d4c0a7f-5f18-4e1d-a456-2a7f3f7c6d98",
      name: "Insurance",
      category: ["special"],
      isActive: false,
    },
    {
      id: "b1e7c2d4-3a5f-4e2b-9c8a-7f6e5d4c3b2a",
      name: "Memorial Service",
      category: ["secondary", "tertiary"],
      isActive: false,
    },
    {
      id: "b2e1f7c3-6a4d-4e2b-9c1a-8f7e5d4c3b2a",
      name: "Federation",
      category: ["secondary", "tertiary"],
      isActive: true,
    },
    {
      id: "c3d2e1f7-5a6b-4c2d-8e1a-7f6e5d4c3b2a",
      name: "Union",
      category: ["secondary", "tertiary"],
      isActive: true,
    },
    {
      id: "d4c3b2a1-7e6f-4d2c-9b1a-6e5d4c3b2a1f",
      name: "Credit Surety Fund",
      category: ["special"],
      isActive: true,
    },
  ];

  const multipurposeType = coopTypeMap.find(
    (t) => t.name.toLowerCase() === "multipurpose",
  );

  const federationType = coopTypeMap.find(
    (t) => t.name.toLowerCase() === "federation",
  );

  const cooperativeBankType = coopTypeMap.find(
    (t) => t.name.toLowerCase() === "cooperative bank",
  );

  const nameLower = coopName?.toLowerCase() || "";

  // Set type immediately as Cooperative Bank before it reaches Federation
  if (row.type?.toLowerCase().includes("cooperative bank")) {
    return {
      id: cooperativeBankType.id,
      coopTypeList: [],
    };
  }

  // ✅ Detect "federation" in coop name first
  if (nameLower.includes("federation")) {
    return {
      id: federationType.id,
      coopTypeList: [],
    };
  }

  // Handle empty or null type
  if (!row?.type || !row.type.trim()) {
    return {
      id: null,
      coopTypeList: [],
      type: "unknown",
    };
  }

  // Normalize raw types
  const rawTypes = row?.type
    ? row.type
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  // Detect explicit multipurpose in rawTypes
  const hasMultipurposeRawType = rawTypes.some((t) =>
    /multi[\s-]?purpose/i.test(t),
  );

  const matchedTypes = rawTypes
    .map((raw) =>
      coopTypeMap.find((t) => t.name.toLowerCase() === raw.toLowerCase()),
    )
    .filter(Boolean);

  const isMultipurpose =
    hasMultipurposeRawType ||
    /multi[\s-]?purpose/i.test(coopName) ||
    matchedTypes.length > 1;

  // ✅ Multipurpose
  if (isMultipurpose) {
    return {
      id: multipurposeType.id,
      coopTypeList: hasMultipurposeRawType
        ? []
        : matchedTypes.map((t) => ({
            id: t.id,
            type: t.name,
          })),
    };
  }

  // ✅ Single type
  return {
    id: matchedTypes[0]?.id || multipurposeType.id,
    coopTypeList: [],
  };
}

function normalizeDate(dateStr) {
  if (!dateStr) return null;

  const value = dateStr.trim();

  // empty / whitespace
  if (!value) return null;

  // all-zero or invalid placeholders
  if (/^(0+[-/]?){2,3}0+$/.test(value)) return null;

  let day, month, year;

  // YYYY-MM-DD or YYYY/MM/DD
  if (/^\d{4}[-/]\d{2}[-/]\d{2}$/.test(value)) {
    [year, month, day] = value.split(/[-/]/);
  }

  // M/D/YYYY or MM-DD-YYYY
  else if (/^\d{1,2}[-/]\d{1,2}[-/]\d{4}$/.test(value)) {
    [month, day, year] = value.split(/[-/]/);
  }

  // DD-MM-YY
  else if (/^\d{2}-\d{2}-\d{2}$/.test(value)) {
    [day, month, year] = value.split("-");
    year = Number(year) < 50 ? `20${year}` : `19${year}`;
  }

  // unsupported format
  else {
    return null;
  }

  const isoDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

  const date = new Date(isoDate);

  // final guard (invalid calendar dates)
  if (isNaN(date.getTime())) return null;

  return date;
}
