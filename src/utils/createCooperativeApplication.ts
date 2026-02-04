// import { resolveCoopType } from "./resolveData.js";
// import { normalizeCategory } from "./resolveData.js";
// import { resolveCompliance } from "./resolveData.js";
// import { normalizeDate } from "./resolveData.js";
// import { normalizeAddress } from "./resolveData.js";
import { ApplicationStatus } from "@prisma/client/coop/index.js";
import { generateReferenceId } from "./generateReferenceId.js";

type UUID = string & { readonly __brand: "UUID" };
type CoopCategory = "primary" | "secondary" | "tertiary" | "special";
type FormOfRegistration = "none" | "consolidation" | "merger";
type CommonBond =
  | "associational"
  | "institutional"
  | "occupational"
  | "residential";
type AreaOfOperation =
  | "national"
  | "regional"
  | "inter-regional"
  | "provincial"
  | "city-municipality"
  | "barangay";
type AreaOfOperationRegion = { regCode: string; regDesc: string };

type CoopTypeListItem = {
  id: UUID;
  type: string;
};
type MergingConsolidationParentCoops = {
  coopId: UUID;
  id: UUID;
  name: string;
};
type IndustryClassification = {
  no: number;
  major: { id: number; description: string };
  sub: { id: number; description: string; baseVolBus: string };
};
type Purposes = {
  id: UUID;
  description: string;
};
type CompositionOfMembers = {
  id: UUID;
  name: string;
};

interface coopApplicationProps {
  cooperativeData: CooperativeApplication;
}

