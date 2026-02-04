import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const loadJSON = (filename) => {
    return JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data", filename), "utf-8"));
};
//# sourceMappingURL=loadJson.js.map