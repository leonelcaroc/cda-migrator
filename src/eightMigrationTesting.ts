import fs from "fs";
import path from "path";
import connection from "./utils/connectToMySqlDb.ts";
import { prismaAuth } from "./utils/prismaAuth.ts";
import { prismaCoop } from "./utils/prismaCoop.ts";

import hashPasswordUtil from "./utils/hashPasswordUtil.ts";
import randomPassword from "./utils/randomPassword.ts";
import randomString from "./utils/randomString.ts";
import { generateReferenceId } from "./utils/generateReferenceId.ts";

import { resolveCompliance } from "./utils/resolveData.ts";
import { resolveCoopType } from "./utils/resolveData.ts";
import { normalizeDate } from "./utils/resolveData.ts";
import { normalizeAddress } from "./utils/resolveData.ts";
import { normalizeCategory } from "./utils/resolveData.ts";
import { normalizeAreaOfOperation } from "./utils/resolveData.ts";
import { RowDataPacket } from "mysql2";
// import { ApplicationStatus } from "@prisma/client/coop/index.js";
// import { ApplicationStatus } from "@prisma/client/coop/index.ts";
import { ApplicationStatus } from "@prisma/client/coop/index.js";
import { generateUuid } from "./utils/generateUuid.ts";
import ref_regions from "./data/refregion.json" with { type: "json" };
import { createCooperativeApplication } from "./utils/createCooperativeApplication.ts";
import { logMigrationError } from "./logMigrationError.ts";

import {
  TCoopCategory,
  TCooperativeApplication,
} from "./utils/createCooperativeApplication.ts";
import { UserStatus } from "@prisma/client/auth/index.js";
import getLogFilePath from "./utils/getLogFilePath.ts";
// import { queryCoop } from "./helper/query.js";
import { queryCoop } from "./helper/query.ts";

// ---------------------------------------------------------

let mockEmailCounter = 1000;

/**
 * Log file path
 */
// const logFilePath = path.join(process.cwd(), "user_credentials_log.txt");
const logFilePath = getLogFilePath();

/**
 * Clear previous log
 */
fs.writeFileSync(logFilePath, "Cooperatives Credentials\n");

