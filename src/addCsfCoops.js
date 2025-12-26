import { prismaAuth } from "./utils/prismaAuth.js";
import { prismaCoop } from "./utils/prismaCoop.js";
import hashPasswordUtil from "./utils/hashPasswordUtil.js";
import randomPassword from "./utils/randomPassword.js";
import { loadJSON } from "./utils/loadJson.js";
import path from "path";
import fs from "fs";
import { generateReferenceId } from "./utils/generateReferenceId.js";

const logFilePath = path.join(process.cwd(), "csf_credential_logs.txt");

export default async function runAddCsfCoops() {
  const csfCoops = loadJSON("csf_migration.json");

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  console.log(
    `Starting migration of ${csfCoops.length} credit surety fund cooperatives...`
  );

  for (const [index, row] of csfCoops.entries()) {
    console.log(`Processing ${index + 1}/${csfCoops.length}`);

    try {
      const newReferenceId = generateReferenceId();
      const registrationNo = row.regNo?.trim();
      const cooperativeName = row.coopName?.trim();
      const acronym = row.acronym?.trim() || null;
      const email = row.email?.trim()?.toLowerCase();
      const csfCoopTypeId = "d4c3b2a1-7e6f-4d2c-9b1a-6e5d4c3b2a1f";
      const isBspRegistered = Number(row.isBspRegistered) === 1;
      const areaOfOperation = row.type.toLowerCase(); // city or province

      // Validate required fields
      if (!registrationNo || !cooperativeName || !email) {
        console.log("[SKIP] Missing required fields:", row);
        skipCount++;
        continue;
      }

      // Check if cooperative already exists
      const existingCoop = await prismaCoop.cooperativeOrg.findUnique({
        where: { regNo: registrationNo },
        select: { id: true },
      });

      if (existingCoop) {
        console.log(`[SKIP] Cooperative already exists: ${registrationNo}`);
        skipCount++;
        continue;
      }

      // Check if user already exists
      const existingUser = await prismaAuth.user.findUnique({
        where: { email },
        select: { id: true },
      });

      if (existingUser) {
        console.log(`[SKIP] User already exists: ${email}`);
        skipCount++;
        continue;
      }

      const plainPassword = randomPassword();
      const hashedPassword = await hashPasswordUtil(plainPassword);

      const loggedUsers = new Set();

      // Transaction: user + cooperative
      await prismaAuth.$transaction(async (txAuth) => {
        const user = await txAuth.user.create({
          data: {
            email,
            password: hashedPassword,
            firstname: "User",
            lastname: "",
            verified_at: new Date(),
            status: "APPROVED",
            migrated: 1,
          },
        });

        if (!loggedUsers.has(email)) {
          fs.appendFileSync(logFilePath, `${email},${plainPassword}\n`);
          loggedUsers.add(email);
        }

        await prismaCoop.cooperativeOrg.create({
          data: {
            regNo: registrationNo,
            cooperativeName,
            acronym,
            email,
            isCompliant: true,
            migrated: 1,
            ownedBy: user.id,

            approvedCooperative: {
              create: {
                registrationId: newReferenceId,
                cooperativeName,
                cooperativeCategory: "special",
                cooperativeType: {
                  connect: { id: csfCoopTypeId },
                },
                isAmendment: false,
                isBspRegistered: isBspRegistered,
                areaOfOperation,
                isDraft: false,
                // migrated: 1,
              },
            },
          },
        });
      });

      successCount++;
    } catch (err) {
      console.error("[ERROR] Failed to insert row:", row);
      console.error(err);
      errorCount++;
    }
  }

  console.log("Migration finished", {
    successCount,
    skipCount,
    errorCount,
  });
}
