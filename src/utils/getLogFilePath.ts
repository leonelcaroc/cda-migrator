import fs from "fs";
import path from "path";

export default function getLogFilePath() {
  const basePath = path.join(process.cwd(), "user_credentials_log.txt");

  // Check if file exists, if not create it with header
  if (!fs.existsSync(basePath)) {
    fs.writeFileSync(basePath, "Cooperatives Credentials\n");
  }

  return basePath;
}

// ----------------------------------------------------------

// import fs from "fs";
// import path from "path";

// export default function getLogFilePath() {
//   const basePath = path.join(process.cwd(), "user_credentials_log.txt");
//   return basePath;
// }

// import fs from "fs";
// import path from "path";

// export default function getLogFilePath() {
//   const basePath = path.join(process.cwd(), "user_credentials_log.txt");

//   // Check if the base file exists
//   if (!fs.existsSync(basePath)) {
//     return basePath;
//   }

//   // If it exists, find the next available version
//   let version = 1;
//   let newPath;

//   do {
//     // Remove .txt extension and add -v{version}.txt
//     const baseName = basePath.replace(".txt", "");
//     newPath = `${baseName}-v${version}.txt`;
//     version++;
//   } while (fs.existsSync(newPath));

//   return newPath;
// }
