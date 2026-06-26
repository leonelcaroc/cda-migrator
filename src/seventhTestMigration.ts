import fs from "fs";
import path from "path";
import connection from "./utils/connectToMySqlDb.js";
import { prismaAuth } from "./utils/prismaAuth.js";
import { prismaCoop } from "./utils/prismaCoop.js";

import hashPasswordUtil from "./utils/hashPasswordUtil.js";
import randomPassword from "./utils/randomPassword.js";
import randomString from "./utils/randomString.js";
import { generateReferenceId } from "./utils/generateReferenceId.js";

import { resolveCompliance } from "./utils/resolveData.js";
import { resolveCoopType } from "./utils/resolveData.js";
import { normalizeDate } from "./utils/resolveData.js";
import { normalizeAddress } from "./utils/resolveData.js";
import { normalizeCategory } from "./utils/resolveData.js";
import { normalizeAreaOfOperation } from "./utils/resolveData.js";
import { RowDataPacket } from "mysql2";
import { ApplicationStatus } from "@prisma/client/coop/index.js";
import { generateUuid } from "./utils/generateUuid.js";
import ref_regions from "./data/refregion.json" with { type: "json" };
import { logMigrationError } from "./logMigrationError.js";

import {
  TCoopCategory,
  TCooperativeApplication,
} from "./utils/createCooperativeApplication.js";
import { UserStatus } from "@prisma/client/auth/index.js";
import getLogFilePath from "./utils/getLogFilePath.js";

const logFilePath = getLogFilePath();

// Query to get a single cooperative by ID (auto-increment)
const getCoopByIdQuery = `
SELECT
  rc.*,

  c.id                    AS mysql_coop_id,
  c.users_id              AS mysql_users_id,
  c.type_of_cooperative   AS c_coop_type,
  c.field_of_membership   AS c_field_of_membership,

  u.id                   AS user_id,
  u.email                AS user_email,
  u.first_name           AS user_first_name,
  u.last_name            AS user_last_name,
  u.middle_name          AS user_middle_name,
  u.birthdate            AS user_birthdate,
  u.contact_number       AS user_contact_number,
  u.address              AS user_address,

  ca.id                  AS ca_user_id,
  ca.fullname            AS ca_user_fullname,
  ca.position            AS ca_user_position,
  ca.idType              AS ca_user_idType,
  ca.idNo                AS ca_user_idNo,
  ca.email               AS ca_user_email,
  ca.mobileNo            AS ca_user_mobileNo,

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

  aoc.id                            AS aoc_yearsOfExistence,
  aoc.directors_turnover_days       AS aoc_directorsTurnoverDays,
  aoc.directors_turnover_days       AS aoc_directorsTurnoverDays,

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
  am.field_of_membership                        AS am_fieldOfMembership,
  am.name_of_ins_assoc                          AS am_nameOfInsAssoc,
  am.area_of_operation                          AS am_areaOfOperation,
  am.refbrgy_brgyCode                           AS am_refBrgyCode,
  am.interregional                              AS am_interregional,
  am.regions                                    AS am_regions,
  am.street                                     AS am_street,

  am_cap.authorized_share_capital                     AS amcap_authorizedShareCapital,
  am_cap.total_amount_of_subscribed_capital           AS amcap_totalAmountOfSubscribedCapital,
  am_cap.total_amount_of_paid_up_capital              AS amcap_totalAmountOfPaidUpCapital

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

LEFT JOIN (
    SELECT ca1.*
    FROM ca_user ca1
    INNER JOIN (
        SELECT regNo, MAX(dateCreated) AS latestDate
        FROM ca_user
        WHERE is_verified = '1'
        GROUP BY regNo
    ) ca_max
    ON ca1.regNo = ca_max.regNo
    AND ca1.dateCreated = ca_max.latestDate
    WHERE ca1.is_verified = '1' 
     AND ca1.status <> 'Denied'
) ca
ON rc.regNo = ca.regNo
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
LEFT JOIN capitalization am_cap
  ON ra.cooperative_id = am_cap.cooperatives_id
WHERE rc.id = ?
`;

// Query to get the total count of records
const getTotalCountQuery = `
SELECT COUNT(*) as total
FROM (
    SELECT rc.*
    FROM registeredcoop rc
    INNER JOIN (
        SELECT regNo, MIN(id) AS min_id
        FROM registeredcoop
        GROUP BY regNo
    ) t ON rc.regNo = t.regNo AND rc.id = t.min_id
) rc
`;

// Query to get a specific ID by registration number (for lookup)
const getIdByRegNoQuery = `
SELECT id
FROM registeredcoop
WHERE regNo = ?
LIMIT 1
`;

let mockEmailCounter = 1000;

/**
 * Clear previous log
 */
fs.writeFileSync(logFilePath, "Cooperatives Credentials\n");

/**
 * Get total number of records
 */
export function getTotalRecords(): Promise<number> {
  return new Promise((resolve, reject) => {
    connection.query<RowDataPacket[]>(getTotalCountQuery, (err, results) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(results[0].total);
    });
  });
}

/**
 * Get ID by registration number
 */