type PrimaryCooperativeApplication = {
  isAmendment: boolean;
  amendmentNo: string;

  // Category
  registrationId: string;
  consolidatingCoops: MergingConsolidationParentCoops[] | [];
  coopTypeList: CoopTypeListItem[] | [];
  cooperativeCategory: CoopCategory;
  cooperativeTypeId: string; // connect to cooperativeType
  formOfRegistration: FormOfRegistration;
  isSubsidiaryCooperative: boolean;
  mergingCoops: MergingConsolidationParentCoops[] | [];
  parentCoop: MergingConsolidationParentCoops | null;

  // ---------------------------------------------------

  // AOC
  allowCustomName: boolean;

  // AreaOfOperation
  areaOfOperation: AreaOfOperation;
  areaOfOperationRegions: AreaOfOperationRegion[] | [];

  isYouthCooperative: boolean;
  isGuardianCooperative: boolean;

  industryClassification: IndustryClassification[] | [];
  cooperativeName: string;
  coopNamePrefix: string;

  cooperativeNameAcronym: string;
  isBspRegistered?: boolean;
  regularAndAssociate: "1" | "2";

  // Address
  regCode: string;
  provCode: string;
  citymunCode: string;
  brgyCode: string;
  townDistrict: string;
  zipCode: string;
  streetName: string;
  subdivisionVillageZone: string;
  unitRoomFloorBuilding: string;
  lotBlockPhaseHouseNo: string;

  purposes: Purposes[] | [];
  termOfExistence: number;
  chairperson: string;
  commonBondOfMembership: CommonBond;
  fieldOfMembership: string;

  // Association/Institution
  nameOfAssociation: string[];
  nameOfInstitution: string[];

  // CompositionOfMembers
  compositionOfMembers: CompositionOfMembers | [];

  // Cooperators/Members
  cooperatorList: [];
  cooperators: [];
  members: [];

  // Total Number of Members
  totalNoOfRegularMembers: number;
  totalNoOfAssociateMembers: number;
  totalNoOfMaleMembers: number;
  totalNoOfFemaleMembers: number;
  totalNoOfMembers: number;

  majorityMembersLocation: string;
  bodPerDiem: [];
  qualificationPeriodYears: number;
  totalFeeContributions: number;
  boardOfDirectors: [];
  electedAndQualifiedWithin: number;

  totalShares: number;
  shareParValue: number;

  // Common Shares
  commonShares: number;
  commonShareParValue: number;

  // Preferred Shares
  preferredShares: number;
  preferredShareParValue: number;

  // Capitalization
  totalAuthorizedShareCapital: number;
  totalSubscribedCapital: number;
  totalPaidUpCapital: number;
  paidUpShareCommon: [];
  paidUpSharePreferred: [];
  totalRestrictedCapital: number;

  // Regular Members
  regularMinimumSubscribed: number;
  regularMinimumPaidUp: number;
  regularMembersQualifications: string[];
  regularMinSubscribedShares: number;
  regularMinPaidShares: number;

  // Associate Members
  associateMinimumSubscribed: number;
  associateMinimumPaidUp: number;
  associateMembersQualifications: string[];
  associateMinSubscribedShares: number;
  associateMinPaidShares: number;

  memberSubscriberShares: [];
  minimumShareSubscribed: number;
  minimumSharePaidUp: number;

  assignedTreasurer: string;
  requirementsForMembership: [];
  membershipApplicationProcessingDays: number;
  membershipFee: number;

  membersEntitledToVote: [];
  delegatedPower: [];
  generalAssemblyPowers: [];
  generalAssemblyMeeting: string;
  quorumPercentage: number;
  boardOfDirectorsCount: number;
  cooperatorsCount: number;

  // Primary Cooperators
  numberOfMaleCooperators: number;
  numberOfFemaleCooperators: number;
  numberOfMaleBod: number;
  numberOfFemaleBod: number;

  maxConsecutiveAbsences: number;
  maxPercentageAbsences: number;
  electionTermLength: number;

  // Capital Build
  capitalBuildMonthlyAmount: number;
  capitalBuildAnnualInterest: number;
  capitalBuildTransaction: number;

  // Percentage
  reserveFundPercentage: number;
  educationAndTrainingFundPercentage: number;
  communityDevelopmentFundPercentage: number;
  optionalFundPercentage: number;

  votingRights: string;

  // Committees
  noOfAuditCommittee: number;
  noOfElectionCommittee: number; // Int? // Union
  noOfEducAndTrainingCommittee: number; // Int? // Union
  noOfMedConCommittee: number; // Int? // Union
  noOfEthicsCommittee: number;

  bodElection: string;
  termOfOffice: number;
  directorsTerm: number;
  applicationStatus?: ApplicationStatus;
  // status: string;
  isApproved?: boolean;
  isDraft?: boolean;
  // version: string;
  // isMainOffice: boolean;
  // transferRegionCode: string;
  migrated?: number;
};

