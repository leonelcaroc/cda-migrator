import connection from "./utils/connectToMySqlDb.js";
import { prismaAuth } from "./utils/prismaAuth.js";
import { prismaCoop } from "./utils/prismaCoop.js";
import fs from "fs";
import path from "path";
import hashPasswordUtil from "./utils/hashPasswordUtil.js";
import randomPassword from "./utils/randomPassword.js";
import randomString from "./utils/randomString.js";
import { generateReferenceId } from "./utils/generateReferenceId.js";

const LIMIT = 5000;
const OFFSET = 0;

// NO Amendments Yet
// const getAllCoops = `SELECT
//   rc.*,

//   c.id                    AS mysql_coop_id,
//   c.users_id              AS mysql_users_id,
//   c.type_of_cooperative   AS c_coop_type,

//   u.id                  AS user_id,
//   u.email               AS user_email,
//   u.first_name           AS user_first_name,
//   u.last_name            AS user_last_name,
//   u.middle_name          AS user_middle_name,
//   u.birthdate            AS user_birthdate,
//   u.contact_number       AS user_contact_number,
//   u.address              AS user_address,

//   cap.id                 AS capitalization_id,
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
//   cap.amount_of_preferred_share_paidup_pervalue,

//   d.cooperators                       AS cooperators,

//   e.branches                          AS branches,

//   aoc.id                              AS aoc_yearsOfExistence,
//   aoc.directors_turnover_days        AS aoc_directorsTurnoverDays,
//   aoc.directors_turnover_days        AS aoc_directorsTurnoverDays

// FROM registeredcoop rc

// LEFT JOIN cooperatives c
//   ON rc.application_id = c.id
// LEFT JOIN users u
//   ON c.users_id = u.id
// LEFT JOIN capitalization cap
//   ON rc.application_id = cap.cooperatives_id
// LEFT JOIN (
//   SELECT
//     cooperatives_id,
//     JSON_ARRAYAGG(
//       JSON_OBJECT(
//         'id', id,
//         'full_name', full_name,
//         'gender', gender,
//         'birth_date', birth_date,
//         'house_blk_no', house_blk_no,
//         'streetName', streetName,
//         'addrCode', addrCode,
//         'position', position,
//         'type_of_member', type_of_member,
//         'number_of_subscribed_shares', number_of_subscribed_shares,
//         'number_of_paid_up_shares', number_of_paid_up_shares,
//         'proof_of_identity', proof_of_identity,
//         'proof_date_issued', proof_date_issued,
//         'place_of_issuance', place_of_issuance
//       )
//     ) AS cooperators
//   FROM cooperators
//   GROUP BY cooperatives_id
// ) d ON rc.application_id = d.cooperatives_id
// LEFT JOIN (
//   SELECT
//     regNo,
//     COALESCE(
//       JSON_ARRAYAGG(
//         JSON_OBJECT(
//         'id', id,
//         'branchName', branchName)
//       ),
//       JSON_ARRAY()
//     ) AS branches
//   FROM branches
//   GROUP BY regNo
// ) e ON rc.regNo = e.regNo
// LEFT JOIN articles_of_cooperation aoc
//   ON rc.application_id = aoc.cooperatives_id
// LEFT JOIN bylaws bl
//   ON rc.application_id = bl.cooperatives_id

// `;

// LEFT JOIN (
//   SELECT *
//   FROM (
//     SELECT *,
//            ROW_NUMBER() OVER (PARTITION BY cooperative_id ORDER BY id ASC) AS rn
//     FROM amend_coop
//   ) t
//   WHERE rn = 1
// ) ac
// ON rc.regNo = ac.regNo

// -----------------

// d.id                                AS cooperator_id,
// d.full_name                         AS cooperator_fullname,
// d.gender                            AS cooperator_gender,
// d.birth_date                        AS cooperator_birthdate,
// d.house_blk_no                      AS cooperator_house_blk_no,
// d.streetName                        AS cooperator_streetName,
// d.addrCode                          AS cooperator_addrCode,
// d.position                          AS cooperator_position,
// d.type_of_member                    AS cooperator_type_of_member,
// d.number_of_subscribed_shares       AS cooperator_noOfSubscribedShares,
// d.number_of_paid_up_shares          AS cooperator_noOfPaidUpShares,
// d.proof_of_identity                 AS cooperator_proof_of_identity_number,
// d.proof_date_issued                 AS cooperator_proof_date_issued,
// d.place_of_issuance                 AS cooperator_place_of_issuance,