export function getIdByRegNo(regNo: string): Promise<number | null> {
  return new Promise((resolve, reject) => {
    connection.query<RowDataPacket[]>(
      getIdByRegNoQuery,
      [regNo],
      (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results.length > 0 ? results[0].id : null);
      },
    );
  });
}

/**
 * Process a single cooperative by ID
 */
export async function migrateSingleCooperativeById(id: number) {
  return new Promise((resolve, reject) => {
    connection.query<RowDataPacket[]>(
      getCoopByIdQuery,
      [id],
      async (err, results) => {
        if (err) {
          reject(err);
          return;
        }

        if (results.length === 0) {
          resolve({
            success: false,
            message: `No cooperative found with ID: ${id}`,
            id,
          });
          return;
        }

        const row = results[0];
        const result = await processCooperative(row, id);
        resolve(result);
      },
    );
  });
}

/**
 * Process a single cooperative by registration number (backward compatible)
 */
export async function migrateSingleCooperative(regNo: string) {
  return new Promise((resolve, reject) => {
    // First get the ID from the registration number
    getIdByRegNo(regNo)
      .then((id) => {
        if (!id) {
          resolve({
            success: false,
            message: `No cooperative found with registration number: ${regNo}`,
            regNo,
          });
          return;
        }
        return migrateSingleCooperativeById(id);
      })
      .then(resolve)
      .catch(reject);
  });
}

/**
 * Process a single cooperative row with optional ID
 */
async function processCooperative(row: any, id?: number) {
  const coopName = row.coopName?.trim();
  const regNo = row.regNo?.trim();
  const recordId = id || row.id;

  console.log(`\n📋 Processing #${recordId}: ${coopName} (${regNo})`);

  try {
    if (!regNo) {
      console.log("❌ No Registration Number:", coopName);
      logMigrationError(
        regNo || "N/A",
        coopName || "Unknown",
        "Missing registration number",
        `Record ${recordId} has no regNo`,
      );
      return {
        success: false,
        message: "Missing registration number",
        regNo: "N/A",
        coopName,
        id: recordId,
      };
    }

    // ... (rest of the processing logic remains the same until the duplicate check)

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
      console.log(`⏭️ Skipping - Already exists: ${coopName}`);
      logMigrationError(
        regNo || "N/A",
        coopName || "Unknown",
        "Duplicated item",
        `Record ${recordId} is duplicated`,
      );
      return {
        success: false,
        message: "Cooperative already exists",
        regNo,
        coopName,
        id: recordId,
      };
    }

    // ... (rest of the processing logic remains the same)

    console.log(`✅ Successfully migrated: ${coopName}`);
    return {
      success: true,
      message: "Successfully migrated",
      regNo,
      coopName,
      //   email,
      //   region: myRegion.regCode,
      id: recordId,
    };
  } catch (error: any) {
    console.error(`❌ Error migrating ${coopName}:`, error.message);
    return {
      success: false,
      message: "Migration error",
      regNo,
      coopName,
      id: recordId,
      error,
    };
  }
}

/**
 * Migrate a range of cooperatives by ID
 * @param {number} startId - Starting ID (inclusive)
 * @param {number} endId - Ending ID (inclusive)
 * @param {number} delayMs - Delay between migrations in milliseconds (optional)
 */
export async function migrateCooperativeRange(
  startId: number,
  endId: number,
  delayMs: number = 0,
) {
  console.log(
    `🚀 Starting migration for cooperatives from ID ${startId} to ${endId}`,
  );
  console.log("=".repeat(60));

  const results = {
    total: 0,
    success: 0,
    failed: 0,
    skipped: 0,
    errors: [] as any[],
  };

  for (let id = startId; id <= endId; id++) {
    results.total++;

    try {
      const result: any = await migrateSingleCooperativeById(id);

      if (result.success) {
        results.success++;
        console.log(`[${results.total}] ✅ ID ${id}: ${result.coopName}`);
      } else if (result.message?.includes("already exists")) {
        results.skipped++;
        console.log(
          `[${results.total}] ⏭️ ID ${id}: Skipped - ${result.message}`,
        );
      } else {
        results.failed++;
        results.errors.push({ id, result });
        console.log(
          `[${results.total}] ❌ ID ${id}: Failed - ${result.message}`,
        );
      }

      // Add delay if specified
      if (delayMs > 0 && id < endId) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    } catch (error: any) {
      results.failed++;
      results.errors.push({ id, error });
      console.log(`[${results.total}] ❌ ID ${id}: Error - ${error.message}`);
    }
  }

  console.log("=".repeat(60));
  console.log("📊 Migration Summary:");
  console.log(`   Total Processed: ${results.total}`);
  console.log(`   ✅ Successful: ${results.success}`);
  console.log(`   ⏭️  Skipped: ${results.skipped}`);
  console.log(`   ❌ Failed: ${results.failed}`);

  if (results.errors.length > 0) {
    console.log("\n❌ Failed Items:");
    results.errors.forEach((err) => {
      console.log(
        `   ID ${err.id}: ${err.result?.message || err.error?.message}`,
      );
    });
  }

  await prismaCoop.$disconnect();
  await prismaAuth.$disconnect();
  connection.end();

  return results;
}