type CooperativeApplication = {
  isAmendment: boolean;
  amendmentNo: string;

  // Category
  registrationId: string;
  consolidatingCoops: MergingConsolidationParentCoops[] | [];
  coopTypeList: CoopTypeListItem[] | [];
  cooperativeCategory: CoopCategory;
  cooperativeTypeId: string; // connect to cooperativeType
  formOfRegistration: FormOfRegistration;
  isSubsidiaryCooperative: boolean;
  mergingCoops: MergingConsolidationParentCoops[] | [];
  parentCoop: MergingConsolidationParentCoops | null;

  // ---------------------------------------------------

  isYouthCooperative: boolean;
  isGuardianCooperative: boolean;

  industryClassification: IndustryClassification[] | [];
  cooperativeName: string;
  coopNamePrefix: string;
  allowCustomName: boolean;
  cooperativeNameAcronym: string;
  isBspRegistered?: boolean;
  regularAndAssociate: "1" | "2";

  // Address
  regCode: string;
  provCode: string;
  citymunCode: string;
  brgyCode: string;
  townDistrict: string;
  zipCode: string;
  streetName: string;
  subdivisionVillageZone: string;
  unitRoomFloorBuilding: string;
  lotBlockPhaseHouseNo: string;

  purposes: Purposes[] | [];
  termOfExistence: number;
  chairperson: string;
  commonBondOfMembership: CommonBond;
  fieldOfMembership: string;

  // Association/Institution
  nameOfAssociation: string[];
  nameOfInstitution: string[];

  // CompositionOfMembers
  compositionOfMembers: CompositionOfMembers | [];

  // AreaOfOperation
  areaOfOperation: AreaOfOperation;
  areaOfOperationRegions: AreaOfOperationRegion[] | [];

  // Cooperators/Members
  cooperatorList: [];
  cooperators: [];
  members: [];

  // Total Number of Members
  totalNoOfRegularMembers: number;
  totalNoOfAssociateMembers: number;
  totalNoOfMaleMembers: number;
  totalNoOfFemaleMembers: number;
  totalNoOfMembers: number;

  majorityMembersLocation: string;
  bodPerDiem: [];
  qualificationPeriodYears: number;
  totalFeeContributions: number;
  boardOfDirectors: [];
  electedAndQualifiedWithin: number;

  totalShares: number;
  shareParValue: number;

  // Common Shares
  commonShares: number;
  commonShareParValue: number;

  // Preferred Shares
  preferredShares: number;
  preferredShareParValue: number;

  // Capitalization
  totalAuthorizedShareCapital: number;
  totalSubscribedCapital: number;
  totalPaidUpCapital: number;
  paidUpShareCommon: [];
  paidUpSharePreferred: [];
  totalRestrictedCapital: number;

  // Regular Members
  regularMinimumSubscribed: number;
  regularMinimumPaidUp: number;
  regularMembersQualifications: string[];
  regularMinSubscribedShares: number;
  regularMinPaidShares: number;

  // Associate Members
  associateMinimumSubscribed: number;
  associateMinimumPaidUp: number;
  associateMembersQualifications: string[];
  associateMinSubscribedShares: number;
  associateMinPaidShares: number;

  memberSubscriberShares: [];
  minimumShareSubscribed: number;
  minimumSharePaidUp: number;

  assignedTreasurer: string;
  requirementsForMembership: [];
  membershipApplicationProcessingDays: number;
  membershipFee: number;

  membersEntitledToVote: [];
  delegatedPower: [];
  generalAssemblyPowers: [];
  generalAssemblyMeeting: string;
  quorumPercentage: number;
  boardOfDirectorsCount: number;
  cooperatorsCount: number;

  // Primary Cooperators
  numberOfMaleCooperators: number;
  numberOfFemaleCooperators: number;
  numberOfMaleBod: number;
  numberOfFemaleBod: number;

  maxConsecutiveAbsences: number;
  maxPercentageAbsences: number;
  electionTermLength: number;

  // Capital Build
  capitalBuildMonthlyAmount: number;
  capitalBuildAnnualInterest: number;
  capitalBuildTransaction: number;

  // Percentage
  reserveFundPercentage: number;
  educationAndTrainingFundPercentage: number;
  communityDevelopmentFundPercentage: number;
  optionalFundPercentage: number;

  votingRights: string;

  // Committees
  noOfAuditCommittee: number;
  noOfElectionCommittee: number; // Int? // Union
  noOfEducAndTrainingCommittee: number; // Int? // Union
  noOfMedConCommittee: number; // Int? // Union
  noOfEthicsCommittee: number;

  bodElection: string;
  termOfOffice: number;
  directorsTerm: number;

  applicationStatus?: ApplicationStatus;
  // status: string;
  isApproved?: boolean;
  isDraft?: boolean;
  // version: string;
  // isMainOffice: boolean;
  // transferRegionCode: string;
  migrated?: number;
};