export default function eightTestMigration(id: number) {
  const coopId = id?.toString();

  connection.query<RowDataPacket[]>(queryCoop(coopId), async (err, results) => {
    if (err) throw err;

    let successCount = 0;
    let skipCount = 0;
    let noRegNoCount = 0;
    let unknownTypeCount = 0;
    let duplicateCount = 0;
    let errorCount = 0;

    console.log(`Starting migration of ${results.length} cooperatives...`);

    for (const [index, row] of results.entries()) {
      const recordNumber = index + 1;

      let coopName = row.coopName?.trim();
      const regNo = row.regNo?.trim();
      const id = row.id?.toString();

      try {
        if (recordNumber % 100 === 0 || recordNumber === results.length) {
          console.log(
            `Processing record ${recordNumber} of ${results.length}...`,
          );
        }

        if (!regNo) {
          skipCount++;
          noRegNoCount++;
          console.log("No Reg Number: ", coopName);

          logMigrationError(
            regNo || "N/A",
            coopName || "Unknown",
            "Missing registration number",
            `Record ${id} has no regNo`,
          );
          continue;
        }

        const newReferenceId = generateReferenceId();
        const streetName = row.Street?.trim() || "";
        const areaOfOperation_reg = row.areaOfOperation?.trim()?.toLowerCase();
        const dateOfRegistration = normalizeDate(row.dateRegistered);
        const registeredAmendment = {
          id: row.ra_id,
          // regNo: row.ra_cooperative_id,
          amendmentNo: Number(row.ra_amendment_no || 0),
          coopName: row.ra_coopName?.trim(),
          acronym: row.ra_acronym?.trim(),
          regNo: row.ra_regNo?.trim(),
          category: row.ra_category,
          type: row.ra_type,
          dateRegistered: row.ra_dateRegistered,
          commonBond: row.ra_commonBond?.trim()?.toLowerCase(),
          areaOfOperation: row.ra_areaOfOperation?.trim()?.toLowerCase(),
          noStreet: row.ra_noStreet,
          street: row.ra_Street,
          addrCode: row.ra_addrCode,
          interregional: row.ra_interregional,
          regions: row.ra_regions,
          compliant: row.ra_compliant,
          totalAmendments: Number(row.ra_total_amendments) - 1, // Less 1, remove the initial registration count

          fieldOfMembership: row.am_fieldOfMembership,
          // nameOfInsAssoc: row.am_nameOfInsAssoc ? [row.am_nameOfInsAssoc] : [],

          // Capitalization
          totalAuthorizedShareCapital: Number(
            row.amcap_authorizedShareCapital || 0,
          ),
          totalSubscribedCapital: Number(
            row.amcap_totalAmountOfSubscribedCapital || 0,
          ),
          totalPaidUpCapital: Number(row.amcap_totalAmountOfPaidUpCapital || 0),
        };

        const recentAmendmentDateRegistration = new Date(
          normalizeDate(registeredAmendment.dateRegistered) || 0,
        );

        if (row.content && row.content.trim() !== "") {
          console.log(`Coop Name: ${coopName} | RegNo: ${regNo}`);
        }

        const coopCategory = normalizeCategory(row.category);

        let acronym = row.acronym?.trim() || "";

        const fieldOfMembership = row.c_field_of_membership?.trim();

        const addressCodes = normalizeAddress(row.addr);
        const amendmentAddressCodes = normalizeAddress(
          registeredAmendment.addrCode,
        );

        const typeOfCoop = row?.type || row?.c_coop_type;

        const finalCoopType = resolveCoopType(
          typeOfCoop,
          row.cooperativeName,
        ) as any;

        const amendmentCoopType = resolveCoopType(
          registeredAmendment.type,
          registeredAmendment.coopName,
        );

        if (!finalCoopType) {
          console.error(
            "Cannot resolve cooperative type for:",
            row.cooperativeName,
          );
          throw new Error(
            `Missing cooperative type for ${row.cooperativeName}`,
          );
        }

        if (finalCoopType.type === "unknown") {
          console.log("finalCoopType.type: ", finalCoopType.type.id);

          skipCount++;
          console.log(coopName);
          console.warn(
            `[SKIP] Missing coop type | RegNo: ${regNo} | Name: ${coopName} | Raw type: ${row.type}`,
          );
          logMigrationError(
            regNo || "N/A",
            coopName || "Unknown",
            "Missing coop type",
            `Record ${id} has no coop type`,
          );
          continue;
        }

        const capitalization = {
          totalAuthorizedShareCapital: Number(
            row.authorized_share_capital || 0,
          ),
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

        const initialRegistrationApplication: TCooperativeApplication = {
          registrationId: newReferenceId,
          consolidatingCoops: [],
          coopTypeList: finalCoopType.coopTypeList,
          cooperativeCategory: coopCategory as TCoopCategory,
          cooperativeType: {
            connect: { id: finalCoopType.id },
          },
          formOfRegistration: "none",
          isSubsidiaryCooperative: false,
          mergingCoops: [],

          // parentCoop: null,

          allowCustomName: true,
          coopNamePrefix: "",
          areaOfOperation: normalizeAreaOfOperation(areaOfOperation_reg),
          areaOfOperationRegions: [],

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
          streetName: streetName,

          commonBondOfMembership: row.commonBond?.trim()?.toLowerCase(),
          // compositionOfMembers: composition, // still have an error, it can return number in name field

          cooperativeName: coopName,
          cooperativeNameAcronym: acronym,
          fieldOfMembership: fieldOfMembership || "",

          // industryClassification: [],

          isGuardianCooperative: false,
          isYouthCooperative: false,
          // nameOfAssociation: [],

          // isAmendment: false,

          totalAuthorizedShareCapital:
            capitalization.totalAuthorizedShareCapital,
          // totalNoOfRegularMembers: capitalization.totalNoOfRegularMembers,
          // totalNoOfAssociateMembers: capitalization.totalNoOfAssociateMembers,
          totalSubscribedCapital: capitalization.totalAmountOfSubscribedCapital,
          totalPaidUpCapital: capitalization.totalAmountOfPaidUpCapital,

          isDraft: false,
          applicationStatus: ApplicationStatus.APPROVED,
          migrated: 1,
        };

        // const createPrimaryCoop = createCooperativeApplication(
        //   initialRegistrationApplication,
        // );

        const latestRegisteredAmendment: TCooperativeApplication = {
          registrationId: generateReferenceId(),

          cooperativeName: registeredAmendment.coopName,
          cooperativeNameAcronym: "",
          cooperativeCategory: normalizeCategory(
            registeredAmendment.category,
          ) as TCoopCategory,
          // cooperativeType: amendmentCoopType?.id
          //   ? { connect: { id: amendmentCoopType.id } }
          //   : null,
          // ...(amendmentCoopType?.id
          //   ? { cooperativeType: { connect: { id: amendmentCoopType.id } } }
          //   : {}),
          // cooperativeType: {
          //   connect: {
          //     id: amendmentCoopType!.id,
          //   },
          // },
          // cooperativeType: {
          //   connect: { id: amendmentCoopType.id! },
          // },
          ...(amendmentCoopType.id
            ? {
                cooperativeType: {
                  connect: { id: amendmentCoopType.id },
                },
              }
            : {}),
          // coopTypeList: amendmentCoopType.coopTypeList,
          coopTypeList: [],
          isAmendment: true,
          amendmentNo: Number(registeredAmendment.amendmentNo) || null,
          consolidatingCoops: [],
          isSubsidiaryCooperative: false,
          mergingCoops: [],
          isGuardianCooperative: false,
          isYouthCooperative: false,
          coopNamePrefix: "",
          allowCustomName: true,

          fieldOfMembership:
            registeredAmendment.fieldOfMembership?.trim() || "",
          // nameOfAssociation: registeredAmendment.nameOfInsAssoc?.trim() || "",
          streetName: registeredAmendment.street?.trim(),
          formOfRegistration: "none",
          commonBondOfMembership: registeredAmendment.commonBond,
          areaOfOperation: registeredAmendment.areaOfOperation,
          areaOfOperationRegions: [],
          totalAuthorizedShareCapital:
            registeredAmendment.totalAuthorizedShareCapital,
          totalSubscribedCapital: registeredAmendment.totalSubscribedCapital,
          totalPaidUpCapital: registeredAmendment.totalPaidUpCapital,
          isDraft: false,
          applicationStatus: ApplicationStatus.APPROVED,
          migrated: 1,

          ...(amendmentAddressCodes.regCode &&
          amendmentAddressCodes.regCode.length === 2
            ? {
                region: { connect: { regCode: amendmentAddressCodes.regCode } },
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
                  connect: { citymunCode: amendmentAddressCodes.citymunCode },
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

        function coopRegion(
          amendmentAddressCodes: { regCode?: string },
          addressCodes: { regCode?: string },
        ) {
          // decide which regCode to use
          const regCode =
            registeredAmendment.totalAmendments > 0
              ? amendmentAddressCodes.regCode
              : addressCodes.regCode;

          // no regCode at all
          if (!regCode) {
            return { regCode: "n/a", regDesc: "n/a" };
          }

          // optional: enforce 2-digit region code only
          if (regCode.length !== 2) {
            return { regCode: null, regDesc: null };
          }

          const myReg = ref_regions.find((item) => item.regCode === regCode);

          // not found in reference table
          if (!myReg) {
            return { regCode: "n/a", regDesc: "n/a" };
          }

          return {
            regCode: `Region ${myReg.regCode}`,
            regDesc: myReg.regDesc,
          };
        }

        const myRegion = coopRegion(amendmentAddressCodes, addressCodes);

        const coopCompliance = resolveCompliance(
          registeredAmendment.compliant || row.compliant,
        );

        // Skip if delisted
        if (
          coopCompliance.complianceStatusId === 3 &&
          coopCompliance.complianceCategoryId === 9
        ) {
          console.log(
            `⏭️ Skipping delisted cooperative: ${coopName} (${regNo})`,
          );
          skipCount++;
          logMigrationError(
            regNo || "N/A",
            coopName || "Unknown",
            "Delisted cooperative",
            `Record ${id} is delisted`,
          );
          continue;
        }

        //  console.log("Coop: ", regNo, coopName, recentAmendmentDateRegistration);

        //  if (!recentAmendmentDateRegistration) {
        //   // console.log("Coop: ", regNo, coopName, registeredAmendment.dateRegistered ,recentAmendmentDateRegistration)
        //   console.log("Coop: ", regNo, coopName ,recentAmendmentDateRegistration)
        //   continue
        //  }

        // -------------------------------------------------------------
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
          skipCount++;
          console.log("Existing ORG: ", coopName);

          // logMigrationError(
          //   regNo || "N/A",
          //   coopName || "Unknown",
          //   "Duplicated item",
          //   `Record ${id} is duplicated`,
          // );
          continue;
        }

        /**
         * USER
         */

        let email = row.ca_user_email?.trim() || row.user_email?.trim();
        let plainPassword = randomPassword();

        if (!email) {
          email = `user_cda_${randomString()}_${mockEmailCounter}@gmail.com`;
          mockEmailCounter++;
        }

        let finalName;

        if (row?.ca_user_fullname) {
          // Use CA user full name entirely
          const fullName = row?.ca_user_fullname?.split(",");
          finalName = {
            firstName: fullName[0]?.trim(),
            middleName: fullName[1]?.trim(),
            lastName: fullName[2]?.trim() || "",
          };
        } else if (
          row?.user_first_name ||
          row?.user_last_name ||
          row?.user_middle_name
        ) {
          // Use row.user_* entirely
          finalName = {
            firstName: row?.user_first_name?.trim(),
            middleName: row?.user_middle_name?.trim(),
            lastName: row?.user_last_name?.trim(),
          };
        } else {
          // Fallback to default Mock User
          finalName = {
            firstName: "Mock",
            middleName: "",
            lastName: "User",
          };
        }

        let contact_number =
          row.ca_user_mobileNo?.trim() || row.user_contact_number?.trim();

        // let existingUser = await prismaAuth.user.findFirst({
        //   where: { email },
        // });

        // // -----------------------------------------------------------
        // const hashedPassword = await hashPasswordUtil(plainPassword);

        // existingUser = await prismaAuth.user.upsert({
        //   where: { email },
        //   update: {
        //     firstname: finalName?.firstName,
        //     middlename: finalName?.middleName,
        //     lastname: finalName?.lastName,
        //     mobile: contact_number || "",
        //     address: row.user_address?.trim() || "",
        //     status: UserStatus.APPROVED,
        //     migrated: 1,
        //     verified_at: new Date(),
        //     // Don't update password if you want to keep the existing one
        //     // If you want to update password too:
        //     // password: hashedPassword,
        //   },
        //   create: {
        //     id: generateUuid(),
        //     email,
        //     firstname: finalName?.firstName,
        //     middlename: finalName?.middleName,
        //     lastname: finalName?.lastName,
        //     mobile: contact_number || "",
        //     address: row.user_address?.trim() || "",
        //     // status: "approved",
        //     status: UserStatus.APPROVED,
        //     migrated: 1,
        //     verified_at: new Date(),
        //     password: hashedPassword,
        //   },
        // });

        let existingUser = await prismaAuth.user.findFirst({
          where: { email },
        });

        if (existingUser) {
          // User exists, update them
          existingUser = await prismaAuth.user.update({
            where: { email },
            data: {
              firstname: finalName?.firstName || existingUser.firstname,
              middlename: finalName?.middleName || existingUser.middlename,
              lastname: finalName?.lastName || existingUser.lastname,
              mobile: contact_number || existingUser.mobile,
              address: row.user_address?.trim() || existingUser.address,
              status: UserStatus.APPROVED,
              migrated: 1,
              verified_at: new Date(),
              // Only update password if you want to
              // password: hashedPassword,
            },
          });
        } else {
          // Create new user
          const hashedPassword = await hashPasswordUtil(plainPassword);
          existingUser = await prismaAuth.user.create({
            data: {
              id: generateUuid(),
              email:
                email ||
                `user_cda_${randomString()}_${mockEmailCounter}@gmail.com`,
              firstname: finalName?.firstName || "Mock",
              middlename: finalName?.middleName || "",
              lastname: finalName?.lastName || "User",
              mobile: contact_number || "",
              address: row.user_address?.trim() || "",
              status: UserStatus.APPROVED,
              migrated: 1,
              verified_at: new Date(),
              password: hashedPassword,
            },
          });
        }

        // Correct Code Below
        // if (!existingUser) {
        // const hashedPassword = await hashPasswordUtil(plainPassword);

        // existingUser = await prismaAuth.user.create({
        //   data: {
        //     id: generateUuid(),
        //     email,
        //     firstname: finalName?.firstName,
        //     middlename: finalName?.middleName,
        //     lastname: finalName?.lastName,
        //     mobile: contact_number || "",
        //     address: row.user_address?.trim() || "",
        //     // status: "APPROVED",
        //     // status: UserStatus.approved,
        //     status: "approved",
        //     migrated: 1,
        //     verified_at: new Date(),
        //     password: hashedPassword,
        //   } as any,
        // });

        // existingUser = await prismaAuth.user.upsert({
        //   where: {
        //     email: email, // or use any unique identifier
        //   },
        //   update: {
        //     // All fields you want to update/replace
        //     firstname: finalName?.firstName,
        //     middlename: finalName?.middleName,
        //     lastname: finalName?.lastName,
        //     mobile: contact_number || "",
        //     address: row.user_address?.trim() || "",
        //     status: "approved",
        //     migrated: 1,
        //     verified_at: new Date(),
        //     password: hashedPassword,
        //     // Note: id might not be updated if it's the primary key
        //   },
        //   create: {
        //     id: generateUuid(),
        //     email,
        //     firstname: finalName?.firstName,
        //     middlename: finalName?.middleName,
        //     lastname: finalName?.lastName,
        //     mobile: contact_number || "",
        //     address: row.user_address?.trim() || "",
        //     status: "approved",
        //     migrated: 1,
        //     verified_at: new Date(),
        //     password: hashedPassword,
        //   },
        // });

        const spacer = "   ";

        fs.appendFileSync(
          logFilePath,
          `${regNo}${spacer}${coopName}${spacer}${email}${spacer}${plainPassword}${spacer}${myRegion.regCode}${spacer}${myRegion.regDesc}\n`, // Add Region
        );
        // }

        try {
          // Tesst Delete
          // const test1 = await prismaCoop.cooperativeOrg.findUnique({
          //   where: {
          //     regNo,
          //   },
          // });

          // if (test1) {
          //   await prismaCoop.cooperativeOrg.delete({
          //     where: {
          //       regNo,
          //     },
          //   });
          //   console.log("Record deleted successfully");
          // } else {
          //   console.log("Record not found");
          // }

          // -----------------------------------------------------------

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
              email: email,
              alternate_email: "",
              contact_number: contact_number,
              alternate_contact_number: "",
              //     finalName = {
              //   firstName: row?.user_first_name?.trim(),
              //   middleName: row?.user_middle_name?.trim(),
              //   lastName: row?.user_last_name?.trim(),
              // };
              primaryRepresentative: {
                create: {
                  firstname: finalName?.firstName,
                  lastname: finalName?.lastName,
                  middlename: finalName?.middleName,
                  title: "",
                  // designation: "Chairperson",
                  // gender: "Male",
                  nationality: "Filipino",
                  // birth_date: new Date("1985-06-15"),
                  // id_no: "ABC123456",
                  // governmentId: "Passport",
                },
              },
              // primaryRepresentative: "",
              // alternateRepresentative: "",
              // laboratories: []
              // BranchSatellite: []
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

              cooperatives: {
                connect: [
                  { id: initial.id },
                  ...(amendment ? [{ id: amendment.id }] : []),
                ],
              },

              approvedCooperative: {
                connect: { id: approvedCoopData.id },
              },
            },
          });
        } catch (error: any) {
          errorCount++;

          if (error.code === "P2025" && error.meta?.cause) {
            const cause = error.meta.cause;

            if (cause.includes("Regions")) {
              logMigrationError(
                regNo || "N/A",
                coopName || "Unknown",
                "Error in Region",
                `Record ${id} has error in Region`,
              );

              console.warn(
                `[REGION ERROR]`,
                addressCodes.regCode,
                coopName,
                regNo,
              );
            } else if (cause.includes("Provinces")) {
              logMigrationError(
                regNo || "N/A",
                coopName || "Unknown",
                "Error in Province",
                `Record ${id} has error in Province`,
              );

              console.warn(
                `[PROVINCE ERROR]`,
                addressCodes.provCode,
                coopName,
                regNo,
              );
            } else if (cause.includes("CityMunicipalities")) {
              logMigrationError(
                regNo || "N/A",
                coopName || "Unknown",
                "Error in City/Municipality",
                `Record ${id} has error in City/Municipality`,
              );

              console.warn(
                `[CITYMUN ERROR]`,
                addressCodes.citymunCode,
                coopName,
                regNo,
              );
            } else if (cause.includes("Barangays")) {
              logMigrationError(
                regNo || "N/A",
                coopName || "Unknown",
                "Error in Barangay",
                `Record ${id} has error in Barangay`,
              );

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
        console.log("Error: ", coopName, regNo);
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

    // Need to turn off if data migration is Iterated 1 by 1
    // connection.end();
  });
}

// For Acronym

// const acronymRegex = /\(([^)]+)\)/;
// const acronymMatch = coopName.match(acronymRegex);

// if (acronymMatch) {
//   if (!acronym) acronym = acronymMatch[1].trim();
//   coopName = coopName.replace(acronymRegex, "").trim();
//   coopName = coopName.replace(/\s+/g, " ").replace(/[,|-]\s*$/, "");
// }
