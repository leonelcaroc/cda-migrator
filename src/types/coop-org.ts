// model CooperativeOrg {
//   id                       String              @id @default(uuid())
//   email                    String?
//   createdBy                String?
//   createdAt                DateTime?           @default(now())
//   updatedAt                DateTime?           @updatedAt
//   deletedAt                DateTime?
//   date_of_cor              DateTime?
//   audit_logs               Json?
//   approvedCooperativeId    String?             @unique
//   draftRegId               String?             @default("")
//   parentCooperatives       Json?
//   ownedBy                  String?
//   alternateRepId           String?             @unique
//   primaryRepId             String?             @unique
//   amendmentApplicationId   String?             @unique
//   amendmentCount           Int?                @default(0)
//   mergerCount              Int?                @default(0)
//   alternate_contact_number String?
//   alternate_email          String?
//   contact_number           String?
//   isCompliant              Boolean?
//   regNo                    String?             @unique
//   cooperativeName          String?             @unique
//   complianceCategoryId     Int?
//   complianceStatusId       Int?
//   complianceTypeId         Int?
//   migrated                 Int?                @default(0)
//   prevComplianceRemarks    String?
//   acronym                  String?
//   dateOfRegistration       DateTime?
//   amendmentHistory         Json?
//   mergerHistory            Json?
//   recentAmendmentDate      DateTime?
//   BranchSatellite          BranchSatellite[]
//   coopStatuses             CoopStatus[]
//   alternateRepresentative  Representative?     @relation("OrgAlternateRep", fields: [alternateRepId], references: [id])
//   amendmentApplication     Cooperatives?       @relation("OrgAmendmentApplication", fields: [amendmentApplicationId], references: [id])
//   approvedCooperative      Cooperatives?       @relation("OrgApprovedApplication", fields: [approvedCooperativeId], references: [id])
//   complianceCategory       ComplianceCategory? @relation(fields: [complianceCategoryId], references: [id])
//   complianceStatus         ComplianceStatus?   @relation(fields: [complianceStatusId], references: [id])
//   complianceType           ComplianceType?     @relation(fields: [complianceTypeId], references: [id])
//   primaryRepresentative    Representative?     @relation("OrgPrimaryRep", fields: [primaryRepId], references: [id])
//   cooperatives             Cooperatives[]      @relation("OrgApplications")
//   laboratories             Laboratory[]
// }

export type CoopOrg = {};
