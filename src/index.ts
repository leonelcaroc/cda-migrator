// import "dotenv/config";
// import express from "express";
// // import thirdTestMigration from "./thirdTestMigration";
// // import thirdTestMigration from "./thirdTestMigration.js";
// // import fourthTestMigration from "./fourthTestMigration.js";
// import fifthTestMigration from "./fifthTestMigration.js";
// import sixthTestMigration from "./sixthTestMigration.js";
// import runAddCsfCoops from "./addCsfCoops.js";
// import { prismaCoop } from "./utils/prismaCoop.js";
// import { deleteAll } from "./deleteRecords.js";
// import { migrateCooperativeRange } from "./seventhTestMigration.js";
// import eightTestMigration from "./eightMigrationTesting.js";

// const app = express();
// app.use(express.json());

// // Wrap top-level async logic in a function
// async function main() {
//   const start = 2048;
//   const end = 52063;

//   try {
//     app.get("/health", (_, res) => {
//       res.json({ status: "ok" });
//     });

//     // Run migrations safely
//     // await thirdTestMigration();
//     // await fourthTestMigration();
//     // await fifthTestMigration();

//     // for (let i = 2048; i <= 52063; i++) {
//     // // await fifthTestMigration(i);
//     // await fifthTestMigration(2049);
//     // }

//     for (let i = start; i <= end; i++) {
//       await eightTestMigration(i);
//     }

//     // await sixthTestMigration();
//     // await runAddCsfCoops();

//     // await migrateCooperativeRange(1, 100, 100);
//     // Migrates IDs 1 to 1000 with 100ms delay

//     // Option 1: Delete all in a single query using deleteMany

//     // deleteAll();

//     const PORT = 6000;
//     app.listen(PORT, () => {
//       console.log(`🚀 Migrator app running on http://localhost:${PORT}`);
//     });
//   } catch (err) {
//     console.error("🔥 Fatal error in main():", err);
//     process.exit(1); // exit so Node doesn't hang silently
//   }
// }

// // Call the main function
// main();

// ---------------------------------------------------------------------

import "dotenv/config";
import express from "express";
// import thirdTestMigration from "./thirdTestMigration";
// import thirdTestMigration from "./thirdTestMigration.js";
// import fourthTestMigration from "./fourthTestMigration.js";
import fifthTestMigration from "./fifthTestMigration.js";
import sixthTestMigration from "./sixthTestMigration.js";
import runAddCsfCoops from "./addCsfCoops.js";
import { prismaCoop } from "./utils/prismaCoop.js";
import { deleteAll } from "./deleteRecords.js";
import eightTestMigration from "./eightMigrationTesting.js";

const app = express();
app.use(express.json());

// Wrap top-level async logic in a function
async function main() {
  // const start = 2048;
  // const start = 2331;
  // const start = 5848;
  const start = 11031;
  const end = 52063;

  try {
    app.get("/health", (_, res) => {
      res.json({ status: "ok" });
    });

    // Run migrations safely
    // await thirdTestMigration();
    // await fourthTestMigration();
    // await fifthTestMigration();

    // for (let i = 2048; i <= 52063; i++) {
    // // await fifthTestMigration(i);
    // await fifthTestMigration(2049);
    // }

    // Track migration progress
    let successCount = 0;
    let failedIds = [];
    let errors = [];

    console.log(`🚀 Starting migration from ${start} to ${end}`);
    console.log(`📊 Total records to process: ${end - start + 1}\n`);

    for (let i = start; i <= end; i++) {
      console.log("ID: ", i);

      try {
        console.log(
          `🔄 Processing ID: ${i} (${successCount}/${end - start + 1} processed)`,
        );
        await eightTestMigration(i);
        successCount++;
      } catch (err: any) {
        // Log the specific error for this ID
        console.error(`❌ Failed to migrate ID: ${i}`);
        console.error(`   Error message: ${err.message}`);
        console.error(`   Error stack: ${err.stack}`);
        console.error(`   ════════════════════════════════════`);

        // Store failed ID and error for final report
        failedIds.push(i);
        errors.push({
          id: i,
          error: err.message,
          stack: err.stack,
        });

        // Optional: Continue or break based on error severity
        // You can decide to stop on first error or continue
        // Uncomment to stop on first error:
        // break;

        // Uncomment to continue with next ID:
        continue;
      }
    }

    // Final summary report
    console.log("\n════════════════════════════════════");
    console.log("📊 MIGRATION SUMMARY REPORT");
    console.log("════════════════════════════════════");
    console.log(`✅ Successfully migrated: ${successCount} records`);
    console.log(`❌ Failed migrations: ${failedIds.length} records`);
    console.log(
      `📈 Success rate: ${((successCount / (end - start + 1)) * 100).toFixed(2)}%`,
    );

    if (failedIds.length > 0) {
      console.log("\n❌ FAILED RECORDS:");
      console.log("─────────────────");
      failedIds.forEach((id, index) => {
        console.log(`  ${index + 1}. ID: ${id}`);
        console.log(`     Error: ${errors[index].error}`);
        console.log("─────────────────");
      });

      // Save detailed error report to file
      const fs = await import("fs");
      const reportDate = new Date().toISOString().replace(/[:.]/g, "-");
      const reportFileName = `migration-error-report-${reportDate}.json`;

      const reportData = {
        timestamp: new Date().toISOString(),
        startId: start,
        endId: end,
        totalProcessed: end - start + 1,
        successCount: successCount,
        failedCount: failedIds.length,
        failedIds: failedIds,
        errors: errors,
      };

      fs.writeFileSync(reportFileName, JSON.stringify(reportData, null, 2));
      console.log(`\n📄 Detailed error report saved to: ${reportFileName}`);
    } else {
      console.log("\n🎉 All records migrated successfully!");
    }
    console.log("════════════════════════════════════\n");

    // await sixthTestMigration();
    // await runAddCsfCoops();

    // await migrateCooperativeRange(1, 100, 100);
    // Migrates IDs 1 to 1000 with 100ms delay

    // Option 1: Delete all in a single query using deleteMany

    // deleteAll();

    const PORT = 6000;
    app.listen(PORT, () => {
      console.log(`🚀 Migrator app running on http://localhost:${PORT}`);
    });
  } catch (err: any) {
    console.error("🔥 Fatal error in main():", err);
    console.error(`   Error at ID: ${err.id || "Unknown"}`);
    process.exit(1); // exit so Node doesn't hang silently
  }
}

// Call the main function
main().catch((err) => {
  console.error("💥 Unhandled error in main execution:", err);
  process.exit(1);
});
