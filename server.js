import "dotenv/config";
import express from "express";
// import dotenv from "dotenv";
import runMigration from "./src/migration.js";
import thirdTestMigration from "./src/thirdTestMigration.js";
import runAddCsfCoops from "./src/addCsfCoops.js";

// dotenv.config();

const app = express();
app.use(express.json());

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

thirdTestMigration();
// runAddCsfCoops();

const PORT = 6000;

app.listen(PORT, () => {
  console.log(`🚀 Migrator app running on http://localhost:${PORT}`);
});
