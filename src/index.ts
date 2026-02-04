import "dotenv/config";
import express from "express";
// import thirdTestMigration from "./thirdTestMigration";
// import thirdTestMigration from "./thirdTestMigration.js";
import fourthTestMigration from "./fourthTestMigration.js";
import runAddCsfCoops from "./addCsfCoops.js";

const app = express();
app.use(express.json());

// Wrap top-level async logic in a function
async function main() {
  try {
    app.get("/health", (_, res) => {
      res.json({ status: "ok" });
    });

    // Run migrations safely
    // await thirdTestMigration();
    await fourthTestMigration();
    // await runAddCsfCoops();

    const PORT = 6000;
    app.listen(PORT, () => {
      console.log(`🚀 Migrator app running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("🔥 Fatal error in main():", err);
    process.exit(1); // exit so Node doesn't hang silently
  }
}

// Call the main function
main();
