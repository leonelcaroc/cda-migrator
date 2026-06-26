import { generateReferenceId } from "./generateReferenceId.js";
import randomPassword from "./randomPassword.js";
import randomString from "./randomString.js";
import {
  normalizeAddress,
  normalizeAreaOfOperation,
  normalizeCategory,
  normalizeDate,
  resolveCompliance,
  resolveCoopType,
} from "./resolveData.js";

export type TCoopOrg = {
  cooperativeName: string;
  acronym: string;
};

export type TRepresentative = {
  lastname: string; //              String?
  firstname: string; //             String?
  middlename: string; //            String?
  // extension_name: string; //        String?
  gender: string; //                String?
  nationality: string; //           String?
  birth_date: Date; //            DateTime?
  address: string; //               Json?
  designation: string; //           String?
  typeId: string; //                String?
  // typeOfId: ""; //              TypesOfID?           @relation("TypeOfIdToRepresentative", fields: [typeId], references: [id])
  id_no: string; //                 String?
  governmentId: string; //          String?
  primaryApplications: ""; //   AccountApplications? @relation("PrimaryRepresentative")

  primaryOrg: "";
};

export function createRepresentative(result: any, mockEmailCounter: number) {
  let user: any;
  // let mockEmailCounter = 1000;
  const cda_user = {
    email: result.user_email,
    firstname: result.user_first_name,
    lastname: result.user_last_name,
    middlename: result.user_middle_name,
    birth_date: result.user_birthdate,
    contactNumber: result.user_contact_number,
    address: result.user_address,
    idType: result.user_typeId,
    idNo: result.user_id_no,
    position: "",
  };

  const ca_user = {
    email: result.email,
    fullname: result.fullname,
    // firstname: result.user_first_name,
    // lastname: result.user_last_name,
    // middlename: result.user_middle_name,
    birth_date: "",
    contactNumber: "",
    address: "",
    idType: result.idType,
    idNo: result.idNo,
    position: result.position,
  };

  // if (ca_user.email) {
  //   user = ca_user;
  // } else

  if (cda_user) {
    user = cda_user;
  } else {
    user.email = `user_cda_${randomString()}_${mockEmailCounter}@gmail.com`;
    mockEmailCounter++;
  }

  // Invalid CA_USER fullname
  // 5504
  // 48929
  // 64685

  // let email = row.ca_user_email?.trim() || row.user_email?.trim();
  let plainPassword = randomPassword();

  // if (!email) {
  //   email = `user_cda_${randomString()}_${mockEmailCounter}@gmail.com`;
  //   mockEmailCounter++;
  // }

  // let finalName;

  // if (row?.ca_user_fullname) {
  //   // Use CA user full name entirely
  //   const fullName = row?.ca_user_fullname?.split(",");
  //   finalName = {
  //     firstName: fullName[0]?.trim(),
  //     middleName: fullName[1]?.trim(),
  //     lastName: fullName[2]?.trim() || "",
  //   };
  // } else if (
  //   row?.user_first_name ||
  //   row?.user_last_name ||
  //   row?.user_middle_name
  // ) {
  //   // Use row.user_* entirely
  //   finalName = {
  //     firstName: row?.user_first_name?.trim(),
  //     middleName: row?.user_middle_name?.trim(),
  //     lastName: row?.user_last_name?.trim(),
  //   };
  // } else {
  //   // Fallback to default Mock User
  //   finalName = {
  //     firstName: "Mock",
  //     middleName: "",
  //     lastName: "User",
  //   };
  // }

  // let contact_number =
  //   row.ca_user_mobileNo?.trim() || row.user_contact_number?.trim();

  // : TRepresentative

  if (user.email) {
    user.email = user.email;
  }

  if (user.birth_date) {
    user.birth_date = new Date(user.birth_date);
  }

  if (user.lastname) {
    user.lastname = user.lastname.trim();
  }
  if (user.firstname) {
    user.firstname = user.firstname.trim();
  }
  if (user.middlename) {
    user.middlename = user.middlename.trim();
  }
  if (user.address) {
    user.address = user.address.trim();
  }
  if (user.position) {
    user.position = user.position.trim();
  }
  if (user.contactNumber) {
    user.contactNumber = user.contactNumber.trim();
  }
  if (user.idType) {
    user.idType = String(user.idType).trim();
  }
  if (user.idNo) {
    user.idNo = user.idNo.trim();
  }

  const rep = {
    email: user.email, //              String?
    lastname: user.lastname, //              String?
    firstname: user.firstname, //             String?
    middlename: user.middlename, //            String?
    extension_name: "", //        String?
    gender: "", //                String?
    contactNumber: user.contactNumber,
    nationality: "Filipino", //           String?
    birth_date: user.birth_date, //            DateTime?
    address: user.address, //               Json?
    designation: user.position, //           String?
    typeId: user.idType, //                String?
    // typeOfId: "", //              TypesOfID?           @relation("TypeOfIdToRepresentative", fields: [typeId], references: [id])
    id_no: user.idNo, //                 String?
    governmentId: "", //          String?
    // primaryApplications: "", //   AccountApplications? @relation("PrimaryRepresentative")

    // primaryOrg: "",

    password: plainPassword,
  }; //           CooperativeOrg?     @relation("OrgPrimaryRep")

  return rep;
}

