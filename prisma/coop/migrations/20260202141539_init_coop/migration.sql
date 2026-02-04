-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('APPROVED', 'IN_PROGRESS', 'PENDING', 'DEFERRED', 'DENIED', 'IN_REVIEW');

-- CreateEnum
CREATE TYPE "BranchSatelliteType" AS ENUM ('BRANCH', 'SATELLITE');

-- CreateEnum
CREATE TYPE "CtcApplicationType" AS ENUM ('TRANSFER', 'CONVERSION', 'CLOSURE');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('FOR_VALIDATION', 'FOR_REVIEW', 'FOR_APPROVAL', 'FOR_PAYMENT', 'FOR_RELEASING', 'FOR_ASSIGNING', 'FOR_SUBMISSION', 'FOR_DENY', 'FOR_RECOMPLIANCE', 'FOR_DEFERRED', 'FOR_APPEAL', 'DEFERRED', 'DENIED');

-- CreateEnum
CREATE TYPE "EvaluatorStatus" AS ENUM ('APPROVE', 'CORRECTION', 'REJECT');

-- CreateEnum
CREATE TYPE "AccountApplicationStatus" AS ENUM ('APPROVE', 'DENY', 'PENDING');

-- CreateEnum
CREATE TYPE "CooperativeDocumentType" AS ENUM ('AOC', 'BYLAWS', 'ECONOMIC_SURVEY', 'TREASURER_AFFIDAVIT');

-- CreateEnum
CREATE TYPE "EconomicSurveyType" AS ENUM ('PRIMARY', 'CSF');

