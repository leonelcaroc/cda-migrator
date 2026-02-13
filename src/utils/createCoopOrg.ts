import randomPassword from "./randomPassword.js";
import randomString from "./randomString.js";

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

export function createCoopOrg() {
  const coopOrg = {
    cooperativeName: "Testing 123 Agriculture Cooperative", // String?           @unique
    acronym: "Testing", //                  String?
    email: "leo@gmail.com", //          String?
    contact_number: "09125784451", //       String?
    createdBy: "a9d3f0b2-6e7c-4a91-8d5f-2c8e1b4f7a63", //      String? // optional: initial user id that created it
    cooperatives: "", //      Cooperatives[]    @relation(name: "OrgApplications")
    approvedCooperativeId: "", //String?           @unique
    approvedCooperative: "", //  Cooperatives?     @relation(name: "OrgApprovedApplication", fields: [approvedCooperativeId], references: [id])

    // parentCooperatives: "", //   Json?
    // laboratories: "", //     Laboratory[]
    // BranchSatellite: "", //     BranchSatellite[]

    primaryRepId: "", //        String?           @unique
    primaryRepresentative: "", //  Representative?   @relation("OrgPrimaryRep", fields: [primaryRepId], references: [id])

    // amendmentApplicationId: "", // String? @unique // Current Amendment Application - Ongoing
    // amendmentApplication: "", //  Cooperatives? @relation(name: "OrgAmendmentApplication", fields: [amendmentApplicationId], references: [id])

    // amendmentCount: "", // Int? @default(0) // Total amendments the cooperative had
    // recentAmendmentDate: "", //  DateTime?

    isCompliant: true, // Boolean? // Compliant or Non-Compliant
    complianceStatusId: 1, //     Int?
    complianceStatus: "", //     ComplianceStatus?   @relation(fields: [complianceStatusId], references: [id])

    complianceCategoryId: 1, //    Int?
    complianceCategory: "", //    ComplianceCategory? @relation(fields: [complianceCategoryId], references: [id])

    complianceTypeId: 0, //      Int?
    complianceType: "", //     ComplianceType?    @relation(fields: [complianceTypeId], references: [id])

    migrated: 1, //   Int? @default(0) // 1 = migrated, 0 = not from migration

    regNo: "9520-84738579834", //         String? @unique
    dateOfRegistration: new Date(), //       DateTime?

    ownedBy: "3f7c9a6e-1b4a-4c8e-9f2d-8c6a2b5e91d4", //        String? // optional: initial user id that created it

    // CoopStatus relation
    coopStatuses: "", //       CoopStatus[]
  };

  return coopOrg;
}

export function createRepresentative(result: any) {
  let user: any;
  let mockEmailCounter = 1000;
  const cda_user = {
    email: result.user_email,
    firstname: result.user_first_name,
    lastname: result.user_last_name,
    middlename: result.user_middle_name,
    birth_date: result.user_birthdate,
    contactNumber: result.user_contact_number,
    address: result.user_address,
    typeId: result.user_typeId,
    id_no: result.user_id_no,
  };

  const ca_user = {
    fullname: result.fullname,
    firstname: result.user_first_name,
    lastname: result.user_last_name,
    middlename: result.user_middle_name,
    position: result.position,
    email: result.email,
    idType: result.idType,
    idNo: result.idNo,
  };

  if (ca_user.email) {
    user = ca_user;
  } else if (cda_user) {
    user = cda_user;
  } else {
    user.email = `user_cda_${randomString()}_${mockEmailCounter}@gmail.com`;
    mockEmailCounter++;
  }

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

  const rep = {
    lastname: "", //              String?
    firstname: "", //             String?
    middlename: "", //            String?
    extension_name: "", //        String?
    gender: "", //                String?
    nationality: "", //           String?
    birth_date: "", //            DateTime?
    address: "", //               Json?
    designation: "", //           String?
    typeId: "", //                String?
    typeOfId: "", //              TypesOfID?           @relation("TypeOfIdToRepresentative", fields: [typeId], references: [id])
    id_no: "", //                 String?
    governmentId: "", //          String?
    primaryApplications: "", //   AccountApplications? @relation("PrimaryRepresentative")

    primaryOrg: "",
  }; //           CooperativeOrg?     @relation("OrgPrimaryRep")

  return rep;
}