export function createCoopOrg(results: any, newRep: any) {
  const coopCompliance = resolveCompliance(results.compliant);

  const dateOfRegistration = normalizeDate(results.dateRegistered);

  const coopOrg = {
    cooperativeName: results.coopName, // String?           @unique
    acronym: results.acronym, //                  String?
    email: newRep.email, //          String?
    contact_number: newRep.contactNumber, //       String?
    // QUESTIONABLE createdBy: "a9d3f0b2-6e7c-4a91-8d5f-2c8e1b4f7a63", //      String? // optional: initial user id that created it
    // IGNORED cooperatives: "", //      Cooperatives[]    @relation(name: "OrgApplications")
    // IGNORED approvedCooperativeId: "", //String?           @unique
    // IGNORED approvedCooperative: "", //  Cooperatives?     @relation(name: "OrgApprovedApplication", fields: [approvedCooperativeId], references: [id])

    // parentCooperatives: "", //   Json?
    // laboratories: "", //     Laboratory[]
    // BranchSatellite: "", //     BranchSatellite[]

    // IGNORE primaryRepId: "", //        String?           @unique
    // IGNORE primaryRepresentative: "", //  Representative?   @relation("OrgPrimaryRep", fields: [primaryRepId], references: [id])

    // amendmentApplicationId: "", // String? @unique // Current Amendment Application - Ongoing
    // amendmentApplication: "", //  Cooperatives? @relation(name: "OrgAmendmentApplication", fields: [amendmentApplicationId], references: [id])

    // amendmentCount: "", // Int? @default(0) // Total amendments the cooperative had
    // recentAmendmentDate: "", //  DateTime?

    // FOCUS isCompliant: true, // Boolean? // Compliant or Non-Compliant
    // FOCUS complianceStatusId: 1, //     Int?
    // FOCUS complianceStatus: "", //     ComplianceStatus?   @relation(fields: [complianceStatusId], references: [id])

    // FOCUS complianceCategoryId: 1, //    Int?
    // FOCUS complianceCategory: "", //    ComplianceCategory? @relation(fields: [complianceCategoryId], references: [id])

    // FOCUS complianceTypeId: 0, //      Int?
    // FOCUS complianceType: "", //     ComplianceType?    @relation(fields: [complianceTypeId], references: [id])

    migrated: 1, //   Int? @default(0) // 1 = migrated, 0 = not from migration

    regNo: results.regNo, //         String? @unique
    dateOfRegistration: dateOfRegistration, //       DateTime?

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

    ...(coopCompliance.complianceTypeId && coopCompliance.complianceTypeId > 0
      ? {
          complianceType: {
            connect: { id: coopCompliance.complianceTypeId },
          },
        }
      : {}),

    // ownedBy: "3f7c9a6e-1b4a-4c8e-9f2d-8c6a2b5e91d4", //        String? // optional: initial user id that created it

    // CoopStatus relation
    // FOCUS coopStatuses: "", //       CoopStatus[]
  };

  return coopOrg;
}