/**
 * Migrate cooperatives starting from a specific ID with a limit
 * @param {number} startId - Starting ID
 * @param {number} limit - Number of records to process
 * @param {number} delayMs - Delay between migrations in milliseconds
 */
export async function migrateCooperativeBatch(
  startId: number,
  limit: number = 100,
  delayMs: number = 100,
) {
  const endId = startId + limit - 1;
  return migrateCooperativeRange(startId, endId, delayMs);
}

/**
 * Migrate a specific cooperative by registration number (existing function)
 */
export async function migrateCooperative(regNo: string) {
  console.log(`🚀 Starting migration for cooperative: ${regNo}`);
  console.log("=".repeat(60));

  try {
    const result: any = await migrateSingleCooperative(regNo);

    console.log("=".repeat(60));
    console.log("📊 Migration Result:");
    console.log(`   Status: ${result.success ? "✅ SUCCESS" : "❌ FAILED"}`);
    console.log(`   Registration: ${result.regNo}`);
    console.log(`   Cooperative: ${result.coopName || "N/A"}`);
    console.log(`   Message: ${result.message}`);

    await prismaCoop.$disconnect();
    await prismaAuth.$disconnect();
    connection.end();

    return result;
  } catch (error) {
    console.error("❌ Migration failed:", error);
    await prismaCoop.$disconnect();
    await prismaAuth.$disconnect();
    connection.end();
    throw error;
  }
}

/**
 * Resume migration from a specific ID
 * @param {number} startId - ID to start from
 * @param {number} batchSize - Number of records to process
 * @param {number} delayMs - Delay between migrations
 */
export async function resumeMigration(
  startId: number,
  batchSize: number = 100,
  delayMs: number = 100,
) {
  console.log(`🔄 Resuming migration from ID ${startId}`);
  return migrateCooperativeBatch(startId, batchSize, delayMs);
}

// Command line interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command) {
    console.log(`
Usage:
  node script.js range <startId> <endId> [delayMs]
  node script.js batch <startId> [limit] [delayMs]
  node script.js resume <startId> [batchSize] [delayMs]
  node script.js single <regNo>
  node script.js count

Examples:
  node script.js range 1 100           # Migrate IDs 1 to 100
  node script.js range 1 100 500       # Migrate IDs 1 to 100 with 500ms delay
  node script.js batch 1 50            # Migrate 50 records starting from ID 1
  node script.js resume 101            # Resume from ID 101
  node script.js single 9520-01000214  # Migrate a specific registration number
  node script.js count                 # Show total number of records
    `);
    process.exit(1);
  }

  switch (command) {
    case "count": {
      getTotalRecords()
        .then((total) => {
          console.log(`📊 Total records: ${total}`);
          connection.end();
        })
        .catch((error) => {
          console.error("Error getting total count:", error);
          connection.end();
          process.exit(1);
        });
      break;
    }

    case "range": {
      const startId = parseInt(args[1]);
      const endId = parseInt(args[2]);
      const delayMs = parseInt(args[3]) || 100;

      if (isNaN(startId) || isNaN(endId)) {
        console.error("❌ Please provide valid start and end IDs");
        process.exit(1);
      }

      migrateCooperativeRange(startId, endId, delayMs)
        .then((results) => {
          if (results.failed > 0) {
            process.exit(1);
          }
        })
        .catch((error) => {
          console.error("Fatal error:", error);
          process.exit(1);
        });
      break;
    }

    case "batch": {
      const startId = parseInt(args[1]);
      const limit = parseInt(args[2]) || 100;
      const delayMs = parseInt(args[3]) || 100;

      if (isNaN(startId)) {
        console.error("❌ Please provide a valid start ID");
        process.exit(1);
      }

      migrateCooperativeBatch(startId, limit, delayMs)
        .then((results) => {
          if (results.failed > 0) {
            process.exit(1);
          }
        })
        .catch((error) => {
          console.error("Fatal error:", error);
          process.exit(1);
        });
      break;
    }

    case "resume": {
      const startId = parseInt(args[1]);
      const batchSize = parseInt(args[2]) || 100;
      const delayMs = parseInt(args[3]) || 100;

      if (isNaN(startId)) {
        console.error("❌ Please provide a valid start ID");
        process.exit(1);
      }

      resumeMigration(startId, batchSize, delayMs)
        .then((results) => {
          if (results.failed > 0) {
            process.exit(1);
          }
        })
        .catch((error) => {
          console.error("Fatal error:", error);
          process.exit(1);
        });
      break;
    }

    case "single": {
      const regNo = args[1];
      if (!regNo) {
        console.error("❌ Please provide a registration number");
        process.exit(1);
      }

      migrateCooperative(regNo)
        .then((result) => {
          if (!result.success) {
            process.exit(1);
          }
        })
        .catch((error) => {
          console.error("Fatal error:", error);
          process.exit(1);
        });
      break;
    }

    default: {
      console.error(`❌ Unknown command: ${command}`);
      process.exit(1);
    }
  }
}