-- CreateTable
CREATE TABLE "CooperativeOrg" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "date_of_cor" TIMESTAMP(3),
    "audit_logs" JSONB,
    "approvedCooperativeId" TEXT,
    "draftRegId" TEXT DEFAULT '',
    "parentCooperatives" JSONB,
    "ownedBy" TEXT,
    "alternateRepId" TEXT,
    "primaryRepId" TEXT,
    "amendmentApplicationId" TEXT,
    "amendmentCount" INTEGER DEFAULT 0,
    "alternate_contact_number" TEXT,
    "alternate_email" TEXT,
    "contact_number" TEXT,
    "isCompliant" BOOLEAN,
    "regNo" TEXT,
    "cooperativeName" TEXT,
    "complianceCategoryId" INTEGER,
    "complianceStatusId" INTEGER,
    "complianceTypeId" INTEGER,
    "migrated" INTEGER DEFAULT 0,
    "prevComplianceRemarks" TEXT,
    "acronym" TEXT,
    "dateOfRegistration" TIMESTAMP(3),
    "recentAmendmentDate" TIMESTAMP(3),

    CONSTRAINT "CooperativeOrg_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cooperatives" (
    "id" TEXT NOT NULL,
    "cooperativeOrgId" TEXT,
    "registrationId" TEXT,
    "applicationType" TEXT,
    "level" TEXT,
    "isAmendment" BOOLEAN DEFAULT false,
    "isConsolidation" BOOLEAN,
    "isYouthCooperative" BOOLEAN DEFAULT false,
    "isGuardianCooperative" BOOLEAN DEFAULT false,
    "regularAndAssociate" TEXT,
    "regularMemberQualifications" JSONB,
    "associateMemberQualifications" JSONB,
    "validator_question_id" TEXT,
    "cooperativeCategory" TEXT,
    "cooperativeTypeId" TEXT,
    "industryClassification" JSONB,
    "cooperativeName" TEXT,
    "coopNamePrefix" TEXT,
    "allowCustomName" BOOLEAN DEFAULT false,
    "cooperativeNameAcronym" TEXT,
    "regCode" TEXT,
    "provCode" TEXT,
    "citymunCode" TEXT,
    "brgyCode" TEXT,
    "townDistrict" TEXT,
    "zipCode" TEXT,
    "streetName" TEXT,
    "subdivisionVillageZone" TEXT,
    "unitRoomFloorBuilding" TEXT,
    "lotBlockPhaseHouseNo" TEXT,
    "fedEngagedIn" TEXT,
    "purposes" JSONB,
    "federationPurposes" JSONB,
    "termOfExistence" INTEGER DEFAULT 50,
    "chairmanOfBoard" TEXT,
    "commonBondOfMembership" TEXT,
    "fieldOfMembership" TEXT,
    "nameOfAssociation" JSONB,
    "nameOfInstitution" JSONB,
    "compositionOfMembers" JSONB,
    "areaOfOperation" TEXT,
    "areaOfOperationRegions" JSONB,
    "cooperatorList" JSONB,
    "cooperators" JSONB,
    "fedCooperators" JSONB,
    "totalFeeContributions" INTEGER,
    "boardOfDirectors" JSONB,
    "totalAuthorizedShareCapital" INTEGER,
    "totalShares" INTEGER,
    "shareParValue" INTEGER,
    "hasPreferredShare" BOOLEAN,
    "preferredShares" INTEGER,
    "preferredShareParValue" INTEGER,
    "commonShares" INTEGER,
    "commonShareParValue" INTEGER,
    "totalSubscribedCapital" INTEGER,
    "totalPaidUpCapital" INTEGER,
    "paidUpShareCommon" JSONB,
    "paidUpSharePreferred" JSONB,
    "regularMinimumSubscribed" INTEGER,
    "regularMinimumPaidUp" INTEGER,
    "associateMinimumSubscribed" INTEGER,
    "associateMinimumPaidUp" INTEGER,
    "memberSubscriberShares" JSONB,
    "assignedTreasurer" TEXT,
    "regularMembersQualifications" JSONB,
    "associateMembersQualifications" JSONB,
    "requirementsForMembership" JSONB,
    "membershipApplicationProcessingDays" INTEGER,
    "membershipFee" INTEGER,
    "regularMinSubscribedShares" INTEGER,
    "regularMinPaidShares" INTEGER,
    "associateMinSubscribedShares" INTEGER,
    "associateMinPaidShares" INTEGER,
    "membersEntitledToVote" JSONB,
    "delegatedPower" JSONB,
    "generalAssemblyPowers" JSONB,
    "generalAssemblyMeeting" TEXT,
    "quorumPercentage" INTEGER,
    "boardOfDirectorsCount" INTEGER,
    "cooperatorsCount" INTEGER,
    "numberOfMaleCooperators" INTEGER,
    "numberOfFemaleCooperators" INTEGER,
    "numberOfMaleBod" INTEGER,
    "numberOfFemaleBod" INTEGER,
    "maxConsecutiveAbsences" INTEGER,
    "maxPercentageAbsences" INTEGER,
    "electionTermLength" INTEGER,
    "capitalBuildMonthlyAmount" INTEGER,
    "capitalBuildAnnualInterest" INTEGER,
    "capitalBuildTransaction" INTEGER,
    "reserveFundPercentage" INTEGER,
    "educationAndTrainingFundPercentage" INTEGER,
    "communityDevelopmentFundPercentage" INTEGER,
    "optionalFundPercentage" INTEGER,
    "votingRights" TEXT,
    "byLaws" JSONB,
    "treasurerAffidavit" JSONB,
    "documentaryRequirements" JSONB,
    "otherDocumentaryRequirements" JSONB,
    "suretyBondFileUrl" TEXT,
    "prsCertificate" TEXT,
    "articlesOfCooperativeFileUrl" TEXT,
    "byLawsFileUrl" TEXT,
    "economicSurveyUrl" TEXT,
    "treasurerAffidavitFileUrl" TEXT,
    "certOfRegFileUrl" TEXT,
    "certOfComplianceFileUrl" TEXT,
    "projectedMembershipIncrease" JSONB,
    "sourcesOfFunds" JSONB,
    "savingMobilization" JSONB,
    "revolvingCapital" BOOLEAN,
    "typeAndNature" JSONB,
    "targetSegment" JSONB,
    "managementAndStaffing" JSONB,
    "capitalRequirements" JSONB,
    "logistics" JSONB,
    "legalDocumentsAndSystem" JSONB,
    "businessOperationAddress" TEXT,
    "firstEvaluatedBy" TEXT,
    "secondEvaluatedBy" TEXT,
    "thirdEvaluatedBy" TEXT,
    "firstEvaluatorStatus" "EvaluatorStatus",
    "secondEvaluatorStatus" "EvaluatorStatus",
    "thirdEvaluatorStatus" "EvaluatorStatus",
    "aocHardCopyStatus" "EvaluatorStatus",
    "byLawsHardCopyStatus" "EvaluatorStatus",
    "econSurveyhardCopyStatus" "EvaluatorStatus",
    "treasurerAffHardCopyStatus" "EvaluatorStatus",
    "hardCopyValidationStatus" "EvaluatorStatus",
    "seniorCdsRemarks" JSONB,
    "regionalDirectorRemarks" JSONB,
    "applicationStatus" "ApplicationStatus" DEFAULT 'IN_PROGRESS',
    "status" "Status",
    "isApproved" BOOLEAN DEFAULT false,
    "isDraft" BOOLEAN DEFAULT true,
    "isDetailsComplete" BOOLEAN DEFAULT false,
    "isAocComplete" BOOLEAN DEFAULT false,
    "isByLawsComplete" BOOLEAN DEFAULT false,
    "isEconSurveyComplete" BOOLEAN DEFAULT false,
    "expiresAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "date_of_cor" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "archived_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "closed_at" TIMESTAMP(3),
    "audit_logs" JSONB,
    "validatorId" TEXT,
    "addressCoordinates" JSONB,
    "version" TEXT NOT NULL DEFAULT '1',
    "directorsTerm" INTEGER,
    "noOfAuditCommittee" INTEGER,
    "noOfEducAndTrainingCommittee" INTEGER,
    "noOfElectionCommittee" INTEGER,
    "noOfEthicsCommittee" INTEGER,
    "noOfMedConCommittee" INTEGER,
    "termOfOffice" INTEGER,
    "minimumSharePaidUp" INTEGER,
    "minimumShareSubscribed" INTEGER,
    "bodPerDiem" JSONB,
    "majorityMembersLocation" TEXT,
    "qualificationPeriodYears" INTEGER,
    "totalRestrictedCapital" INTEGER,
    "economicAspect" JSONB,
    "financialAspect" JSONB,
    "technicalAspect" JSONB,
    "bodElection" TEXT,
    "consolidatingCoops" JSONB,
    "formOfRegistration" TEXT DEFAULT 'none',
    "parentCoop" JSONB,
    "amendmentType" TEXT,
    "isMainOffice" BOOLEAN DEFAULT false,
    "transferRegionCode" TEXT,
    "members" JSONB,
    "coopTypeList" JSONB,
    "registrationNo" TEXT,
    "electedAndQualifiedWithin" INTEGER,
    "chairperson" TEXT,
    "totalNoOfFemaleMembers" INTEGER,
    "totalNoOfMaleMembers" INTEGER,
    "totalNoOfMembers" INTEGER,
    "totalNoOfAssociateMembers" INTEGER,
    "totalNoOfRegularMembers" INTEGER,
    "mergingCoops" JSONB,
    "isSubsidiaryCooperative" BOOLEAN DEFAULT false,
    "isBspRegistered" BOOLEAN,
    "amendmentNo" INTEGER,
    "migrated" INTEGER DEFAULT 0,

    CONSTRAINT "Cooperatives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Validation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Validation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComplianceStatus" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ComplianceStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComplianceCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "complianceStatusId" INTEGER,

    CONSTRAINT "ComplianceCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComplianceType" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "complianceCategoryId" INTEGER,

    CONSTRAINT "ComplianceType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Regions" (
    "id" TEXT NOT NULL,
    "psgcCode" TEXT NOT NULL,
    "regDesc" TEXT NOT NULL,
    "regCode" TEXT NOT NULL,
    "label" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "hasOffice" BOOLEAN DEFAULT false,

    CONSTRAINT "Regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Province" (
    "id" TEXT NOT NULL,
    "psgcCode" TEXT NOT NULL,
    "provDesc" TEXT NOT NULL,
    "regCode" TEXT NOT NULL,
    "provCode" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Province_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CityMunicipality" (
    "id" TEXT NOT NULL,
    "psgcCode" TEXT NOT NULL,
    "citymunDesc" TEXT NOT NULL,
    "regDesc" TEXT NOT NULL,
    "provCode" TEXT NOT NULL,
    "citymunCode" TEXT NOT NULL,
    "isCity" BOOLEAN,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "CityMunicipality_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Barangays" (
    "id" TEXT NOT NULL,
    "brgyCode" TEXT NOT NULL,
    "brgyDesc" TEXT NOT NULL,
    "regCode" TEXT NOT NULL,
    "provCode" TEXT NOT NULL,
    "citymunCode" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Barangays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TypesOfID" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "TypesOfID_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AreasOfOperation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "AreasOfOperation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryCooperatives" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "CategoryCooperatives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "ApplicationType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppRegistrationTypeFee" (
    "id" TEXT NOT NULL,
    "applicationTypeId" TEXT NOT NULL,
    "areaOfOperationId" TEXT NOT NULL,
    "fee" DOUBLE PRECISION NOT NULL,
    "coc_fee" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "AppRegistrationTypeFee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TypeCooperative" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT[],
    "isActive" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "TypeCooperative_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CooperativePurposes" (
    "id" TEXT NOT NULL,
    "purposes" JSONB,
    "category" TEXT,
    "coopTypeId" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "CooperativePurposes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentaryRequirements" (
    "id" TEXT NOT NULL,
    "forSubmission" JSONB,
    "coopTypeId" TEXT,
    "newRegUploadRequirements" JSONB,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),
    "amendmentUploadRequirements" JSONB,

    CONSTRAINT "DocumentaryRequirements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BondOfMembership" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "BondOfMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compositionOfMembership" (
    "id" TEXT NOT NULL,
    "code" INTEGER,
    "name" TEXT,
    "major_id" INTEGER,

    CONSTRAINT "compositionOfMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "majorIndustryClassifications" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "majorIndustryClassifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subIndustryClassifications" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "baseVolBus" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "subIndustryClassifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TypeCoopIndustryLink" (
    "id" SERIAL NOT NULL,
    "cooperativeTypeId" TEXT NOT NULL,
    "majorIndustryId" INTEGER NOT NULL,
    "subIndustryId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "TypeCoopIndustryLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ValidationTool" (
    "id" TEXT NOT NULL,
    "cooperativeRegistrationId" TEXT NOT NULL,
    "cooperativeProfileReasons" JSONB,
    "membership" JSONB,
    "organization" JSONB,
    "capitalAdequacy" JSONB,
    "economicAndBusiness" JSONB,
    "otherFindings" TEXT,
    "nameofKeyInformants" JSONB,
    "reasonsOrJustifications" TEXT,
    "evaluator" TEXT,

    CONSTRAINT "ValidationTool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BranchSatellite" (
    "id" TEXT NOT NULL,
    "registration_id" TEXT,
    "type" TEXT,
    "contactName" TEXT,
    "contactDesignation" TEXT,
    "contactNumber" TEXT,
    "contactEmail" TEXT,
    "cooperativeId" TEXT,
    "region_id" TEXT,
    "province_id" TEXT,
    "cityMun_id" TEXT,
    "barangay_id" TEXT,
    "zipCode" TEXT,
    "subdivisionVillageZone" TEXT,
    "unitRoomFloorBuilding" TEXT,
    "lotBlockPhaseHouseNo" TEXT,
    "term_condition" BOOLEAN NOT NULL DEFAULT true,
    "validator" TEXT,
    "senior_cds" TEXT,
    "director" TEXT,
    "status" TEXT,
    "applicationStatus" "ApplicationStatus" DEFAULT 'IN_PROGRESS',
    "isDraft" BOOLEAN NOT NULL DEFAULT true,
    "proposed_branch" TEXT,
    "financial" TEXT,
    "technical" TEXT,
    "legal" TEXT,
    "organization" TEXT,
    "manual_operation" TEXT,
    "businessPlan" TEXT,
    "GAResolution" TEXT,
    "CMA" TEXT,
    "COC" TEXT,
    "oathUndertaking" TEXT,
    "spaceWorkforceCert" TEXT,
    "letterApplication" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cooperativeOrgId" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "validator_id" TEXT,
    "version" TEXT NOT NULL DEFAULT '1',
    "closedAt" TIMESTAMP(3),
    "areaOfOperation" TEXT,
    "proposedAreaToServe" TEXT,
    "registeredAt" TIMESTAMP(3),
    "registrationNo" TEXT,
    "documents" JSONB,
    "streetName" TEXT,
    "townDistrict" TEXT,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "BranchSatellite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CtcApplication" (
    "id" TEXT NOT NULL,
    "referenceId" TEXT,
    "branchSatelliteId" TEXT,
    "applicationType" "CtcApplicationType" NOT NULL,
    "status" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "applicationStatus" "ApplicationStatus" DEFAULT 'IN_PROGRESS',
    "isDraft" BOOLEAN DEFAULT true,
    "version" TEXT NOT NULL DEFAULT '1',
    "validator_id" TEXT,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "CtcApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransferApplication" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "reason" TEXT,
    "documents" JSONB,
    "newTown" TEXT,
    "newZipCode" TEXT,
    "newStreet" TEXT,
    "newSubdivision" TEXT,
    "newUnitBldg" TEXT,
    "newLotBlock" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "newBarangayCode" TEXT,
    "newCityMunCode" TEXT,
    "newProvinceCode" TEXT,
    "newRegionCode" TEXT,
    "letterOfIntent" TEXT,
    "noticeOfTransfer" TEXT,

    CONSTRAINT "TransferApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversionApplication" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "convertFrom" TEXT,
    "convertTo" TEXT,
    "documents" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "letterOfIntent" TEXT,
    "auditedFinancialStatement" TEXT,
    "businessPlan" TEXT,
    "certOfNoticePosted" TEXT,
    "certSignedManualOperations" TEXT,
    "generalAssemblyResolution" TEXT,
    "noticeOfConversion" TEXT,
    "oathOfUndertaking" TEXT,
    "originalCert" TEXT,

    CONSTRAINT "ConversionApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClosureApplication" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "closureReason" TEXT,
    "closureDate" TIMESTAMP(3),
    "documents" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "letterOfIntent" TEXT,
    "noticeOfClosure" TEXT,

    CONSTRAINT "ClosureApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Laboratory" (
    "id" TEXT NOT NULL,
    "laboratory_name" TEXT,
    "prefixName" TEXT,
    "region_id" TEXT,
    "province_id" TEXT,
    "cityMun_id" TEXT,
    "barangay_id" TEXT,
    "zipCode" TEXT,
    "boardResolution" TEXT,
    "commonBondMembershipId" TEXT,
    "validator" TEXT,
    "senior_cds" TEXT,
    "director" TEXT,
    "status" TEXT,
    "applicationStatus" "ApplicationStatus" DEFAULT 'IN_PROGRESS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "validator_id" TEXT,
    "version" TEXT NOT NULL DEFAULT '1',
    "isDraft" BOOLEAN NOT NULL DEFAULT true,
    "coopOrgId" TEXT,
    "closedAt" TIMESTAMP(3),
    "lotBlockPhaseHouseNo" TEXT,
    "referenceId" TEXT,
    "streetName" TEXT,
    "subdivisionVillageZone" TEXT,
    "townDistrict" TEXT,
    "unitRoomFloorBuilding" TEXT,
    "contactDesignation" TEXT,
    "contactEmail" TEXT,
    "contactNumber" TEXT,
    "contactPerson" TEXT,
    "documents" JSONB,
    "expiresAt" TIMESTAMP(3),
    "manualOfOperations" TEXT,

    CONSTRAINT "Laboratory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountApplications" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "alternate_email" TEXT,
    "password" TEXT,
    "registrationId" TEXT,
    "contact_number" TEXT,
    "alternate_contact_number" TEXT,
    "primaryRepId" TEXT,
    "alternateRepId" TEXT,
    "regionCode" TEXT,
    "provinceCode" TEXT,
    "cityMunicipalityCode" TEXT,
    "barangayCode" TEXT,
    "townDistrict" TEXT,
    "zipCode" TEXT,
    "streetName" TEXT,
    "subdivisionVillageZone" TEXT,
    "unitRoomFloorBuilding" TEXT,
    "lotBlockPhaseHouseNo" TEXT,
    "certOfAuthorization" TEXT,
    "status" "AccountApplicationStatus" DEFAULT 'PENDING',
    "validatedBy" TEXT,
    "reasonOfDenial" TEXT,
    "isLock" BOOLEAN DEFAULT false,
    "idNumber" TEXT,
    "reasonsList" JSONB,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "AccountApplications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Representative" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "lastname" TEXT,
    "firstname" TEXT,
    "middlename" TEXT,
    "extension_name" TEXT,
    "gender" TEXT,
    "nationality" TEXT,
    "birth_date" TIMESTAMP(3),
    "address" JSONB,
    "designation" TEXT,
    "typeId" TEXT,
    "id_no" TEXT,
    "governmentId" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Representative_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ValidatorQuestion" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "is_required" BOOLEAN NOT NULL,
    "is_header" BOOLEAN DEFAULT false,
    "region_id" TEXT,
    "parent_id" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'Question',
    "is_answerable" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ValidatorQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoopNameProhibitedTerms" (
    "id" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "CoopNameProhibitedTerms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CooperativeValidationStatus" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT '1',
    "question" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "type" INTEGER NOT NULL DEFAULT 0,
    "referenceId" TEXT,

    CONSTRAINT "CooperativeValidationStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CooperativeFinding" (
    "id" TEXT NOT NULL,
    "findings" TEXT NOT NULL,
    "recommendation" TEXT NOT NULL,
    "created_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "version" TEXT,
    "role" TEXT,
    "type" INTEGER NOT NULL DEFAULT 0,
    "referenceId" TEXT,

    CONSTRAINT "CooperativeFinding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CooperativeApproverLog" (
    "id" TEXT NOT NULL,
    "cooperative_id" TEXT,
    "status" TEXT,
    "applicationStatus" TEXT,
    "isDraft" TEXT,
    "isApproved" TEXT,
    "user_id" TEXT,
    "role" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CooperativeApproverLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionLog" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "region_id" TEXT,
    "data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" INTEGER NOT NULL DEFAULT 0,
    "officialReceipt" TEXT,
    "referenceId" TEXT,
    "orderNo" TEXT NOT NULL,

    CONSTRAINT "TransactionLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CdaChairman" (
    "id" SERIAL NOT NULL,
    "chairman" TEXT,
    "active_status" INTEGER,
    "effectivity_date" TEXT,

    CONSTRAINT "CdaChairman_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoopStatus" (
    "id" TEXT NOT NULL,
    "coopOrgId" TEXT NOT NULL,
    "showCauseOrderId" TEXT,
    "effectiveDate" TIMESTAMP(3) NOT NULL,
    "remarks" TEXT,
    "updatedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "complianceStatusId" INTEGER,
    "statusCategoryId" INTEGER,
    "statusTypeId" INTEGER,

    CONSTRAINT "CoopStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoopStatusHistory" (
    "id" TEXT NOT NULL,
    "coopStatusId" TEXT NOT NULL,
    "coopOrgId" TEXT NOT NULL,
    "complianceStatusId" INTEGER,
    "statusCategoryId" INTEGER,
    "statusTypeId" INTEGER,
    "showCauseOrderId" TEXT,
    "effectiveDate" TIMESTAMP(3) NOT NULL,
    "remarks" TEXT,
    "updatedBy" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "changeDetails" JSONB,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changedBy" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoopStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PcpcClasses" (
    "id" SERIAL NOT NULL,
    "class_no" TEXT,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),
    "sub_class_no" TEXT,

    CONSTRAINT "PcpcClasses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PsccMajorProduct" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "PsccMajorProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PsccSubProduct" (
    "id" SERIAL NOT NULL,
    "code" TEXT,
    "description" TEXT,
    "details" JSONB,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "majorProductId" INTEGER,

    CONSTRAINT "PsccSubProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShowCauseOrder" (
    "id" TEXT NOT NULL,
    "coopStatusId" TEXT,
    "scoType" TEXT NOT NULL,
    "grounds" TEXT NOT NULL,
    "yearOne" TEXT NOT NULL,
    "yearTwo" TEXT NOT NULL,
    "caseNumber" TEXT NOT NULL,
    "dateIssued" TIMESTAMP(3) NOT NULL,
    "lifeStatus" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShowCauseOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShowCauseOrderHistory" (
    "id" TEXT NOT NULL,
    "showCauseOrderId" TEXT,
    "coopStatusId" TEXT,
    "scoType" TEXT NOT NULL,
    "grounds" TEXT NOT NULL,
    "yearOne" TEXT NOT NULL,
    "yearTwo" TEXT NOT NULL,
    "caseNumber" TEXT NOT NULL,
    "dateIssued" TIMESTAMP(3) NOT NULL,
    "lifeStatus" JSONB NOT NULL,
    "action" TEXT NOT NULL,
    "changeDetails" JSONB,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changedBy" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShowCauseOrderHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CooperativeEconomicSurvey" (
    "id" TEXT NOT NULL,
    "cooperativeId" TEXT NOT NULL,
    "surveyType" "EconomicSurveyType" NOT NULL,
    "primarySurveyId" TEXT,
    "csfSurveyId" TEXT,

    CONSTRAINT "CooperativeEconomicSurvey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EconomicSurveyCsf" (
    "id" TEXT NOT NULL,

    CONSTRAINT "EconomicSurveyCsf_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EconomicSurveyPrimary" (
    "id" TEXT NOT NULL,

    CONSTRAINT "EconomicSurveyPrimary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ApplicationTypeToValidatorQuestion" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ApplicationTypeToValidatorQuestion_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_TypeCooperativeTomajorIndustryClassifications" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_TypeCooperativeTomajorIndustryClassifications_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_majorIndustryClassificationsTosubIndustryClassifications" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_majorIndustryClassificationsTosubIndustryClassificatio_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "CooperativeOrg_approvedCooperativeId_key" ON "CooperativeOrg"("approvedCooperativeId");

-- CreateIndex
CREATE UNIQUE INDEX "CooperativeOrg_alternateRepId_key" ON "CooperativeOrg"("alternateRepId");

-- CreateIndex
CREATE UNIQUE INDEX "CooperativeOrg_primaryRepId_key" ON "CooperativeOrg"("primaryRepId");

-- CreateIndex
CREATE UNIQUE INDEX "CooperativeOrg_amendmentApplicationId_key" ON "CooperativeOrg"("amendmentApplicationId");

-- CreateIndex
CREATE UNIQUE INDEX "CooperativeOrg_regNo_key" ON "CooperativeOrg"("regNo");

-- CreateIndex
CREATE UNIQUE INDEX "CooperativeOrg_cooperativeName_key" ON "CooperativeOrg"("cooperativeName");

-- CreateIndex
CREATE UNIQUE INDEX "Cooperatives_registrationId_key" ON "Cooperatives"("registrationId");

-- CreateIndex
CREATE UNIQUE INDEX "Cooperatives_registrationNo_key" ON "Cooperatives"("registrationNo");

-- CreateIndex
CREATE UNIQUE INDEX "Regions_regCode_key" ON "Regions"("regCode");

-- CreateIndex
CREATE UNIQUE INDEX "Province_provCode_key" ON "Province"("provCode");

-- CreateIndex
CREATE UNIQUE INDEX "CityMunicipality_citymunCode_key" ON "CityMunicipality"("citymunCode");

-- CreateIndex
CREATE UNIQUE INDEX "Barangays_brgyCode_key" ON "Barangays"("brgyCode");

-- CreateIndex
CREATE UNIQUE INDEX "TypesOfID_name_key" ON "TypesOfID"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AreasOfOperation_name_key" ON "AreasOfOperation"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryCooperatives_name_key" ON "CategoryCooperatives"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationType_name_key" ON "ApplicationType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TypeCooperative_name_key" ON "TypeCooperative"("name");

-- CreateIndex
CREATE UNIQUE INDEX "BondOfMembership_name_key" ON "BondOfMembership"("name");

-- CreateIndex
CREATE UNIQUE INDEX "compositionOfMembership_name_key" ON "compositionOfMembership"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TypeCoopIndustryLink_cooperativeTypeId_majorIndustryId_subI_key" ON "TypeCoopIndustryLink"("cooperativeTypeId", "majorIndustryId", "subIndustryId");

-- CreateIndex
CREATE UNIQUE INDEX "ValidationTool_cooperativeRegistrationId_key" ON "ValidationTool"("cooperativeRegistrationId");

-- CreateIndex
CREATE UNIQUE INDEX "BranchSatellite_registration_id_key" ON "BranchSatellite"("registration_id");

-- CreateIndex
CREATE UNIQUE INDEX "BranchSatellite_registrationNo_key" ON "BranchSatellite"("registrationNo");

-- CreateIndex
CREATE UNIQUE INDEX "CtcApplication_referenceId_key" ON "CtcApplication"("referenceId");

-- CreateIndex
CREATE UNIQUE INDEX "TransferApplication_applicationId_key" ON "TransferApplication"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "ConversionApplication_applicationId_key" ON "ConversionApplication"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "ClosureApplication_applicationId_key" ON "ClosureApplication"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "Laboratory_referenceId_key" ON "Laboratory"("referenceId");

-- CreateIndex
CREATE UNIQUE INDEX "AccountApplications_registrationId_key" ON "AccountApplications"("registrationId");

-- CreateIndex
CREATE UNIQUE INDEX "AccountApplications_primaryRepId_key" ON "AccountApplications"("primaryRepId");

-- CreateIndex
CREATE UNIQUE INDEX "AccountApplications_alternateRepId_key" ON "AccountApplications"("alternateRepId");

-- CreateIndex
CREATE UNIQUE INDEX "CoopStatus_showCauseOrderId_key" ON "CoopStatus"("showCauseOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "PsccSubProduct_code_key" ON "PsccSubProduct"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ShowCauseOrder_coopStatusId_key" ON "ShowCauseOrder"("coopStatusId");

-- CreateIndex
CREATE UNIQUE INDEX "ShowCauseOrder_caseNumber_key" ON "ShowCauseOrder"("caseNumber");

-- CreateIndex
CREATE UNIQUE INDEX "CooperativeEconomicSurvey_cooperativeId_key" ON "CooperativeEconomicSurvey"("cooperativeId");

-- CreateIndex
CREATE UNIQUE INDEX "CooperativeEconomicSurvey_primarySurveyId_key" ON "CooperativeEconomicSurvey"("primarySurveyId");

-- CreateIndex
CREATE UNIQUE INDEX "CooperativeEconomicSurvey_csfSurveyId_key" ON "CooperativeEconomicSurvey"("csfSurveyId");

-- CreateIndex
CREATE INDEX "_ApplicationTypeToValidatorQuestion_B_index" ON "_ApplicationTypeToValidatorQuestion"("B");

-- CreateIndex
CREATE INDEX "_TypeCooperativeTomajorIndustryClassifications_B_index" ON "_TypeCooperativeTomajorIndustryClassifications"("B");

-- CreateIndex
CREATE INDEX "_majorIndustryClassificationsTosubIndustryClassificatio_B_index" ON "_majorIndustryClassificationsTosubIndustryClassifications"("B");

-- AddForeignKey
ALTER TABLE "CooperativeOrg" ADD CONSTRAINT "CooperativeOrg_alternateRepId_fkey" FOREIGN KEY ("alternateRepId") REFERENCES "Representative"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CooperativeOrg" ADD CONSTRAINT "CooperativeOrg_amendmentApplicationId_fkey" FOREIGN KEY ("amendmentApplicationId") REFERENCES "Cooperatives"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CooperativeOrg" ADD CONSTRAINT "CooperativeOrg_approvedCooperativeId_fkey" FOREIGN KEY ("approvedCooperativeId") REFERENCES "Cooperatives"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CooperativeOrg" ADD CONSTRAINT "CooperativeOrg_complianceCategoryId_fkey" FOREIGN KEY ("complianceCategoryId") REFERENCES "ComplianceCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CooperativeOrg" ADD CONSTRAINT "CooperativeOrg_complianceStatusId_fkey" FOREIGN KEY ("complianceStatusId") REFERENCES "ComplianceStatus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CooperativeOrg" ADD CONSTRAINT "CooperativeOrg_complianceTypeId_fkey" FOREIGN KEY ("complianceTypeId") REFERENCES "ComplianceType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CooperativeOrg" ADD CONSTRAINT "CooperativeOrg_primaryRepId_fkey" FOREIGN KEY ("primaryRepId") REFERENCES "Representative"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cooperatives" ADD CONSTRAINT "Cooperatives_brgyCode_fkey" FOREIGN KEY ("brgyCode") REFERENCES "Barangays"("brgyCode") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cooperatives" ADD CONSTRAINT "Cooperatives_citymunCode_fkey" FOREIGN KEY ("citymunCode") REFERENCES "CityMunicipality"("citymunCode") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cooperatives" ADD CONSTRAINT "Cooperatives_cooperativeOrgId_fkey" FOREIGN KEY ("cooperativeOrgId") REFERENCES "CooperativeOrg"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cooperatives" ADD CONSTRAINT "Cooperatives_cooperativeTypeId_fkey" FOREIGN KEY ("cooperativeTypeId") REFERENCES "TypeCooperative"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cooperatives" ADD CONSTRAINT "Cooperatives_provCode_fkey" FOREIGN KEY ("provCode") REFERENCES "Province"("provCode") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cooperatives" ADD CONSTRAINT "Cooperatives_regCode_fkey" FOREIGN KEY ("regCode") REFERENCES "Regions"("regCode") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cooperatives" ADD CONSTRAINT "Cooperatives_validator_question_id_fkey" FOREIGN KEY ("validator_question_id") REFERENCES "ValidatorQuestion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppRegistrationTypeFee" ADD CONSTRAINT "AppRegistrationTypeFee_applicationTypeId_fkey" FOREIGN KEY ("applicationTypeId") REFERENCES "ApplicationType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppRegistrationTypeFee" ADD CONSTRAINT "AppRegistrationTypeFee_areaOfOperationId_fkey" FOREIGN KEY ("areaOfOperationId") REFERENCES "AreasOfOperation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CooperativePurposes" ADD CONSTRAINT "CooperativePurposes_coopTypeId_fkey" FOREIGN KEY ("coopTypeId") REFERENCES "TypeCooperative"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentaryRequirements" ADD CONSTRAINT "DocumentaryRequirements_coopTypeId_fkey" FOREIGN KEY ("coopTypeId") REFERENCES "TypeCooperative"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TypeCoopIndustryLink" ADD CONSTRAINT "TypeCoopIndustryLink_cooperativeTypeId_fkey" FOREIGN KEY ("cooperativeTypeId") REFERENCES "TypeCooperative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TypeCoopIndustryLink" ADD CONSTRAINT "TypeCoopIndustryLink_majorIndustryId_fkey" FOREIGN KEY ("majorIndustryId") REFERENCES "majorIndustryClassifications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TypeCoopIndustryLink" ADD CONSTRAINT "TypeCoopIndustryLink_subIndustryId_fkey" FOREIGN KEY ("subIndustryId") REFERENCES "subIndustryClassifications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValidationTool" ADD CONSTRAINT "ValidationTool_cooperativeRegistrationId_fkey" FOREIGN KEY ("cooperativeRegistrationId") REFERENCES "Cooperatives"("registrationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchSatellite" ADD CONSTRAINT "BranchSatellite_barangay_id_fkey" FOREIGN KEY ("barangay_id") REFERENCES "Barangays"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchSatellite" ADD CONSTRAINT "BranchSatellite_cityMun_id_fkey" FOREIGN KEY ("cityMun_id") REFERENCES "CityMunicipality"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchSatellite" ADD CONSTRAINT "BranchSatellite_cooperativeOrgId_fkey" FOREIGN KEY ("cooperativeOrgId") REFERENCES "CooperativeOrg"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchSatellite" ADD CONSTRAINT "BranchSatellite_province_id_fkey" FOREIGN KEY ("province_id") REFERENCES "Province"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchSatellite" ADD CONSTRAINT "BranchSatellite_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "Regions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CtcApplication" ADD CONSTRAINT "CtcApplication_branchSatelliteId_fkey" FOREIGN KEY ("branchSatelliteId") REFERENCES "BranchSatellite"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferApplication" ADD CONSTRAINT "TransferApplication_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "CtcApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferApplication" ADD CONSTRAINT "TransferApplication_newBarangayCode_fkey" FOREIGN KEY ("newBarangayCode") REFERENCES "Barangays"("brgyCode") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferApplication" ADD CONSTRAINT "TransferApplication_newCityMunCode_fkey" FOREIGN KEY ("newCityMunCode") REFERENCES "CityMunicipality"("citymunCode") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferApplication" ADD CONSTRAINT "TransferApplication_newProvinceCode_fkey" FOREIGN KEY ("newProvinceCode") REFERENCES "Province"("provCode") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferApplication" ADD CONSTRAINT "TransferApplication_newRegionCode_fkey" FOREIGN KEY ("newRegionCode") REFERENCES "Regions"("regCode") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversionApplication" ADD CONSTRAINT "ConversionApplication_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "CtcApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClosureApplication" ADD CONSTRAINT "ClosureApplication_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "CtcApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Laboratory" ADD CONSTRAINT "Laboratory_barangay_id_fkey" FOREIGN KEY ("barangay_id") REFERENCES "Barangays"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Laboratory" ADD CONSTRAINT "Laboratory_cityMun_id_fkey" FOREIGN KEY ("cityMun_id") REFERENCES "CityMunicipality"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Laboratory" ADD CONSTRAINT "Laboratory_commonBondMembershipId_fkey" FOREIGN KEY ("commonBondMembershipId") REFERENCES "BondOfMembership"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Laboratory" ADD CONSTRAINT "Laboratory_coopOrgId_fkey" FOREIGN KEY ("coopOrgId") REFERENCES "CooperativeOrg"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Laboratory" ADD CONSTRAINT "Laboratory_province_id_fkey" FOREIGN KEY ("province_id") REFERENCES "Province"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Laboratory" ADD CONSTRAINT "Laboratory_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "Regions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountApplications" ADD CONSTRAINT "AccountApplications_alternateRepId_fkey" FOREIGN KEY ("alternateRepId") REFERENCES "Representative"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountApplications" ADD CONSTRAINT "AccountApplications_barangayCode_fkey" FOREIGN KEY ("barangayCode") REFERENCES "Barangays"("brgyCode") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountApplications" ADD CONSTRAINT "AccountApplications_cityMunicipalityCode_fkey" FOREIGN KEY ("cityMunicipalityCode") REFERENCES "CityMunicipality"("citymunCode") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountApplications" ADD CONSTRAINT "AccountApplications_primaryRepId_fkey" FOREIGN KEY ("primaryRepId") REFERENCES "Representative"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountApplications" ADD CONSTRAINT "AccountApplications_provinceCode_fkey" FOREIGN KEY ("provinceCode") REFERENCES "Province"("provCode") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountApplications" ADD CONSTRAINT "AccountApplications_regionCode_fkey" FOREIGN KEY ("regionCode") REFERENCES "Regions"("regCode") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Representative" ADD CONSTRAINT "Representative_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "TypesOfID"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValidatorQuestion" ADD CONSTRAINT "ValidatorQuestion_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "ValidatorQuestion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValidatorQuestion" ADD CONSTRAINT "ValidatorQuestion_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "Regions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoopStatus" ADD CONSTRAINT "CoopStatus_complianceStatusId_fkey" FOREIGN KEY ("complianceStatusId") REFERENCES "ComplianceStatus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoopStatus" ADD CONSTRAINT "CoopStatus_coopOrgId_fkey" FOREIGN KEY ("coopOrgId") REFERENCES "CooperativeOrg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoopStatus" ADD CONSTRAINT "CoopStatus_showCauseOrderId_fkey" FOREIGN KEY ("showCauseOrderId") REFERENCES "ShowCauseOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoopStatus" ADD CONSTRAINT "CoopStatus_statusCategoryId_fkey" FOREIGN KEY ("statusCategoryId") REFERENCES "ComplianceCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoopStatus" ADD CONSTRAINT "CoopStatus_statusTypeId_fkey" FOREIGN KEY ("statusTypeId") REFERENCES "ComplianceType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoopStatusHistory" ADD CONSTRAINT "CoopStatusHistory_coopStatusId_fkey" FOREIGN KEY ("coopStatusId") REFERENCES "CoopStatus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PsccSubProduct" ADD CONSTRAINT "PsccSubProduct_majorProductId_fkey" FOREIGN KEY ("majorProductId") REFERENCES "PsccMajorProduct"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShowCauseOrderHistory" ADD CONSTRAINT "ShowCauseOrderHistory_showCauseOrderId_fkey" FOREIGN KEY ("showCauseOrderId") REFERENCES "ShowCauseOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CooperativeEconomicSurvey" ADD CONSTRAINT "CooperativeEconomicSurvey_cooperativeId_fkey" FOREIGN KEY ("cooperativeId") REFERENCES "Cooperatives"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CooperativeEconomicSurvey" ADD CONSTRAINT "CooperativeEconomicSurvey_csfSurveyId_fkey" FOREIGN KEY ("csfSurveyId") REFERENCES "EconomicSurveyCsf"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CooperativeEconomicSurvey" ADD CONSTRAINT "CooperativeEconomicSurvey_primarySurveyId_fkey" FOREIGN KEY ("primarySurveyId") REFERENCES "EconomicSurveyPrimary"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicationTypeToValidatorQuestion" ADD CONSTRAINT "_ApplicationTypeToValidatorQuestion_A_fkey" FOREIGN KEY ("A") REFERENCES "ApplicationType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicationTypeToValidatorQuestion" ADD CONSTRAINT "_ApplicationTypeToValidatorQuestion_B_fkey" FOREIGN KEY ("B") REFERENCES "ValidatorQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TypeCooperativeTomajorIndustryClassifications" ADD CONSTRAINT "_TypeCooperativeTomajorIndustryClassifications_A_fkey" FOREIGN KEY ("A") REFERENCES "TypeCooperative"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TypeCooperativeTomajorIndustryClassifications" ADD CONSTRAINT "_TypeCooperativeTomajorIndustryClassifications_B_fkey" FOREIGN KEY ("B") REFERENCES "majorIndustryClassifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_majorIndustryClassificationsTosubIndustryClassifications" ADD CONSTRAINT "_majorIndustryClassificationsTosubIndustryClassification_A_fkey" FOREIGN KEY ("A") REFERENCES "majorIndustryClassifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_majorIndustryClassificationsTosubIndustryClassifications" ADD CONSTRAINT "_majorIndustryClassificationsTosubIndustryClassification_B_fkey" FOREIGN KEY ("B") REFERENCES "subIndustryClassifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