export function createApplication(results: any) {
  const newReferenceId = generateReferenceId();

  const coopCategory = normalizeCategory(results.category);

  const finalCoopType = resolveCoopType(results.type, results.coopName) as any;

  if (!finalCoopType) {
    console.error("Cannot resolve cooperative type for:", results.coopName);
    throw new Error(`Missing cooperative type for ${results.coopName}`);
  }

  if (finalCoopType.type === "unknown") {
    console.log("finalCoopType.type: ", finalCoopType.type.id);

    // skipCount++;
    console.log("SKIPPED!");
    console.log(results.coopName);
    console.warn(
      `[SKIP] Missing coop type | RegNo: ${results.regNo} | Name: ${results.coopName} | Raw type: ${results.type}`,
    );
    // continue;
  }

  const streetName = results.Street?.trim() || "";
  const addressCodes = normalizeAddress(results.addrCode);
  const areaOfOperation = results.areaOfOperation?.trim()?.toLowerCase();
  const initialAop = normalizeAreaOfOperation(areaOfOperation);

  const application = {
    // Category
    // FN registrationId: newReferenceId,
    // IGNORE consolidatingCoops: [{	coopId: "f1f7f46e-d45b-44f4-8aa0-d605078bb5d3”, id: "06effc47-8de1-4842-96cc-a6cd1cf83c9f”, name: "Mamarlao Multi Purpose Cooperative"}],
    // FN consolidatingCoops: [],
    // coopTypeList: [], // [{id: "81f77162-318e-4e0f-9c47-f5c4e6cbf6e6", type: "Consumers”}],
    // FN coopTypeList: finalCoopType.coopTypeList,
    // FN cooperativeCategory: coopCategory,
    // IGNORE cooperativeType: "eb3e11de-bbf2-44f5-bf57-e6d2266de48c",
    // FN cooperativeType: {
    //   connect: { id: finalCoopType.id },
    // },
    // FN formOfRegistration: "none",
    // FN isSubsidiaryCooperative: false,
    // FN mergingCoops: [], // [	coopId: "0fb61cbb-b79b-4918-9993-1d5869a0d1db”, id: "d63f1190-1352-4eda-994b-c0762450352c”, name: "Nueva Segovia Consortium of Cooperatives"]
    // FN parentCoop: {}, // {coopId: "f1f7f46e-d45b-44f4-8aa0-d605078bb5d3”, id: "f081eb47-5da9-46ea-8cbf-88d7b36826e4”, name: "Mamarlao Multi Purpose Cooperative"}

    // Profile
    // IGNORE addressCoordinates: {
    //   latitude: 14.61290785730383,
    //   longitude: 120.9681227733749,
    // },
    // FN allowCustomName: true,
    // FN areaOfOperation: initialAop, // national, regional, inter-regional, provincial, city-municipality, barangay
    // IGNORE areaOfOperationRegions: [
    //   { regCode: "03", regDesc: "Region III" },
    //   { regCode: "07", regDesc: "Region VII" },
    // ],
    //  areaOfOperationRegions: [],
    // IGNORE brgyCode: "035401012",
    // IGNORE citymunCode: "035401",
    // IGNORE provCode: "0354",
    // IGNORE regCode: "03",
    // FN commonBondOfMembership: results.commonBond?.trim()?.toLowerCase(), // associational, institutional, occupational, residential
    compositionOfMembers: [
      {
        id: "0a0cebb5-b2d9-4aa2-9600-0c38be76332d",
        name: "Traditional chiefs and head of villages",
      },
    ],
    // FN coopNamePrefix: "",
    // coopOrgId: "5238b966-ac56-4ff3-8782-ee8a45c90df2",
    // FN cooperativeName: results?.coopName?.trim(),
    // FN cooperativeNameAcronym: results?.acronym?.trim(),
    fieldOfMembership: "Testing",
    industryClassification: [
      {
        no: 1,
        major: { id: 11, description: "Manufacture of beverages" },
        sub: {
          id: 11042,
          baseVolBus: "Gross Sales",
          description:
            "Manufacture of drinks flavored with fruit juices, syrups or other materials",
        },
      },
    ],
    // isGuardianCooperative: false,
    // isYouthCooperative: false,
    // FN lotBlockPhaseHouseNo: "",
    nameOfAssociation: [], // nameOfAssociation: ["Test", "Test"]
    nameOfInstitution: [], // nameOfInstitution: ["Test", "Test"]

    // FN ...(addressCodes.regCode && addressCodes.regCode.length === 2
    //   ? { region: { connect: { regCode: addressCodes.regCode } } }
    //   : {}),
    // ...(addressCodes.provCode && addressCodes.provCode.length === 4
    //   ? {
    //       province: {
    //         connect: { provCode: addressCodes.provCode },
    //       },
    //     }
    //   : {}),

    // ...(addressCodes.citymunCode && addressCodes.citymunCode.length === 6
    //   ? {
    //       cityMunicipality: {
    //         connect: { citymunCode: addressCodes.citymunCode },
    //       },
    //     }
    //   : {}),

    // ...(addressCodes.brgyCode && addressCodes.brgyCode.length === 9
    //   ? {
    //       barangay: {
    //         connect: { brgyCode: addressCodes.brgyCode },
    //       },
    //     }
    //   : {}),
    streetName: streetName,
    // subdivisionVillageZone: "",
    // townDistrict: "",
    // unitRoomFloorBuilding: "",
    // zipCode: "2005",

    // AOC
    assignedTreasurer: "TAN, MARCO A.",
    associateMinimumPaidUp: 0,
    associateMinimumSubscribed: 0,
    commonShareParValue: 100,
    commonShares: 1000,
    // coopOrgId: "5238b966-ac56-4ff3-8782-ee8a45c90df2",
    // cooperators: [
    //   {
    //     id: "bc4048fb-c85a-47b3-b0fd-6bf25685acd1",
    //     surname: "Dizon",
    //     firstname: "Mark",
    //     middle_initial: "",
    //   },
    // ],
    electedAndQualifiedWithin: 5,
    members: [],
    preferredShareParValue: 0,
    preferredShares: 0,
    purposes: [
      { id: "7749acf3-71ab-4f5e-8590-cef3c8777bad", description: "Test" },
    ],
    // registrationId: "2602010MC1Z26W"
    regularAndAssociate: "1", // “1” if regular only, “2” if regular and associate
    regularMinimumPaidUp: 10,
    regularMinimumSubscribed: 30,
    totalAuthorizedShareCapital: 100000,
    totalPaidUpCapital: 45000,
    totalSubscribedCapital: 75000,

    // By Laws
  };

  return application;
}