// ---------------------------
// Tables 'staff', 'business_activities_cooperative' and 'purposes' not yet included

// LIMIT 5000

// LIMIT ${LIMIT} OFFSET ${OFFSET};

const getAllCoops = `SELECT
  rc.*,

  c.id                    AS mysql_coop_id,
  c.users_id              AS mysql_users_id,
  c.type_of_cooperative   AS c_coop_type,

  u.id                   AS user_id,
  u.email                AS user_email,
  u.first_name           AS user_first_name,
  u.last_name            AS user_last_name,
  u.middle_name          AS user_middle_name,
  u.birthdate            AS user_birthdate,
  u.contact_number       AS user_contact_number,
  u.address              AS user_address,

  cap.id                 AS capitalization_id,
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
  cap.amount_of_preferred_share_paidup_pervalue,

  d.cooperators                       AS cooperators,

  e.branches                          AS branches,

  aoc.id                              AS aoc_yearsOfExistence,
  aoc.directors_turnover_days        AS aoc_directorsTurnoverDays,
  aoc.directors_turnover_days        AS aoc_directorsTurnoverDays,

  ra.id                    AS ra_id,
  ra.cooperative_id        AS ra_cooperative_id,
  ra.amendment_no          AS ra_amendment_no,
  ra.coopName              AS ra_coopName,
  ra.acronym               AS ra_acronym,
  ra.regNo                 AS ra_regNo,
  ra.type                  AS ra_type,
  ra.category              AS ra_category,
  ra.dateRegistered        AS ra_dateRegistered,
  ra.commonBond            AS ra_commonBond,
  ra.areaOfOperation       AS ra_areaOfOperation,
  ra.noStreet              AS ra_noStreet,
  ra.Street                AS ra_Street,
  ra.addrCode              AS ra_addrCode,
  ra.interregional         AS ra_interregional,
  ra.compliant             AS ra_compliant,

  ra.amendment_count       AS ra_total_amendments,

  am.id                                         AS am_id,
  am.category_of_cooperative                    AS am_category,
  am.type_of_cooperative                        AS am_type,
  am.grouping                                   AS am_grouping,
  am.proposed_name                              AS am_proposedName,
  am.acronym_name                               AS am_acronymName,
  am.common_bond_of_membership                  AS am_commonBond,
  am.field_of_membership                        AS am_fieldPfMembership,
  am.name_of_ins_assoc                          AS am_nameOfInsAssoc,
  am.area_of_operation                          AS am_areaOfOperation,
  am.refbrgy_brgyCode                           AS am_refBrgyCode,
  am.interregional                              AS am_interregional,
  am.regions                                    AS am_regions,
  am.street                                     AS am_areaOfOperation

FROM (
    SELECT rc.*
    FROM registeredcoop rc
    INNER JOIN (
        SELECT regNo, MIN(id) AS min_id
        FROM registeredcoop
        GROUP BY regNo
    ) t ON rc.regNo = t.regNo AND rc.id = t.min_id
) rc



LEFT JOIN cooperatives c
  ON rc.application_id = c.id
LEFT JOIN users u
  ON c.users_id = u.id
LEFT JOIN capitalization cap
  ON rc.application_id = cap.cooperatives_id
LEFT JOIN (
  SELECT
    cooperatives_id,
    JSON_ARRAYAGG(
      JSON_OBJECT(
        'id', id,
        'full_name', full_name,
        'gender', gender,
        'birth_date', birth_date,
        'house_blk_no', house_blk_no,
        'streetName', streetName,
        'addrCode', addrCode,
        'position', position,
        'type_of_member', type_of_member,
        'number_of_subscribed_shares', number_of_subscribed_shares,
        'number_of_paid_up_shares', number_of_paid_up_shares,
        'proof_of_identity', proof_of_identity,
        'proof_date_issued', proof_date_issued,
        'place_of_issuance', place_of_issuance
      )
    ) AS cooperators
  FROM cooperators
  GROUP BY cooperatives_id
) d ON rc.application_id = d.cooperatives_id
LEFT JOIN (
  SELECT
    regNo,
    COALESCE(
      JSON_ARRAYAGG(
        JSON_OBJECT(
        'id', id,
        'branchName', branchName)
      ),
      JSON_ARRAY()
    ) AS branches
  FROM branches
  GROUP BY regNo
) e ON rc.regNo = e.regNo
LEFT JOIN articles_of_cooperation aoc
  ON rc.application_id = aoc.cooperatives_id
LEFT JOIN bylaws bl
  ON rc.application_id = bl.cooperatives_id
LEFT JOIN (
  SELECT 
    ra1.*,
    ra_max.amendment_count   
  FROM registeredamendment ra1
  INNER JOIN (
    SELECT regNo, MAX(id) AS max_id, COUNT(*) AS amendment_count
    FROM registeredamendment
    GROUP BY regNo
  ) ra_max
  ON ra1.regNo = ra_max.regNo
  AND ra1.id = ra_max.max_id
) ra
ON rc.regNo = ra.regNo

LEFT JOIN cooperatives am
  ON ra.cooperative_id = am.id



`;

