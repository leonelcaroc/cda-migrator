import { prismaAuth } from "./utils/prismaAuth.ts";
import { prismaCoop } from "./utils/prismaCoop.ts";
import hashPasswordUtil from "./utils/hashPasswordUtil.ts";
import randomPassword from "./utils/randomPassword.ts";
import { loadJSON } from "./utils/loadJson.ts";
import path from "path";
import fs from "fs";
import { v4 as uuid } from "uuid";
import { generateReferenceId } from "./utils/generateReferenceId.ts";
// import csf_coops_items from "./data/new_csfMigration.json" with { type: "json" };
import csf_coops_items from "./data/csf_main_coops_v1.json" with { type: "json" };
// import csf_cooperators from "./data/csf_cooperators.json" with { type: "json" };
import refregions from "./data/refregion.json" with { type: "json" };
import { generateUuid } from "./utils/generateUuid.ts";

const logFilePath = path.join(process.cwd(), "csf_credential_logs.txt");

// Clear previous log
fs.writeFileSync(logFilePath, "email,password\n");

export default async function runAddCsfCoops() {
  // const csfCoops = loadJSON("csf_migration.json");

  // 3 CSF Coops Only
  // const csfCoops = loadJSON("csf_migration.json").slice(0,   );
  // const csfCoops = loadJSON("csf_migration.json").slice(3, 3 + 10);

  // This is the MAIN CSF, and we get the cooperators inside the file 'csf_cooperators_v1.json'
  const csfCoops = csf_coops_items;
  // .slice(0, 10);
  // const csfCoops = csf_coops_items.slice(3, 13);

  // COOPERATORS which are the members of CSF
  // const cooperators = loadJSON("csf_cooperators.json");
  const cooperators = loadJSON("csf_cooperators_v1.json");

  // console.log("CSF Cooperators: ", cooperators);

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  console.log(
    `Starting migration of ${csfCoops.length} credit surety fund cooperatives...`,
  );

  for (const [index, row] of csfCoops.entries()) {
    console.log(`Processing ${index + 1}/${csfCoops.length}`);
    ``;

    try {
      const newReferenceId = generateReferenceId();
      const registrationNo = row.regNo?.trim();
      const rawDate = row.dateOfRegistration?.trim();

      const dateOfRegistration = rawDate ? new Date(rawDate) : null;
      const cooperativeName = row.coopName?.trim();
      const acronym = row.acronym?.trim() || null;
      const email = row.email?.trim()?.toLowerCase();
      const csfCoopTypeId = "d4c3b2a1-7e6f-4d2c-9b1a-6e5d4c3b2a1f";
      const isBspRegistered = Number(row.isBspRegistered) === 1;
      const areaOfOperation = row.type.toLowerCase(); // city or province
      const regCode = row.regCode; // Region Code
      const provCode = row.provCode; // Province Code
      const citymunCode = row.citymunCode; // City/Municipality Code
      const brgyCode = row.brgyCode; // Barangay Code

      const region = refregions.find(
        (item: { regCode: string; regDesc: string }) =>
          item.regCode === regCode,
      );

      const cooperatorList = cooperators
        .filter((item: any) => item.csfRegNo === registrationNo)
        .map((item: any) => ({
          id: uuid(),
          coopId: "",
          name: item.name.trim(),
          type: item.type.trim().toLowerCase(),
          address: item.address?.trim().replace(/\s+/g, " "),
          representative: `${item.lastName}, ${item.firstName} ${item.middleName}`,
          nationality: "Filipino",
          // role:
          //   item.role.toLowerCase() === "chairman"
          //     ? "chairperson"
          //     : item.role.toLowerCase() === "director"
          //       ? "board-of-director"
          //       : "",
          // bod: Boolean(item.role?.trim()),
          residence: item.residence?.trim().replace(/\s+/g, " "),
          contribution: Number(item.contribution.trim()),
          contributionType: item.contributionType.trim().toLowerCase(),
          amountOfPaidUpSharesCommon: 0,
          amountOfPaidUpSharesPreferred: 0,
          amountOfSubscribedSharesCommon: 0,
          amountOfSubscribedSharesPreferred: 0,
          noOfPaidUpSharesCommon: 0,
          noOfPaidUpSharesPreferred: 0,
          noOfSubscribedSharesCommon: 0,
          noOfSubscribedSharesPreferred: 0,
          restrictedCapital:
            item.contributionType === "grant"
              ? Number(item.contribution)
              : Number(item.contribution) * 0.99, // Multiply into 99% if contributionType is investment
        }));

      // console.log("cooperatorList: ", cooperatorList);

      const treasurer = cooperatorList?.find(
        (item: any) => item.isTreasurer === 1,
      );

      const treasurerFullName = treasurer
        ? `${treasurer.lastName ?? ""}, ${treasurer.firstName ?? ""} ${treasurer.middleName ?? ""}`
            .replace(/\s+/g, " ")
            .trim()
        : null;

      // Validate required fields
      if (!registrationNo || !cooperativeName || !email) {
        console.log(registrationNo, cooperativeName);
        console.log("[SKIP] Missing required fields:");
        // registrationNo, cooperativeName
        skipCount++;
        continue;
      }

      // Check if cooperative already exists
      // const existingCoop = await prismaCoop.cooperativeOrg.findUnique({
      //   where: { regNo: registrationNo },
      //   select: { id: true },
      // });

      // // TODO

      // if (existingCoop) {
      //   console.log(`[SKIP] Cooperative already exists: ${registrationNo}`);
      //   skipCount++;
      //   console.log("Skipped: ", registrationNo, cooperativeName);
      //   continue;
      // }

      // Check if user already exists
      // const existingUser = await prismaAuth.user.findUnique({
      //   where: { email },
      //   select: { id: true },
      // });

      // if (existingUser) {
      //   console.log(`[SKIP] User already exists: ${email}`);
      //   skipCount++;
      //   console.log("Skipped: ", registrationNo, cooperativeName);
      //   continue;
      // }

      const plainPassword = randomPassword();
      const hashedPassword = await hashPasswordUtil(plainPassword);

      const loggedUsers = new Set();

      // Transaction: user + cooperative
      await prismaAuth.$transaction(async (txAuth: any) => {
        // const user = await txAuth.user.create({
        //   data: {
        //     id: generateUuid(),
        //     email,
        //     password: hashedPassword,
        //     firstname: "User",
        //     lastname: "",
        //     verified_at: new Date(),
        //     status: "approved",
        //     migrated: 1,
        //   },
        // });

        const user = await txAuth.user.upsert({
          where: {
            email, // must be unique in schema (it is)
          },
          update: {
            // what to do if user already exists
            password: hashedPassword,
            firstname: "User",
            lastname: "",
            verified_at: new Date(),
            status: "approved",
            migrated: 1,
          },
          create: {
            id: generateUuid(),
            email,
            password: hashedPassword,
            firstname: "User",
            lastname: "",
            verified_at: new Date(),
            status: "approved",
            migrated: 1,
          },
        });

        if (!loggedUsers.has(email)) {
          fs.appendFileSync(
            logFilePath,
            `${registrationNo}, ${cooperativeName}, Region: ${regCode}, ${region?.regDesc}, ${email}, ${plainPassword}\n`,
          );
          loggedUsers.add(email);
        }

        // console.log("cooperatorList: ", cooperatorList);

        // await prismaCoop.cooperativeOrg.create({
        //   data: {
        //     regNo: registrationNo,
        //     cooperativeName,
        //     acronym,
        //     email,
        //     isCompliant: true,
        //     migrated: 1,
        //     ownedBy: user.id,
        //     dateOfRegistration: dateOfRegistration,

        //     approvedCooperative: {
        //       create: {
        //         registrationId: newReferenceId,
        //         cooperativeName,
        //         cooperativeCategory: "special",
        //         cooperativeType: {
        //           connect: { id: csfCoopTypeId },
        //         },
        //         isAmendment: false,
        //         isBspRegistered: isBspRegistered,
        //         areaOfOperation,
        //         commonBondOfMembership: "associational",
        //         cooperatorList: cooperatorList,
        //         assignedTreasurer: treasurerFullName,
        //         isDraft: false,
        //         applicationStatus: "APPROVED",
        //         region: {
        //           connect: {
        //             regCode: regCode,
        //           },
        //         },
        //         province: {
        //           connect: {
        //             provCode: provCode,
        //           },
        //         },
        //         cityMunicipality: {
        //           connect: {
        //             citymunCode: citymunCode,
        //           },
        //         },
        //         barangay: {
        //           connect: {
        //             brgyCode: brgyCode,
        //           },
        //         },
        //         // migrated: 1,
        //       },
        //     },
        //   },
        // });

        // ----------------------------------------------------------

        // await prismaCoop.cooperativeOrg.create({
        //   data: {
        //     regNo: registrationNo,
        //     cooperativeName,
        //     acronym,
        //     email,
        //     isCompliant: true,
        //     migrated: 1,
        //     ownedBy: user.id,
        //     dateOfRegistration,
        //     approvedCooperative: {
        //       create: {
        //         registrationId: newReferenceId,
        //         cooperativeName,
        //         cooperativeCategory: "special",
        //         cooperativeType: {
        //           connect: { id: csfCoopTypeId },
        //         },
        //         isAmendment: false,
        //         isBspRegistered,
        //         areaOfOperation,
        //         commonBondOfMembership: "associational",
        //         cooperatorList,
        //         assignedTreasurer: treasurerFullName,
        //         isDraft: false,
        //         applicationStatus: "APPROVED",
        //         region: { connect: { regCode } },
        //         province: { connect: { provCode } },
        //         cityMunicipality: { connect: { citymunCode } },
        //         barangay: { connect: { brgyCode } },
        //       },
        //     },
        //   },
        // });

        await prismaCoop.cooperativeOrg.upsert({
          where: {
            regNo: registrationNo,
          },
          update: {
            cooperativeName,
            acronym,
            email,
            isCompliant: true,
            migrated: 1,
            ownedBy: user.id,
            dateOfRegistration,

            // handle nested relation safely
            approvedCooperative: {
              upsert: {
                create: {
                  registrationId: newReferenceId,
                  cooperativeName,
                  cooperativeCategory: "special",
                  cooperativeType: {
                    connect: { id: csfCoopTypeId },
                  },
                  isAmendment: false,
                  isBspRegistered,
                  areaOfOperation,
                  commonBondOfMembership: "associational",
                  cooperatorList,
                  assignedTreasurer: treasurerFullName,
                  isDraft: false,
                  applicationStatus: "APPROVED",
                  region: { connect: { regCode } },
                  province: { connect: { provCode } },
                  cityMunicipality: { connect: { citymunCode } },
                  barangay: { connect: { brgyCode } },
                },
                update: {
                  cooperativeName,
                  cooperativeCategory: "special",
                  cooperativeType: {
                    connect: { id: csfCoopTypeId },
                  },
                  isAmendment: false,
                  isBspRegistered,
                  areaOfOperation,
                  commonBondOfMembership: "associational",
                  cooperatorList,
                  assignedTreasurer: treasurerFullName,
                  isDraft: false,
                  applicationStatus: "APPROVED",
                  region: { connect: { regCode } },
                  province: { connect: { provCode } },
                  cityMunicipality: { connect: { citymunCode } },
                  barangay: { connect: { brgyCode } },
                },
              },
            },
          },

          create: {
            regNo: registrationNo,
            cooperativeName,
            acronym,
            email,
            isCompliant: true,
            migrated: 1,
            ownedBy: user.id,
            dateOfRegistration,

            approvedCooperative: {
              create: {
                registrationId: newReferenceId,
                cooperativeName,
                cooperativeCategory: "special",
                cooperativeType: {
                  connect: { id: csfCoopTypeId },
                },
                isAmendment: false,
                isBspRegistered,
                areaOfOperation,
                commonBondOfMembership: "associational",
                cooperatorList,
                assignedTreasurer: treasurerFullName,
                isDraft: false,
                applicationStatus: "APPROVED",
                region: { connect: { regCode } },
                province: { connect: { provCode } },
                cityMunicipality: { connect: { citymunCode } },
                barangay: { connect: { brgyCode } },
              },
            },
          },
        });

        // await prismaCoop.cooperativeOrg.upsert({
        //   where: { regNo: registrationNo },
        //   update: {
        //     cooperativeName,
        //     acronym,
        //     email,
        //     isCompliant: true,
        //     migrated: 1,
        //     dateOfRegistration,

        //     approvedCooperative: {
        //       upsert: {
        //         update: {
        //           cooperativeName,
        //           cooperativeCategory: "special",
        //           isBspRegistered,
        //           areaOfOperation,
        //           commonBondOfMembership: "associational",
        //           cooperatorList,
        //           assignedTreasurer: treasurerFullName,
        //           applicationStatus: "APPROVED",
        //         },
        //         create: {
        //           registrationId: newReferenceId,
        //           cooperativeName,
        //           cooperativeCategory: "special",
        //           cooperativeType: {
        //             connect: { id: csfCoopTypeId },
        //           },
        //           isAmendment: false,
        //           isBspRegistered,
        //           areaOfOperation,
        //           commonBondOfMembership: "associational",
        //           cooperatorList,
        //           assignedTreasurer: treasurerFullName,
        //           isDraft: false,
        //           applicationStatus: "APPROVED",
        //           region: { connect: { regCode } },
        //           province: { connect: { provCode } },
        //           cityMunicipality: { connect: { citymunCode } },
        //           barangay: { connect: { brgyCode } },
        //         },
        //       },
        //     },
        //   },
        //   create: {
        //     regNo: registrationNo,
        //     cooperativeName,
        //     acronym,
        //     email,
        //     isCompliant: true,
        //     migrated: 1,
        //     ownedBy: user.id,
        //     dateOfRegistration,

        //     approvedCooperative: {
        //       create: {
        //         registrationId: newReferenceId,
        //         cooperativeName,
        //         cooperativeCategory: "special",
        //         cooperativeType: {
        //           connect: { id: csfCoopTypeId },
        //         },
        //         isAmendment: false,
        //         isBspRegistered,
        //         areaOfOperation,
        //         commonBondOfMembership: "associational",
        //         cooperatorList,
        //         assignedTreasurer: treasurerFullName,
        //         isDraft: false,
        //         applicationStatus: "APPROVED",
        //         region: { connect: { regCode } },
        //         province: { connect: { provCode } },
        //         cityMunicipality: { connect: { citymunCode } },
        //         barangay: { connect: { brgyCode } },
        //       },
        //     },
        //   },
        // });
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
