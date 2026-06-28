import { ApplicationStatus } from "@prisma/client/coop/index.js";
import { generateReferenceId } from "../utils/generateReferenceId.ts";

export type UUID = string & { readonly __brand: "UUID" };
export type TCoopCategory = "primary" | "secondary" | "tertiary" | "special";
type TFormOfRegistration = "none" | "consolidation" | "merger";
type TCommonBond =
  | "associational"
  | "institutional"
  | "occupational"
  | "residential";
export type TAreaOfOperation =
  | "national"
  | "regional"
  | "inter-regional"
  | "provincial"
  | "city-municipality"
  | "barangay"
  | string;
export type TAreaOfOperationRegion = { regCode: string; regDesc: string };

export type TCoopTypeListItem = {
  id: UUID;
  type: string;
};
type TMergingConsolidationParentCoops = {
  coopId: UUID;
  id: UUID;
  name: string;
};
type TCoopTypeConnectById = { connect: { id: string } };

type TIndustryClassification = {
  no: number;
  major: { id: number; description: string };
  sub: { id: number; description: string; baseVolBus: string };
};
type TPurposes = {
  id: UUID;
  description: string;
};
export type TCompositionOfMembers = {
  id: UUID;
  name: string;
};

export type Capitalization = {
  totalAuthorizedShareCapital: number;
  totalSubscribedShareCapital: number;
  totalPaidUpShareCapital: number;
};

export type CoopApplication = {
  isAmendment?: boolean;
  amendmentNo?: number | null;

  // // Category
  registrationId: string;
  consolidatingCoops: TMergingConsolidationParentCoops[] | [];
  coopTypeList: TCoopTypeListItem[] | [];
  cooperativeCategory: TCoopCategory;
  // cooperativeTypeId: string; // connect to cooperativeType
  cooperativeType?: TCoopTypeConnectById; // connect to cooperativeType
  formOfRegistration: TFormOfRegistration;
  isSubsidiaryCooperative: boolean;
  mergingCoops: TMergingConsolidationParentCoops[] | [];
  parentCoop?: TMergingConsolidationParentCoops;

  // ---------------------------------------------------

  isGuardianCooperative: boolean;
  isYouthCooperative: boolean;

  cooperativeName: string;
  coopNamePrefix: string;
  allowCustomName: boolean;

  // AreaOfOperation
  areaOfOperation: TAreaOfOperation | string;
  areaOfOperationRegions: TAreaOfOperationRegion[] | [];

  cooperativeNameAcronym: string;
  //-- isBspRegistered?: boolean;
  //-- regularAndAssociate: "1" | "2";

  // Address
  region?: {
    connect: {
      regCode: string;
    };
  };
  province?: {
    connect: {
      provCode: string;
    };
  };
  cityMunicipality?: {
    connect: {
      citymunCode: string;
    };
  };
  barangay?: {
    connect: {
      brgyCode: string;
    };
  };
  //-- townDistrict: string;
  //-- zipCode: string;
  //-- subdivisionVillageZone: string;
  //-- unitRoomFloorBuilding: string;
  //-- lotBlockPhaseHouseNo: string;
  streetName: string;

  //-- purposes: Purposes[] | [];
  //-- termOfExistence: number;
  //-- chairperson: string;
  commonBondOfMembership: TCommonBond;

  fieldOfMembership: string;

  // CompositionOfMembers
  // compositionOfMembers: TCompositionOfMembers[] | [];

  // industryClassification: TIndustryClassification[] | [];

  // Association/Institution
  // nameOfAssociation: string[];
  //-- nameOfInstitution: string[];

  // Cooperators/Members
  //-- cooperatorList: [];
  //-- cooperators: [];
  //-- members: [];

  // Total Number of Members
  //-- totalNoOfRegularMembers: number;
  //-- totalNoOfAssociateMembers: number;
  //-- totalNoOfMaleMembers: number;
  //-- totalNoOfFemaleMembers: number;
  //-- totalNoOfMembers: number;

  //-- majorityMembersLocation: string;
  //-- bodPerDiem: [];
  //-- qualificationPeriodYears: number;
  //-- totalFeeContributions: number;
  //-- boardOfDirectors: [];
  //-- electedAndQualifiedWithin: number;

  //-- totalShares: number;
  //-- shareParValue: number;

  // Common Shares
  //-- commonShares: number;
  //-- commonShareParValue: number;

  // Preferred Shares
  //-- preferredShares: number;
  //-- preferredShareParValue: number;

  // Capitalization
  //-- totalAuthorizedShareCapital: number;
  //-- totalSubscribedCapital: number;
  //-- totalPaidUpCapital: number;
  //-- paidUpShareCommon: [];
  //-- paidUpSharePreferred: [];
  //-- totalRestrictedCapital: number;

  // Regular Members
  //-- regularMinimumSubscribed: number;
  //-- regularMinimumPaidUp: number;
  //-- regularMembersQualifications: string[];
  //-- regularMinSubscribedShares: number;
  //-- regularMinPaidShares: number;

  // Associate Members
  //-- associateMinimumSubscribed: number;
  //-- associateMinimumPaidUp: number;
  //-- associateMembersQualifications: string[];
  //-- associateMinSubscribedShares: number;
  //-- associateMinPaidShares: number;

  //-- memberSubscriberShares: [];
  //-- minimumShareSubscribed: number;
  //-- minimumSharePaidUp: number;

  //-- assignedTreasurer: string;
  //-- requirementsForMembership: [];
  //-- membershipApplicationProcessingDays: number;
  //-- membershipFee: number;

  //-- membersEntitledToVote: [];
  //-- delegatedPower: [];
  //-- generalAssemblyPowers: [];
  //-- generalAssemblyMeeting: string;
  //-- quorumPercentage: number;
  //-- boardOfDirectorsCount: number;
  //-- cooperatorsCount: number;

  // Primary Cooperators
  //-- numberOfMaleCooperators: number;
  //-- numberOfFemaleCooperators: number;
  //-- numberOfMaleBod: number;
  //-- numberOfFemaleBod: number;

  //-- maxConsecutiveAbsences: number;
  //-- maxPercentageAbsences: number;
  //-- electionTermLength: number;

  // Capital Build
  //-- capitalBuildMonthlyAmount: number;
  //-- capitalBuildAnnualInterest: number;
  //-- capitalBuildTransaction: number;

  // Percentage
  //-- reserveFundPercentage: number;
  //-- educationAndTrainingFundPercentage: number;
  //-- communityDevelopmentFundPercentage: number;
  //-- optionalFundPercentage: number;

  //-- votingRights: string;

  // Committees
  //-- noOfAuditCommittee: number;
  //-- noOfElectionCommittee: number; // Int? // Union
  //-- noOfEducAndTrainingCommittee: number; // Int? // Union
  //-- noOfMedConCommittee: number; // Int? // Union
  //-- noOfEthicsCommittee: number;

  //-- bodElection: string;
  //--  termOfOffice: number;
  //--  directorsTerm: number;

  applicationStatus?: ApplicationStatus;
  // status: string;
  isApproved?: boolean;
  isDraft?: boolean;
  // version: string;
  // isMainOffice: boolean;
  // transferRegionCode: string;
  migrated?: number;
};

export type User = {};
