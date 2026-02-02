import { resolveCoopType } from "./resolveData.js";
import { normalizeCategory } from "./resolveData.js";
import { resolveCompliance } from "./resolveData.js";
import { normalizeDate } from "./resolveData.js";
import { normalizeAddress } from "./resolveData.js";
import { generateReferenceId } from "./generateReferenceId.js";

export function createCooperativeApplication(
  cooperativeData,
  isAmendment,
  amendmentNo,
) {
  const newRegRefId = generateReferenceId();

  const application = {
    //   cooperativeOrgId            //  String?
    //   cooperativeOrg              //  CooperativeOrg? @relation(name: "OrgApplications", fields: [cooperativeOrgId], references: [id])
    //   amendmentOrg                // CooperativeOrg? @relation(name: "OrgAmendmentApplication")
    //   amendmentType               //  String? // aoc, by-laws, or aoc-by-laws
    //   approvedByOrg              //   CooperativeOrg? @relation(name: "OrgApprovedApplication")

    registrationId: newRegRefId, //  String?         @unique
    //   applicationType: "",            //  String?
    //   leve: "",                       //  String?
    isAmendment: isAmendment, //  Boolean?        @default(false)
    amendmentNo: amendmentNo, //  Int?
    isConsolidation: false, //  Boolean?
    //   primaryRepresentative       //  String?
    //   secondaryRepresentative     //  String?
    //   isSubsidiaryCooperative: false,     //  Boolean? @default(false)
    //   isYouthCooperative: false,          //  Boolean? @default(false)
    //   isGuardianCooperative:        //  Boolean? @default(false)
    regularAndAssociate: 1, // String? // 1 = Regular, 2 = Regular and Associate
    regularMemberQualifications: [], // Json?
    associateMemberQualifications: [], // Json?

    //   validationTool    // ValidationTool? @relation("ValidationByRegistration")

    //   validator_question_id     // String? // foreign key
    //   validatorQuestion     // ValidatorQuestion? @relation(fields: [validator_question_id], references: [id])

    cooperativeCategory: "primary", // String? // primary, secondary, tertiary, special
    cooperativeTypeId: "", // String? // Foreign key to TypeCooperative
    cooperativeType: "", // TypeCooperative?          @relation(fields: [cooperativeTypeId], references: [id])
    coopTypeList: "", //  Json?  // List of Cooperative Types for (Multipurpose)
    formOfRegistration: "", // String? @default("none") // none, consolidation or merger
    parentCoop: "", // Json? // Parent Coop if Subsidiary Coop Registration
    consolidatingCoops: "", // Json? // Coops for Consolidation
    mergingCoops: "", // Json? // Coops for Merging
    industryClassification: "", // Json?
    cooperativeName: "", // String?
    coopNamePrefix: "", // String?
    allowCustomName: true, // Boolean? @default(false)
    cooperativeNameAcronym: "", // String?
    // reservedCoopName       ReservedCooperativeName[]
    isBspRegistered: "", // Boolean?

    regCode: "", // String?
    region: "", // Regions?                  @relation(fields: [regCode], references: [regCode])

    provCode: "", // String?
    province: "", // Province? @relation(fields: [provCode], references: [provCode])

    citymunCode: "", //String?
    cityMunicipality: "", // CityMunicipality? @relation(fields: [citymunCode], references: [citymunCode])

    brgyCode: "", // String?
    barangay: "", // Barangays? @relation(fields: [brgyCode], references: [brgyCode])

    townDistrict: "", //  String?
    zipCode: "", // String?
    streetName: "", // String?
    subdivisionVillageZone: "", //String?
    unitRoomFloorBuilding: "", //String?
    lotBlockPhaseHouseNo: "", //String?

    fedEngagedIn: "", // String?
    purposes: "", // Json?
    federationPurposes: "", //Json?

    termOfExistence: "", // Int? @default(50)

    chairmanOfBoard: "", // String?
    chairperson: "", //  String?
    commonBondOfMembership: "", // String? // associational, institutional, occupational, or residential
    fieldOfMembership: "", // String?
    nameOfAssociation: "", // Json?
    nameOfInstitution: "", // Json?
    compositionOfMembers: "", // Json?
    areaOfOperation: "", // String?
    areaOfOperationRegion: "", // Json?
    cooperatorList: "", // Json? // For Secondary and Tertiary Coops
    cooperators: "", // Json? // For Primary
    members: "", // Json? // Additional members in Primary excluding cooperators

    totalNoOfRegularMembers: "", // Int?
    totalNoOfAssociateMembers: "", // Int?
    totalNoOfMaleMembers: "", // Int?
    totalNoOfFemaleMembers: "", // Int?
    totalNoOfMembers: "", // Int?
    // totalNoOfCommittees     Int?

    fedCooperators: "", // Json?
    majorityMembersLocation: "", // String? // Cooperative Bank
    bodPerDiem: "", // Json? // Cooperative Bank
    qualificationPeriodYears: "", //Int? // Cooperative Bank

    totalFeeContributions: "", // Int?
    boardOfDirectors: "", // Json?
    electedAndQualifiedWithin: "", // Int?
    totalAuthorizedShareCapital: "", // Int?

    totalShares: "", // Int?
    shareParValue: "", // Int?

    hasPreferredShare: "", //Boolean?
    preferredShares: "", //Int?
    preferredShareParValue: "", //Int?
    commonShares: "", //Int?
    commonShareParValue: "", //Int?
    totalSubscribedCapital: "", //Int?
    totalPaidUpCapital: "", //Int?
    paidUpShareCommon: "", // Json?
    paidUpSharePreferred: "", // Json?
    totalRestrictedCapital: "", //  Int? // for Credit Surety Fund

    regularMinimumSubscribed: "", // Int?
    regularMinimumPaidUp: "", // Int?
    associateMinimumSubscribed: "", // Int?
    associateMinimumPaidUp: "", // Int?

    memberSubscriberShares: "", // Json?

    minimumShareSubscribed: "", // Int? // Federation
    minimumSharePaidUp: "", // Int? // Federation

    assignedTreasurer: "", // String? // Primary, Federation, Union
    regularMembersQualifications: "", // Json? // Primary
    associateMembersQualifications: "", // Json? // Primary
    requirementsForMembership: "", // Json? // Primary, Union
    membershipApplicationProcessingDays: "", // Int? // Primary and Union
    membershipFee: "", // Int? // Primary and Union
    regularMinSubscribedShares: "", // Int? // Primary
    regularMinPaidShares: "", // Int? // Primary
    associateMinSubscribedShares: "", // Int? // Primary
    associateMinPaidShares: "", // Int? // Primary
    membersEntitledToVote: "", // Json?
    delegatedPower: "", // Json?
    generalAssemblyPowers: "", // Json?
    // generalAssemblyMeetingDate          DateTime? // This must be Month and Day only and not a DateTime
    generalAssemblyMeeting: "", //  String?

    quorumPercentage: "", // Int? // Primary and Union
    boardOfDirectorsCount: "", //  Int? // Primary
    cooperatorsCount: "", // Int? // Primary
    numberOfMaleCooperators: "", //  Int? // Primary
    numberOfFemaleCooperators: "", //  Int? // Primary
    numberOfMaleBod: "", //  Int? // Primary
    numberOfFemaleBod: "", //  Int? // Primary
    maxConsecutiveAbsences: "", //  Int?
    maxPercentageAbsences: "", //  Int?
    electionTermLength: "", //  Int?
    capitalBuildMonthlyAmount: "", //  Int?
    capitalBuildAnnualInterest: "", //  Int?
    capitalBuildTransaction: "", //  Int?
    reserveFundPercentage: "", //  Int?
    educationAndTrainingFundPercentage: "", // Int?
    communityDevelopmentFundPercentage: "", // Int?
    optionalFundPercentage: "", // Int?
    votingRights: "", //  String?
    byLaws: "", //  Json?
    // economicSurvey                     Json?
    treasurerAffidavit: "", //  Json?
    documentaryRequirements: "", //  Json?
    otherDocumentaryRequirements: "", //  Json?
    // suretyBondFileUrl              : "",  //  String? // Cloud Storage file URL or key
    // prsCertificate            : "",       //  String? // Cloud Storage file URL or key

    economicSurvey: "", // CooperativeEconomicSurvey? // Only Primary Coops and CSF have Economic Survey

    articlesOfCooperativeFileUrl: "", //String? // Cloud Storage file URL or key
    byLawsFileUrl: "", // String? // Cloud Storage file URL or key
    economicSurveyUrl: "", // String? // Cloud Storage file URL or key
    treasurerAffidavitFileUrl: "", // String? // Cloud Storage file URL or key

    certOfRegFileUrl: "", // String? // Cloud Storage file URL or key
    certOfComplianceFileUrl: "", // String? // Cloud Storage file URL or key

    projectedMembershipIncrease: "", //Json?
    sourcesOfFunds: "", //Json?
    savingMobilization: "", // Json?
    revolvingCapital: "", // Boolean?
    typeAndNature: "", // Json?
    targetSegment: "", // Json?
    managementAndStaffing: "", // Json?
    capitalRequirements: "", // Json?
    logistics: "", // Json?
    legalDocumentsAndSystem: "", // Json?
    businessOperationAddress: "", // String?
    // application_review_days
    bodElection: "", // String?
    termOfOffice: "", //    Int? // Union
    directorsTerm: "", // Int? // Union

    noOfAuditCommittee: "", // Int? // Union
    noOfElectionCommittee: "", // Int? // Union
    noOfEducAndTrainingCommittee: "", // Int? // Union
    noOfMedConCommittee: "", // Int? // Union
    noOfEthicsCommittee: "", // Int? // Union
    // ----------------------------------

    economicAspect: "", // Json? // Credit Surety Fund
    financialAspect: "", // Json? // Credit Surety Fund
    technicalAspect: "", //Json? // Credit Surety Fund

    firstEvaluatedBy: "", // String?
    secondEvaluatedBy: "", // String?
    thirdEvaluatedBy: "", // String?

    firstEvaluatorStatus: "", //EvaluatorStatus?
    secondEvaluatorStatus: "", //EvaluatorStatus?
    thirdEvaluatorStatus: "", //EvaluatorStatus?

    aocHardCopyStatus: "", //EvaluatorStatus?
    byLawsHardCopyStatus: "", //EvaluatorStatus?
    econSurveyhardCopyStatus: "", //EvaluatorStatus?
    treasurerAffHardCopyStatus: "", //EvaluatorStatus?

    hardCopyValidationStatus: "", //EvaluatorStatus?

    // validatorRemarks        Json?
    seniorCdsRemarks: "", //Json?
    regionalDirectorRemarks: "", //Json?

    applicationStatus: "", // ApplicationStatus? @default(IN_PROGRESS)

    status: "", //Status?

    isApproved: "", // Boolean? @default(false)
    isDraft: "", // Boolean? @default(true)
    //   isDetailsComplete    // Boolean? @default(false)
    //   isAocComplete        // Boolean? @default(false)
    //   isByLawsComplete     // Boolean? @default(false)
    //   isEconSurveyComplete // Boolean? @default(false)

    expiresAt: "", // DateTime?
    createdBy: "", // String?
    updatedBy: "", // String?
    date_of_cor: "", // DateTime?
    registrationNo: "", // String? @unique
    //   created_at  // DateTime? @default(now())
    //   updated_at  // DateTime? @updatedAt
    //   archived_at // DateTime?
    //   deleted_at  // DateTime?
    //   closed_at   // DateTime?
    //   audit_logs  // Json?

    validatorId: "", // String?
    addressCoordinates: "", // Json?
    version: "", // String   @default("1")

    isMainOffice: "", // Boolean? @default(false)
    transferRegionCode: "", //  String?

    // cooperators Cooperator[]

    migrated: "", // Int? @default(0) // 1 = migrated, 0 = not from migration
  };

  return application;
}
