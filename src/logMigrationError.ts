import fs from "fs";
import path from "path";

// Simple error log file path - fixed location
const errorLogFilePath = path.join(process.cwd(), "migration_errors_log.txt");

/**
 * Initialize the error log file - only creates if it doesn't exist
 * Won't overwrite existing content
 */
function initializeErrorLog(): void {
  try {
    // Check if file exists
    if (!fs.existsSync(errorLogFilePath)) {
      // Create new file with header
      fs.writeFileSync(errorLogFilePath, "Migration Errors Log\n");
      fs.appendFileSync(errorLogFilePath, "=".repeat(80) + "\n");
      fs.appendFileSync(
        errorLogFilePath,
        `Timestamp: ${new Date().toISOString()}\n`,
      );
      fs.appendFileSync(errorLogFilePath, "=".repeat(80) + "\n\n");
      console.log(`✅ Error log created at: ${errorLogFilePath}`);
    } else {
      // File exists - just append a separator and timestamp
      fs.appendFileSync(errorLogFilePath, "\n" + "=".repeat(80) + "\n");
      fs.appendFileSync(
        errorLogFilePath,
        `Session started: ${new Date().toISOString()}\n`,
      );
      fs.appendFileSync(errorLogFilePath, "=".repeat(80) + "\n\n");
      console.log(`✅ Appending to existing error log at: ${errorLogFilePath}`);
    }
  } catch (error) {
    console.error("Failed to initialize error log:", error);
  }
}

// Initialize
initializeErrorLog();

/**
 * Log migration errors to a separate file - ALWAYS APPENDS
 * @param regNo - Registration number
 * @param coopName - Cooperative name
 * @param error - Error object or message
 * @param context - Additional context information
 */
export function logMigrationError(
  regNo: string,
  coopName: string,
  error: Error | string,
  context: string = "",
): void {
  const timestamp = new Date().toISOString();

  const errorMessage = `
[${timestamp}] ERROR
  RegNo: ${regNo || "N/A"}
  Coop Name: ${coopName || "N/A"}
  Context: ${context || "No context provided"}
  Error: ${error instanceof Error ? error.message : error || "Unknown error"}
  ${error instanceof Error && error.stack ? `Stack: ${error.stack}` : ""}
  ${"-".repeat(60)}
`;

  try {
    // ALWAYS append - never overwrite
    fs.appendFileSync(errorLogFilePath, errorMessage);
  } catch (fsError) {
    console.error("Failed to write to error log:", fsError);
  }

  // Log to console for real-time monitoring
  console.error(
    `❌ ERROR [${regNo || "N/A"}]: ${coopName || "N/A"} - ${error instanceof Error ? error.message : error}`,
  );
}

// import fs from "fs";
// import path from "path";

// // Simple error log file path - fixed location
// const errorLogFilePath = path.join(process.cwd(), "migration_errors_log.txt");

// // Initialize the error log file with header
// try {
//   fs.writeFileSync(errorLogFilePath, "Migration Errors Log\n");
//   fs.appendFileSync(errorLogFilePath, "=".repeat(80) + "\n");
//   fs.appendFileSync(
//     errorLogFilePath,
//     `Timestamp: ${new Date().toISOString()}\n`,
//   );
//   fs.appendFileSync(errorLogFilePath, "=".repeat(80) + "\n\n");
//   console.log(`✅ Error log initialized at: ${errorLogFilePath}`);
// } catch (error) {
//   console.error("Failed to initialize error log:", error);
// }

// /**
//  * Log migration errors to a separate file
//  * @param regNo - Registration number
//  * @param coopName - Cooperative name
//  * @param error - Error object or message
//  * @param context - Additional context information
//  */
// export function logMigrationError(
//   regNo: string,
//   coopName: string,
//   error: Error | string,
//   context: string = "",
// ): void {
//   const timestamp = new Date().toISOString();

//   const errorMessage = `
// [${timestamp}] ERROR
//   RegNo: ${regNo || "N/A"}
//   Coop Name: ${coopName || "N/A"}
//   Context: ${context || "No context provided"}
//   Error: ${error instanceof Error ? error.message : error || "Unknown error"}
//   ${error instanceof Error && error.stack ? `Stack: ${error.stack}` : ""}
//   ${"-".repeat(60)}
// `;

//   try {
//     fs.appendFileSync(errorLogFilePath, errorMessage);
//   } catch (fsError) {
//     console.error("Failed to write to error log:", fsError);
//   }

//   // Log to console for real-time monitoring
//   console.error(
//     `❌ ERROR [${regNo || "N/A"}]: ${coopName || "N/A"} - ${error instanceof Error ? error.message : error}`,
//   );
// }