export function createCooperativeApplication({
  cooperativeData,
}: coopApplicationProps): CooperativeApplication {
  const newRegRefId = generateReferenceId();

  const application: CooperativeApplication = {
    //   cooperativeOrgId            //  String?
    //   cooperativeOrg              //  CooperativeOrg? @relation(name: "OrgApplications", fields: [cooperativeOrgId], references: [id])
    //   amendmentOrg                // CooperativeOrg? @relation(name: "OrgAmendmentApplication")
    //   amendmentType               //  String? // aoc, by-laws, or aoc-by-laws
    //   approvedByOrg              //   CooperativeOrg? @relation(name: "OrgApprovedApplication")

    registrationId: newRegRefId, //  String?         @unique
    //   applicationType: "",            //  String?
    //   leve: "",                       //  String?
    isAmendment: cooperativeData.isAmendment, //  Boolean?        @default(false)
    amendmentNo: cooperativeData.amendmentNo, //  Int?
    // isConsolidation: false, //  Boolean? open
    //   primaryRepresentative       //  String?
    //   secondaryRepresentative     //  String?
    isSubsidiaryCooperative: cooperativeData.isSubsidiaryCooperative, //  Boolean? @default(false)
    isYouthCooperative: false, //  Boolean? @default(false)
    isGuardianCooperative: false, //  Boolean? @default(false)

    //   validationTool    // ValidationTool? @relation("ValidationByRegistration")

    //   validator_question_id     // String? // foreign key
    //   validatorQuestion     // ValidatorQuestion? @relation(fields: [validator_question_id], references: [id])

    cooperativeCategory: cooperativeData.cooperativeCategory, // String? // primary, secondary, tertiary, special
    cooperativeTypeId: cooperativeData.cooperativeTypeId, // String? // Foreign key to TypeCooperative
    // cooperativeType: "", // TypeCooperative?          @relation(fields: [cooperativeTypeId], references: [id])
    coopTypeList: cooperativeData.coopTypeList, //  Json?  // List of Cooperative Types for (Multipurpose)
    formOfRegistration: "none", // String? @default("none") // none, consolidation or merger
    parentCoop: null, // Json? // Parent Coop if Subsidiary Coop Registration
    consolidatingCoops: cooperativeData.consolidatingCoops, // Json? // Coops for Consolidation
    mergingCoops: cooperativeData.mergingCoops, // Json? // Coops for Merging
    industryClassification: cooperativeData.industryClassification, // Json?
    cooperativeName: cooperativeData.cooperativeName, // String?
    coopNamePrefix: cooperativeData.coopNamePrefix, // String?
    allowCustomName: true, // Boolean? @default(false)
    cooperativeNameAcronym: cooperativeData.cooperativeNameAcronym, // String?
    // reservedCoopName       ReservedCooperativeName[]
    isBspRegistered: cooperativeData.isBspRegistered, // Boolean?  // false

    regularAndAssociate: cooperativeData.regularAndAssociate, // String? // 1 = Regular, 2 = Regular and Associate

    regCode: cooperativeData.regCode, // String?
    // region: "", // Regions?                  @relation(fields: [regCode], references: [regCode])

    provCode: cooperativeData.provCode, // String?
    // province: "", // Province? @relation(fields: [provCode], references: [provCode])

    citymunCode: cooperativeData.citymunCode, //String?
    // cityMunicipality: "", // CityMunicipality? @relation(fields: [citymunCode], references: [citymunCode])

    brgyCode: cooperativeData.brgyCode, // String?
    // barangay: "", // Barangays? @relation(fields: [brgyCode], references: [brgyCode])

    townDistrict: cooperativeData.townDistrict, //  String?
    zipCode: cooperativeData.zipCode, // String?
    streetName: cooperativeData.streetName, // String?
    subdivisionVillageZone: cooperativeData.subdivisionVillageZone, //String?
    unitRoomFloorBuilding: cooperativeData.unitRoomFloorBuilding, //String?
    lotBlockPhaseHouseNo: cooperativeData.lotBlockPhaseHouseNo, //String?

    // fedEngagedIn: "", // String? // Not used anymore
    purposes: cooperativeData.purposes, // Json?
    // federationPurposes: "", //Json?  // Not used anymore

    termOfExistence: cooperativeData.termOfExistence, // Int? @default(50)

    // chairmanOfBoard: "", // String? // not used
    chairperson: cooperativeData.chairperson, //  String?
    commonBondOfMembership: cooperativeData.commonBondOfMembership, // String? // associational, institutional, occupational, or residential
    fieldOfMembership: cooperativeData.fieldOfMembership, // String?
    nameOfAssociation: cooperativeData.nameOfAssociation, // Json?
    nameOfInstitution: [], // Json?
    compositionOfMembers: cooperativeData.compositionOfMembers, // Json?
    areaOfOperation: cooperativeData.areaOfOperation, // String? //
    areaOfOperationRegions: cooperativeData.areaOfOperationRegions, // Json?
    cooperatorList: cooperativeData.cooperatorList, // Json? // For Secondary and Tertiary Coops
    cooperators: cooperativeData.cooperators, // Json? // For Primary
    members: cooperativeData.members, // Json? // Additional members in Primary excluding cooperators

    totalNoOfRegularMembers: cooperativeData.totalNoOfRegularMembers, // Int?
    totalNoOfAssociateMembers: cooperativeData.totalNoOfAssociateMembers, // Int?
    totalNoOfMaleMembers: cooperativeData.totalNoOfMaleMembers, // Int?
    totalNoOfFemaleMembers: cooperativeData.totalNoOfFemaleMembers, // Int?
    totalNoOfMembers: cooperativeData.totalNoOfMembers, // Int?
    // totalNoOfCommittees     Int?

    // fedCooperators: "", // Json?
    majorityMembersLocation: cooperativeData.majorityMembersLocation, // String? // Cooperative Bank
    bodPerDiem: cooperativeData.bodPerDiem, // Json? // Cooperative Bank
    qualificationPeriodYears: cooperativeData.qualificationPeriodYears, //Int? // Cooperative Bank

    totalFeeContributions: cooperativeData.totalFeeContributions, // 0 // Int?
    boardOfDirectors: cooperativeData.boardOfDirectors, // [] // Json?
    electedAndQualifiedWithin: cooperativeData.electedAndQualifiedWithin, // 0 // Int?
    totalAuthorizedShareCapital: cooperativeData.totalAuthorizedShareCapital, // 0 // Int?

    totalShares: cooperativeData.totalShares, // 0 // Int?
    shareParValue: cooperativeData.shareParValue, // 0 // Int?

    // hasPreferredShare: "", //Boolean? // this was removed
    preferredShares: cooperativeData.preferredShares, // 0 //Int?
    preferredShareParValue: cooperativeData.preferredShareParValue, // 0 //Int?
    commonShares: cooperativeData.commonShares, // 0 //Int?
    commonShareParValue: cooperativeData.commonShareParValue, // 0 //Int?
    totalSubscribedCapital: cooperativeData.totalSubscribedCapital, // 0 //Int?
    totalPaidUpCapital: cooperativeData.totalPaidUpCapital, // 0 //Int?
    paidUpShareCommon: cooperativeData.paidUpShareCommon, // [] // Json?
    paidUpSharePreferred: cooperativeData.paidUpSharePreferred, // [] // Json?
    totalRestrictedCapital: cooperativeData.totalRestrictedCapital, // 0 //  Int? // for Credit Surety Fund

    regularMinimumSubscribed: cooperativeData.regularMinimumSubscribed, // 0 // Int?
    regularMinimumPaidUp: cooperativeData.regularMinimumPaidUp, // 0 // Int?
    associateMinimumSubscribed: cooperativeData.associateMinimumSubscribed, // 0 // Int?
    associateMinimumPaidUp: cooperativeData.associateMinimumPaidUp, // 0 // Int?

    memberSubscriberShares: cooperativeData.memberSubscriberShares, // [] // Json?

    minimumShareSubscribed: cooperativeData.minimumShareSubscribed, // 0 // Int? // Federation
    minimumSharePaidUp: cooperativeData.minimumSharePaidUp, // 0 // Int? // Federation

    assignedTreasurer: cooperativeData.assignedTreasurer, // "" // String? // Primary, Federation, Union
    regularMembersQualifications: cooperativeData.regularMembersQualifications, // [] // Json? // Primary
    associateMembersQualifications:
      cooperativeData.associateMembersQualifications, // [] // Json? // Primary
    requirementsForMembership: cooperativeData.requirementsForMembership, // [] // Json? // Primary, Union
    membershipApplicationProcessingDays:
      cooperativeData.membershipApplicationProcessingDays, // 0 // Int? // Primary and Union
    membershipFee: cooperativeData.membershipFee, // 0 // Int? // Primary and Union
    regularMinSubscribedShares: cooperativeData.regularMinSubscribedShares, // 0 // Int? // Primary
    regularMinPaidShares: cooperativeData.regularMinPaidShares, // 0 // Int? // Primary
    associateMinSubscribedShares: cooperativeData.associateMinSubscribedShares, // 0 // Int? // Primary
    associateMinPaidShares: cooperativeData.associateMinPaidShares, // 0 // Int? // Primary
    membersEntitledToVote: cooperativeData.membersEntitledToVote, // [] // Json?
    delegatedPower: cooperativeData.delegatedPower, // [] // Json?
    generalAssemblyPowers: cooperativeData.generalAssemblyPowers, // [] // Json?
    // generalAssemblyMeetingDate          DateTime? // This must be Month and Day only and not a DateTime
    generalAssemblyMeeting: cooperativeData.generalAssemblyMeeting, // "" //  String?

    quorumPercentage: cooperativeData.quorumPercentage, // 0 // Int? // Primary and Union
    boardOfDirectorsCount: cooperativeData.boardOfDirectorsCount, // 0 //  Int? // Primary
    cooperatorsCount: cooperativeData.cooperatorsCount, // 0 // Int? // Primary
    numberOfMaleCooperators: cooperativeData.numberOfMaleCooperators, // 0 //  Int? // Primary
    numberOfFemaleCooperators: cooperativeData.numberOfFemaleCooperators, // 0 //  Int? // Primary
    numberOfMaleBod: cooperativeData.numberOfMaleBod, // 0 //  Int? // Primary
    numberOfFemaleBod: cooperativeData.numberOfFemaleBod, // 0 //  Int? // Primary
    maxConsecutiveAbsences: cooperativeData.maxConsecutiveAbsences, // 0 //  Int?
    maxPercentageAbsences: cooperativeData.maxPercentageAbsences, // 0 //  Int?
    electionTermLength: cooperativeData.electionTermLength, // 0 //  Int?
    capitalBuildMonthlyAmount: cooperativeData.capitalBuildMonthlyAmount, // 0 //  Int?
    capitalBuildAnnualInterest: cooperativeData.capitalBuildAnnualInterest, // 0 //  Int?

    capitalBuildTransaction: cooperativeData.capitalBuildTransaction, //  0 //  Int?
    reserveFundPercentage: cooperativeData.reserveFundPercentage, //  0 //  Int?
    educationAndTrainingFundPercentage:
      cooperativeData.educationAndTrainingFundPercentage, //  0 // Int?
    communityDevelopmentFundPercentage:
      cooperativeData.communityDevelopmentFundPercentage, //  0 // Int?
    optionalFundPercentage: cooperativeData.optionalFundPercentage, //  0 // Int?
    votingRights: cooperativeData.votingRights, // "" //  String?
    // byLaws: "", //  Json?
    // economicSurvey                     Json?
    // treasurerAffidavit: "", //  Json?
    // documentaryRequirements: "", //  Json?
    // otherDocumentaryRequirements: "", //  Json?
    // suretyBondFileUrl              : "",  //  String? // Cloud Storage file URL or key
    // prsCertificate            : "",       //  String? // Cloud Storage file URL or key

    // economicSurvey: "", // CooperativeEconomicSurvey? // Only Primary Coops and CSF have Economic Survey

    // articlesOfCooperativeFileUrl: "", //String? // Cloud Storage file URL or key
    // byLawsFileUrl: "", // String? // Cloud Storage file URL or key
    // economicSurveyUrl: "", // String? // Cloud Storage file URL or key
    // treasurerAffidavitFileUrl: "", // String? // Cloud Storage file URL or key

    // certOfRegFileUrl: "", // String? // Cloud Storage file URL or key
    // certOfComplianceFileUrl: "", // String? // Cloud Storage file URL or key

    noOfAuditCommittee: cooperativeData.noOfAuditCommittee, // 0 // Int? // Union
    noOfElectionCommittee: cooperativeData.noOfElectionCommittee, // 0 // Int? // Union
    noOfEducAndTrainingCommittee: cooperativeData.noOfEducAndTrainingCommittee, // 0 // Int? // Union
    noOfMedConCommittee: cooperativeData.noOfMedConCommittee, // 0 // Int? // Union
    noOfEthicsCommittee: cooperativeData.noOfEthicsCommittee, // 0 // Int? // Union

    bodElection: cooperativeData.bodElection, // ""  // String?
    termOfOffice: cooperativeData.termOfOffice, //  0  //    Int? // Union
    directorsTerm: cooperativeData.directorsTerm, //  0  // Int? // Union

    // Economic Survey
    // projectedMembershipIncrease: "", //Json?
    // sourcesOfFunds: "", //Json?
    // savingMobilization: "", // Json?
    // revolvingCapital: "", // Boolean?
    // typeAndNature: "", // Json?
    // targetSegment: "", // Json?
    // managementAndStaffing: "", // Json?
    // capitalRequirements: "", // Json?
    // logistics: "", // Json?
    // legalDocumentsAndSystem: "", // Json?
    // businessOperationAddress: "", // String?

    // -----------------------------------------------------

    // economicAspect: "", // Json? // Credit Surety Fund
    // financialAspect: "", // Json? // Credit Surety Fund
    // technicalAspect: "", //Json? // Credit Surety Fund

    // ----------------------------------

    // application_review_days // none usage

    // --------------------------------------------------------------------------------------------

    // firstEvaluatedBy: "", // String?
    // secondEvaluatedBy: "", // String?
    // thirdEvaluatedBy: "", // String?

    // firstEvaluatorStatus: "", //EvaluatorStatus?
    // secondEvaluatorStatus: "", //EvaluatorStatus?
    // thirdEvaluatorStatus: "", //EvaluatorStatus?

    // aocHardCopyStatus: "", //EvaluatorStatus?
    // byLawsHardCopyStatus: "", //EvaluatorStatus?
    // econSurveyhardCopyStatus: "", //EvaluatorStatus?
    // treasurerAffHardCopyStatus: "", //EvaluatorStatus?

    // hardCopyValidationStatus: "", //EvaluatorStatus?

    // validatorRemarks        Json?
    // seniorCdsRemarks: "", //Json?
    // regionalDirectorRemarks: "", //Json?

    applicationStatus: ApplicationStatus.APPROVED, // ApplicationStatus? @default(IN_PROGRESS)

    // status: "", //Status?

    isApproved: true, // Boolean? @default(false)
    isDraft: false, // Boolean? @default(true)
    //   isDetailsComplete    // Boolean? @default(false)
    //   isAocComplete        // Boolean? @default(false)
    //   isByLawsComplete     // Boolean? @default(false)
    //   isEconSurveyComplete // Boolean? @default(false)

    // expiresAt: "", // DateTime?
    // createdBy: "", // String?
    // updatedBy: "", // String?
    // date_of_cor: "", // DateTime?
    // registrationNo: "", // String? @unique
    //   created_at  // DateTime? @default(now())
    //   updated_at  // DateTime? @updatedAt
    //   archived_at // DateTime?
    //   deleted_at  // DateTime?
    //   closed_at   // DateTime?
    //   audit_logs  // Json?

    // validatorId: "", // String?
    // addressCoordinates: "", // Json?
    // version: "", // String   @default("1")

    // isMainOffice: false, // Boolean? @default(false)
    // transferRegionCode: "", //  String?

    // cooperators Cooperator[]

    migrated: 1, // Int? @default(0) // 1 = migrated, 0 = not from migration
  };

  return application;
}