// LIMIT 10

// Save this
// LEFT JOIN (
//   SELECT ra1.*
//   FROM registeredamendment ra1
//   INNER JOIN (
//     SELECT regNo, MAX(id) AS max_id, COUNT(*) AS amendment_count
//     FROM registeredamendment
//     GROUP BY regNo
//   ) ra_max
//   ON ra1.regNo = ra_max.regNo
//   AND ra1.id = ra_max.max_id
// ) ra
// ON rc.regNo = ra.regNo

// LIMIT 5

// FROM registeredcoop rc

// LEFT JOIN (
//   SELECT *
//   FROM registeredamendment ra1
//   WHERE ra1.id = (
//     SELECT MAX(ra2.id)
//     FROM registeredamendment ra2
//     WHERE ra2.regNo = ra1.regNo
//   )
// ) ra
// ON rc.regNo = ra.regNo

// LIMIT 1

// LEFT JOIN amend_coop ac
// ON rc.regNo = ac.regNo

let mockEmailCounter = 1000;

/**
 * Log file path
 */
const logFilePath = path.join(process.cwd(), "user_credentials_log.txt");

/**
 * Clear previous log
 */
fs.writeFileSync(logFilePath, "email,password\n");

export default function thirdTestMigration() {
  connection.query(getAllCoops, async (err, results) => {
    if (err) throw err;

    let successCount = 0;
    let skipCount = 0;
    let noRegNoCount = 0;
    let unknownTypeCount = 0;
    let duplicateCount = 0;
    let errorCount = 0;

    // console.log(`Starting migration of ${results.length} cooperatives...`);
    console.log(
      // `Starting migration of ${results.length} cooperatives from record ${OFFSET + 1}...`,
      `Starting migration of ${results.length} cooperatives...`,
    );

    for (const [index, row] of results.entries()) {
      // const recordNumber = OFFSET + index + 1;
      const recordNumber = index + 1;

      try {
        // if ((index + 1) % 100 === 0 || index === results.length - 1) {
        // console.log(
        //   `Processing record ${recordNumber} of ${OFFSET + results.length}...`,
        // );
        // }

        if (recordNumber % 100 === 0 || recordNumber === results.length) {
          console.log(
            `Processing record ${recordNumber} of ${results.length}...`,
          );
        }

        const registeredAmendment = {
          id: row.ra_id,
          regNo: row.ra_cooperative_id,
          amendmentNo: Number(row.ra_amendment_no || 0),
          coopName: row.ra_coopName?.trim(),
          acronym: row.ra_acronym?.trim(),
          regNo: row.ra_regNo?.trim(),
          category: row.ra_category,
          type: row.ra_type,
          dateRegistered: row.ra_dateRegistered,
          noStreet: row.ra_noStreet,
          street: row.ra_Street,
          addrCode: row.ra_addrCode,
          interregional: row.ra_interregional,
          regions: row.ra_regions,
          compliant: row.ra_compliant,
          totalAmendments: Number(row.ra_total_amendments) - 1, // Less 1, remove the initial registration
        };

        // console.log("latestAmendment: ", latestAmendment);
        // console.log("Cooperators: ", row.d);

        const regNo = row.regNo.trim();
        console.log(regNo);

        let coopName = row.coopName?.trim();
        console.log(coopName);

        const newReferenceId = generateReferenceId();

        const dateOfRegistration = normalizeDate(row.dateRegistered);
        const recentAmendmentDateRegistration = normalizeDate(
          registeredAmendment.dateRegistered,
        );

        if (!regNo) {
          skipCount++;
          noRegNoCount++;
          console.log("No Reg Number: ", coopName);
          continue;
        }

        if (row.content && row.content.trim() !== "") {
          console.log(`Coop Name: ${coopName} | RegNo: ${regNo}`);
        }

        // const coopCategory =
        //   row.category?.toLowerCase().trim() === "others"
        //     ? "secondary"
        //     : row.category?.toLowerCase().trim();
        const coopCategory = normalizeCategory(row.category);

        let acronym = row.acronym?.trim() || "";

        // const acronymRegex = /\(([^)]+)\)/;
        // const acronymMatch = coopName.match(acronymRegex);

        // if (acronymMatch) {
        //   if (!acronym) acronym = acronymMatch[1].trim();
        //   coopName = coopName.replace(acronymRegex, "").trim();
        //   coopName = coopName.replace(/\s+/g, " ").replace(/[,|-]\s*$/, "");
        // }

        const addressCodes = normalizeAddress(row.addr);
        const amendmentAddressCodes = normalizeAddress(
          registeredAmendment.addrCode,
        );

        // console.log("addressCodes: ", addressCodes);

        const coopCompliance = resolveCompliance(
          registeredAmendment.compliant || row.compliant,
        );

        // const coopType = resolveCoopType(row?.type, row.cooperativeName);
        // const application_coopType = resolveCoopType(
        //   row?.c_coop_type,
        //   row.cooperativeName,
        // );

        const typeOfCoop = row?.type || row?.c_coop_type;

        const finalCoopType = resolveCoopType(typeOfCoop, row.cooperativeName);
        const amendmentCoopType = resolveCoopType(
          registeredAmendment.type,
          registeredAmendment.coopName,
        );

        console.log("Category: ", coopCategory);
        console.log("Type: ", finalCoopType.type);
        // resolveCoopType(row?.c_coop_type, row.cooperativeName);

        if (!finalCoopType) {
          console.error(
            "Cannot resolve cooperative type for:",
            row.cooperativeName,
          );
          throw new Error(
            `Missing cooperative type for ${row.cooperativeName}`,
          );
        }

        // if (coopType.type === "unknown") {
        if (finalCoopType.type === "unknown") {
          // console.log("coopType: ", coopType.id);
          // console.log("application_coopType: ", application_coopType.id);
          console.log("finalCoopType.type: ", finalCoopType.type.id);

          skipCount++;
          console.log(coopName);
          console.warn(
            `[SKIP] Missing coop type | RegNo: ${regNo} | Name: ${coopName} | Raw type: ${row.type}`,
          );
          continue;
        }

        // const initialRegistration = {};

        const capitalization = {
          totalAuthorizedShareCapital:
            Number(row.authorized_share_capital) || 0,
          totalNoOfRegularMembers: Number.isFinite(Number(row.regular_members))
            ? Number(row.regular_members)
            : 0,
          totalNoOfAssociateMembers: Number.isFinite(
            Number(row.associate_members),
          )
            ? Number(row.associate_members)
            : 0,
          commonShareParValue: row.par_value,
          noOfCommonShare: row.common_share,
          noOfPreferredShare: row.preferred_share,
          totalAmountOfSubscribedCapital: Number(
            row.total_amount_of_subscribed_capital || 0,
          ),
          totalNoOfSubscribedCapital: row.total_no_of_subscribed_capital,
          totalAmountOfPaidUpCapital: Number(
            row.total_amount_of_paid_up_capital || 0,
          ),
          totalNoOfPaidUpCapital: row.total_no_of_paid_up_capital,
          minimumSubscribeRegular: row.minimum_subscribed_share_regular,
          minimumPaidUpRegular: row.minimum_paid_up_share_regular,
          minimumPaidUpAssociate: row.minimum_subscribed_share_associate,
          amountOfCommonShareSubscribed: row.amount_of_common_share_subscribed,
          amountOfPreferredShareSubscribed:
            row.amount_of_preferred_share_subscribed,
          amountOfCommonSharePaidUp: row.amount_of_common_share_paidup,
          amountOfPreferredSharePaidUp: row.amount_of_preferred_share_paidup,
        };

        const initialRegistrationApplication = {
          cooperativeName: coopName,
          cooperativeCategory: coopCategory,
          cooperativeType: {
            connect: { id: finalCoopType.id },
          },
          coopTypeList: finalCoopType.coopTypeList,
          registrationId: newReferenceId,
          isAmendment: false,
          formOfRegistration: "none",
          totalAuthorizedShareCapital:
            capitalization.totalAuthorizedShareCapital,
          totalNoOfRegularMembers: capitalization.totalNoOfRegularMembers,
          totalNoOfAssociateMembers: capitalization.totalNoOfAssociateMembers,
          isDraft: false,
          applicationStatus: "APPROVED",
          migrated: 1,
          ...(addressCodes.regCode && addressCodes.regCode.length === 2
            ? { region: { connect: { regCode: addressCodes.regCode } } }
            : {}),

          ...(addressCodes.provCode && addressCodes.provCode.length === 4
            ? {
                province: {
                  connect: { provCode: addressCodes.provCode },
                },
              }
            : {}),

          ...(addressCodes.citymunCode && addressCodes.citymunCode.length === 6
            ? {
                cityMunicipality: {
                  connect: { citymunCode: addressCodes.citymunCode },
                },
              }
            : {}),

          ...(addressCodes.brgyCode && addressCodes.brgyCode.length === 9
            ? {
                barangay: {
                  connect: { brgyCode: addressCodes.brgyCode },
                },
              }
            : {}),
        };

        const latestRegisteredAmendment = {
          registrationId: generateReferenceId(),

          cooperativeName: registeredAmendment.coopName,
          cooperativeCategory: normalizeCategory(registeredAmendment.category),
          cooperativeType: {
            connect: { id: amendmentCoopType.id },
          },
          coopTypeList: amendmentCoopType.coopTypeList,
          isAmendment: true,
          amendmentNo: Number(registeredAmendment.amendmentNo) || null,
          formOfRegistration: "none",
          isDraft: false,
          applicationStatus: "APPROVED",
          migrated: 1,
          ...(amendmentAddressCodes.regCode &&
          amendmentAddressCodes.regCode.length === 2
            ? {
                region: {
                  connect: { regCode: amendmentAddressCodes.regCode },
                },
              }
            : {}),

          ...(amendmentAddressCodes.provCode &&
          amendmentAddressCodes.provCode.length === 4
            ? {
                province: {
                  connect: { provCode: amendmentAddressCodes.provCode },
                },
              }
            : {}),

          ...(amendmentAddressCodes.citymunCode &&
          amendmentAddressCodes.citymunCode.length === 6
            ? {
                cityMunicipality: {
                  connect: {
                    citymunCode: amendmentAddressCodes.citymunCode,
                  },
                },
              }
            : {}),

          ...(amendmentAddressCodes.brgyCode &&
          amendmentAddressCodes.brgyCode.length === 9
            ? {
                barangay: {
                  connect: { brgyCode: amendmentAddressCodes.brgyCode },
                },
              }
            : {}),
        };

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
          // console.log("Existing ORG: ", coopName);
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

        // try {
        //   const initial = await prismaCoop.cooperatives.create({
        //     data: initialRegistrationApplication,
        //   });

        //   const amendment = await prismaCoop.cooperatives.create({
        //     data: initialRegistrationApplication,
        //   });

        //   // Create the latest amendment
        //   // Run only if total amendments is more than
        //   if (registeredAmendment.totalAmendments > 0) {
        //     await prismaCoop.cooperativeOrg.update({
        //       where: { id: coopOrg.id },
        //       data: {
        //         // recentAmendmentDate: ,
        //         amendmentCount: registeredAmendment.amendmentNo,
        //         approvedCooperative: {
        //           create: {
        //             ...latestRegisteredAmendment,
        //           },
        //         },
        //       },
        //     });
        //   }

        //   // Create Coop Org and Initial Registration
        //   const coopOrg = await prismaCoop.cooperativeOrg.create({
        //     data: {
        //       cooperativeName: coopName,
        //       acronym,
        //       regNo,
        //       dateOfRegistration: dateOfRegistration,
        //       prevComplianceRemarks: row.compliant,
        //       migrated: 1,
        //       ownedBy: existingUser.id,

        //       ...(coopCompliance.complianceStatusId &&
        //       coopCompliance.complianceStatusId > 0
        //         ? {
        //             complianceStatus: {
        //               connect: { id: coopCompliance.complianceStatusId },
        //             },
        //           }
        //         : {}),

        //       ...(coopCompliance.complianceCategoryId &&
        //       coopCompliance.complianceCategoryId > 0
        //         ? {
        //             complianceCategory: {
        //               connect: { id: coopCompliance.complianceCategoryId },
        //             },
        //           }
        //         : {}),

        //       ...(coopCompliance.complianceTypeId &&
        //       coopCompliance.complianceTypeId > 0
        //         ? {
        //             complianceType: {
        //               connect: { id: coopCompliance.complianceTypeId },
        //             },
        //           }
        //         : {}),
        //       cooperatives: ,
        //       approvedCooperative: ,
        //     },
        //   });
        // }

        try {
          // 1. Create the initial registration
          const initial = await prismaCoop.cooperatives.create({
            data: initialRegistrationApplication,
          });

          let approvedCoopData = initial; // By default, initial is approved if no amendments

          // 2. If there is an amendment, create it
          let amendment;
          if (registeredAmendment.totalAmendments > 0) {
            amendment = await prismaCoop.cooperatives.create({
              data: latestRegisteredAmendment,
            });
            approvedCoopData = amendment; // Latest amendment becomes approved
          }

          // 3. Create Coop Org and link cooperatives and approvedCooperative
          await prismaCoop.cooperativeOrg.create({
            data: {
              cooperativeName: registeredAmendment.coopName || coopName,
              acronym: registeredAmendment.acronym || acronym,
              regNo,
              dateOfRegistration: dateOfRegistration,
              // prevComplianceRemarks: row.compliant,
              recentAmendmentDate: recentAmendmentDateRegistration || null,
              amendmentCount: registeredAmendment.amendmentNo || null,
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

              // 4. Link initial registration and amendment (if any) to cooperatives
              cooperatives: {
                connect: [
                  { id: initial.id },
                  ...(amendment ? [{ id: amendment.id }] : []),
                ],
              },

              // 5. Set approvedCooperative
              approvedCooperative: {
                connect: { id: approvedCoopData.id },
              },

              // 6. Update amendment info if there was an amendment
              ...(registeredAmendment.totalAmendments > 0
                ? {
                    amendmentCount: registeredAmendment.amendmentNo,
                    recentAmendmentDate: amendment?.dateOfRegistration || null,
                  }
                : {}),
            },
          });
        } catch (error) {
          errorCount++;

          if (error.code === "P2025" && error.meta?.cause) {
            const cause = error.meta.cause;

            if (cause.includes("Regions")) {
              console.warn(
                `[REGION ERROR]`,
                addressCodes.regCode,
                coopName,
                regNo,
              );
            } else if (cause.includes("Provinces")) {
              console.warn(
                `[PROVINCE ERROR]`,
                addressCodes.provCode,
                coopName,
                regNo,
              );
            } else if (cause.includes("CityMunicipalities")) {
              console.warn(
                `[CITYMUN ERROR]`,
                addressCodes.citymunCode,
                coopName,
                regNo,
              );
            } else if (cause.includes("Barangays")) {
              console.warn(
                `[BARANGAY ERROR]`,
                addressCodes.brgyCode,
                coopName,
                regNo,
              );
            } else {
              console.error(
                `[${index + 1}] ❌ Unknown P2025 Error: ${coopName}, ${regNo}`,
                error,
              );
            }
          } else {
            console.error(`[${index + 1}] ❌ Error`, coopName, regNo, error);
          }

          continue;
        }

        successCount++;
      } catch (error) {
        errorCount++;
        // console.log("Error: ", coopName, regNo);
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

function resolveCompliance(compliant) {
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

  if (!compliant || !compliant.trim()) {
    return {
      complianceStatusId: 6, // Unclassified
      complianceCategoryId: 0,
      complianceTypeId: 0,
    };
  }

  const value = compliant.toLowerCase();

  const found = complianceMap.find((item) => value.includes(item.match));

  if (!found) {
    // fallback if no rule matched

    console.error("[COMPLIANCE] No matching rule found:", compliant);
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

// function resolveCoopType(type, coopName) {
//   const coopTypeMap = [
//     {
//       id: "1a869d61-bc9e-4f84-b96f-1dd71103e66c",
//       name: "Advocacy",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "e8e1a2a3-5d32-45b3-bd5f-280b3025f2ce",
//       name: "Agrarian Reform",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "c6f3c80e-0a38-4054-a90d-e140eaeff7ee",
//       name: "Agriculture",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "81f77162-318e-4e0f-9c47-f5c4e6cbf6e6",
//       name: "Consumers",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "6d4600f5-b816-4f85-b89c-ea1ec81c6d90",
//       name: "Credit",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "be9c37d5-3e3e-498b-bf1b-1b8f5fd29435",
//       name: "Dairy",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "eb3e11de-bbf2-44f5-bf57-e6d2266de48c",
//       name: "Education",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "e61ad64a-1c22-4cd6-b994-ff68b47c07de",
//       name: "Electric",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "c9ceea96-c0e7-435c-89c0-c55d8f49a314",
//       name: "Financial Service",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "f536c132-45a6-4bfb-9d82-1b54a40f24c5",
//       name: "Fishermen",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "678891de-d783-4d00-b2e6-26d882aa340b",
//       name: "Health Service",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "3e826b2c-b1db-4d51-810e-fb8b66efbfeb",
//       name: "Housing",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "57b19c89-c004-42e5-87a7-8b2b2f8bcad1",
//       name: "Labor Service",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "f2e7a8c3-9b4d-4e2a-8c1a-7e3b2d4f5a6b",
//       name: "Logistics Service",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "d307e98b-08f5-4518-bd2c-e2bfb24d2335",
//       name: "Marketing",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "5a1f4c7e-83b3-4e73-8b6b-2c8e4d0bb08c",
//       name: "Multipurpose",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "acc2055e-1b01-4e3c-a2b1-b14646aa8224",
//       name: "Producers",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "9b9c66ef-0f58-498b-9384-6c826961d75f",
//       name: "Professionals",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "d38d7c63-086d-47a4-871e-7c9e4e6b3bd4",
//       name: "Small Scale Mining",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "2e7cb8a9-4b13-47c7-843f-d01a88969e63",
//       name: "Service",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "ccf7fce3-bf80-4bc7-8a48-94ea03faef7e",
//       name: "Transport",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "f6fae7b4-8b37-4f8b-810e-32ac5104cf47",
//       name: "Technology Service",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "f74db779-b4ee-4295-8d1b-4c2b715e63f3",
//       name: "Water Service",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "ef8eb865-cb11-421b-921b-e2f46b31b0a0",
//       name: "Workers",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "c464a3d0-5ff1-4dbb-a77f-dcdfd1c25c1a",
//       name: "Cooperative Bank",
//       category: ["secondary", "tertiary"],
//       isActive: true,
//     },
//     {
//       id: "6d4c0a7f-5f18-4e1d-a456-2a7f3f7c6d98",
//       name: "Insurance",
//       category: ["special"],
//       isActive: false,
//     },
//     {
//       id: "b1e7c2d4-3a5f-4e2b-9c8a-7f6e5d4c3b2a",
//       name: "Memorial Service",
//       category: ["secondary", "tertiary"],
//       isActive: false,
//     },
//     {
//       id: "b2e1f7c3-6a4d-4e2b-9c1a-8f7e5d4c3b2a",
//       name: "Federation",
//       category: ["secondary", "tertiary"],
//       isActive: true,
//     },
//     {
//       id: "c3d2e1f7-5a6b-4c2d-8e1a-7f6e5d4c3b2a",
//       name: "Union",
//       category: ["secondary", "tertiary"],
//       isActive: true,
//     },
//     {
//       id: "d4c3b2a1-7e6f-4d2c-9b1a-6e5d4c3b2a1f",
//       name: "Credit Surety Fund",
//       category: ["special"],
//       isActive: true,
//     },
//   ];

//   const multipurposeType = coopTypeMap.find(
//     (t) => t.name.toLowerCase() === "multipurpose",
//   );

//   const federationType = coopTypeMap.find(
//     (t) => t.name.toLowerCase() === "federation",
//   );

//   const cooperativeBankType = coopTypeMap.find(
//     (t) => t.name.toLowerCase() === "cooperative bank",
//   );

//   const nameLower = coopName?.toLowerCase() || "";

//   // Set type immediately as Cooperative Bank before it reaches Federation
//   if (type?.toLowerCase().includes("cooperative bank")) {
//     return {
//       id: cooperativeBankType.id,
//       coopTypeList: [],
//     };
//   }

//   // ✅ Detect "federation" in coop name first
//   if (nameLower.includes("federation")) {
//     return {
//       id: federationType.id,
//       coopTypeList: [],
//     };
//   }

//   // Handle empty or null type
//   // if (!type || !type?.trim()) {
//   if (!type?.trim()) {
//     return {
//       id: null,
//       coopTypeList: [],
//       type: "unknown",
//     };
//   }

//   // Normalize raw types
//   const rawTypes = type
//     ? type
//         .split(",")
//         .map((t) => t.trim())
//         .filter(Boolean)
//     : [];

//   // Detect explicit multipurpose in rawTypes
//   const hasMultipurposeRawType = rawTypes.some((t) =>
//     /multi[\s-]?purpose/i.test(t),
//   );

//   const matchedTypes = rawTypes
//     .map((raw) =>
//       coopTypeMap.find((t) => t.name.toLowerCase() === raw.toLowerCase()),
//     )
//     .filter(Boolean);

//   const isMultipurpose =
//     hasMultipurposeRawType ||
//     /multi[\s-]?purpose/i.test(coopName) ||
//     matchedTypes.length > 1;

//   // ✅ Multipurpose
//   if (isMultipurpose) {
//     return {
//       id: multipurposeType.id,
//       coopTypeList: hasMultipurposeRawType
//         ? []
//         : matchedTypes.map((t) => ({
//             id: t.id,
//             type: t.name,
//           })),
//     };
//   }

//   // ✅ Single type
//   return {
//     id: matchedTypes[0]?.id || multipurposeType.id,
//     coopTypeList: [],
//   };
// }

function resolveCoopType(type, coopName) {
  type = (type || "").trim();

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

  const nameLower = (coopName || "").toLowerCase();

  // Cooperative Bank
  if (type.toLowerCase().includes("cooperative bank")) {
    return {
      id: cooperativeBankType.id,
      type: "Cooperative Bank",
      coopTypeList: [],
    };
  }

  // Federation in name
  if (nameLower.includes("federation")) {
    return { id: federationType.id, type: "Federation", coopTypeList: [] };
  }

  // Empty type
  if (!type) {
    return { id: null, type: "Unknown", coopTypeList: [] };
  }

  // Normalize raw types
  const rawTypes = type
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

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
    /multi[\s-]?purpose/i.test(coopName || "") ||
    matchedTypes.length > 1;

  if (isMultipurpose) {
    return {
      id: multipurposeType.id,
      type: "Multipurpose",
      coopTypeList: hasMultipurposeRawType
        ? []
        : matchedTypes.map((t) => ({ id: t.id, type: t.name })),
    };
  }

  // Single type fallback
  return {
    id: matchedTypes[0]?.id || multipurposeType.id,
    type: matchedTypes[0]?.name || "Multipurpose",
    coopTypeList: [],
  };
}

// function normalizeDate(dateStr) {
//   if (!dateStr) return null;

//   const value = String(dateStr?.trim());

//   // empty / whitespace
//   if (!value) return null;

//   // all-zero or invalid placeholders
//   if (/^(0+[-/]?){2,3}0+$/.test(value)) return null;

//   let day, month, year;

//   // YYYY-MM-DD or YYYY/MM/DD
//   if (/^\d{4}[-/]\d{2}[-/]\d{2}$/.test(value)) {
//     [year, month, day] = value.split(/[-/]/);
//   }

//   // M/D/YYYY or MM-DD-YYYY
//   else if (/^\d{1,2}[-/]\d{1,2}[-/]\d{4}$/.test(value)) {
//     [month, day, year] = value.split(/[-/]/);
//   }

//   // DD-MM-YY
//   else if (/^\d{2}-\d{2}-\d{2}$/.test(value)) {
//     [day, month, year] = value.split("-");
//     year = Number(year) < 50 ? `20${year}` : `19${year}`;
//   }

//   // unsupported format
//   else {
//     return null;
//   }

//   const isoDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

//   const date = new Date(isoDate);

//   // final guard (invalid calendar dates)
//   if (isNaN(date.getTime())) return null;

//   return date;
// }

function normalizeDate(dateStr) {
  if (dateStr == null) return null; // covers null and undefined

  const value = String(dateStr).trim(); // <-- convert first, then trim

  if (!value) return null; // empty string

  if (/^(0+[-/]?){2,3}0+$/.test(value)) return null; // all-zero placeholders

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
  } else {
    return null; // unsupported format
  }

  const isoDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  const date = new Date(isoDate);

  if (isNaN(date.getTime())) return null;

  return date;
}

function normalizeAddress(addrCode) {
  addrCode = addrCode?.toString().trim() || "";

  // Remove non-digits (/n, /r, hidden chars, etc.)
  addrCode = addrCode.replace(/\D+/g, "");

  if (addrCode.startsWith("00")) {
    addrCode = addrCode.slice(1);
  }

  if (addrCode.length === 10) {
    addrCode = addrCode.slice(1);
  }

  if (addrCode.length === 3 && addrCode.startsWith("0")) {
    addrCode = addrCode.slice(1, -1);
  }

  // pad if needed
  if (addrCode.length === 1 || addrCode.length === 3) {
    addrCode = "0" + addrCode;
  }

  if (addrCode.length === 2 && addrCode === "18") {
    addrCode = "17";
  }

  const regCode = addrCode.slice(0, 2);
  const provCode = addrCode.slice(0, 4);
  const citymunCode = addrCode.slice(0, 6);
  const brgyCode = addrCode.slice(0, 9);

  return {
    regCode,
    provCode,
    citymunCode,
    brgyCode,
  };
}

function normalizeCategory(category) {
  return category?.toLowerCase().trim() === "others"
    ? "secondary"
    : category?.toLowerCase().trim();
}
