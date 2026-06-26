import {
  TAreaOfOperation,
  TAreaOfOperationRegion,
  TCoopCategory,
} from "./createCooperativeApplication.js";

export function resolveCompliance(compliant: string) {
  const complianceMap = [
    { match: "compliant: issued with coc", statusId: 1, categoryId: 2 },
    { match: "compliant", statusId: 1, categoryId: 2 },

    {
      match: "non-compliant: issued with sho",
      statusId: 2,
      categoryId: 4,
    },
    { match: "issued with show cause", statusId: 2, categoryId: 4 },

    {
      match: "non-compliant: issued with not",
      statusId: 2,
      categoryId: 3,
    },

    {
      match: "non-compliant: under dissoluti",
      statusId: 2,
      categoryId: 5,
    },
    { match: "under dissolution", statusId: 2, categoryId: 5 },

    {
      match: "non-compliant: under liquidati",
      statusId: 3,
      categoryId: 7,
    },
    { match: "under liquidation", statusId: 3, categoryId: 7 },

    { match: "non-compliant: dissolved", statusId: 3, categoryId: 6 },
    {
      match: "non-compliant: dissolved due t",
      statusId: 3,
      categoryId: 6,
    },
    { match: "dissolved", statusId: 3, categoryId: 6 },

    { match: "non-compliant: cancelled", statusId: 3, categoryId: 8 },
    { match: "cancelled", statusId: 3, categoryId: 8 },

    { match: "non-compliant: delisted", statusId: 3, categoryId: 9 },
    { match: "delisted", statusId: 3, categoryId: 9 },

    { match: "consolidated", statusId: 5 },
    { match: "merged", statusId: 4 },
  ];

  if (!compliant || !compliant.trim()) {
    return {
      complianceStatusId: 6, // Unclassified
      complianceCategoryId: 0,
      complianceTypeId: 0,
    };
  }

  const value = compliant.toLowerCase();

  const found = complianceMap.find((item) => value.includes(item.match));

  if (!found) {
    // fallback if no rule matched

    console.error("[COMPLIANCE] No matching rule found:", compliant);
    return {
      complianceStatusId: 6,
      complianceCategoryId: 0,
      complianceTypeId: 0,
    };
  }

  return {
    complianceStatusId: found.statusId,
    complianceCategoryId: found.categoryId ?? 0,
    complianceTypeId: 0,
  };
}

// export function resolveCoopType(type: string, coopName: string) {
//   const coop_type = (type || "").trim();

//   const coopTypeMap = [
//     {
//       id: "1a869d61-bc9e-4f84-b96f-1dd71103e66c",
//       name: "Advocacy",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "e8e1a2a3-5d32-45b3-bd5f-280b3025f2ce",
//       name: "Agrarian Reform",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "c6f3c80e-0a38-4054-a90d-e140eaeff7ee",
//       name: "Agriculture",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "81f77162-318e-4e0f-9c47-f5c4e6cbf6e6",
//       name: "Consumers",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "6d4600f5-b816-4f85-b89c-ea1ec81c6d90",
//       name: "Credit",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "be9c37d5-3e3e-498b-bf1b-1b8f5fd29435",
//       name: "Dairy",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "eb3e11de-bbf2-44f5-bf57-e6d2266de48c",
//       name: "Education",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "e61ad64a-1c22-4cd6-b994-ff68b47c07de",
//       name: "Electric",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "c9ceea96-c0e7-435c-89c0-c55d8f49a314",
//       name: "Financial Service",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "f536c132-45a6-4bfb-9d82-1b54a40f24c5",
//       name: "Fishermen",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "678891de-d783-4d00-b2e6-26d882aa340b",
//       name: "Health Service",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "3e826b2c-b1db-4d51-810e-fb8b66efbfeb",
//       name: "Housing",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "57b19c89-c004-42e5-87a7-8b2b2f8bcad1",
//       name: "Labor Service",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "f2e7a8c3-9b4d-4e2a-8c1a-7e3b2d4f5a6b",
//       name: "Logistics Service",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "d307e98b-08f5-4518-bd2c-e2bfb24d2335",
//       name: "Marketing",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "5a1f4c7e-83b3-4e73-8b6b-2c8e4d0bb08c",
//       name: "Multipurpose",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "acc2055e-1b01-4e3c-a2b1-b14646aa8224",
//       name: "Producers",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "9b9c66ef-0f58-498b-9384-6c826961d75f",
//       name: "Professionals",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "d38d7c63-086d-47a4-871e-7c9e4e6b3bd4",
//       name: "Small Scale Mining",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "2e7cb8a9-4b13-47c7-843f-d01a88969e63",
//       name: "Service",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "ccf7fce3-bf80-4bc7-8a48-94ea03faef7e",
//       name: "Transport",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "f6fae7b4-8b37-4f8b-810e-32ac5104cf47",
//       name: "Technology Service",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "f74db779-b4ee-4295-8d1b-4c2b715e63f3",
//       name: "Water Service",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "ef8eb865-cb11-421b-921b-e2f46b31b0a0",
//       name: "Workers",
//       category: ["primary"],
//       isActive: true,
//     },
//     {
//       id: "c464a3d0-5ff1-4dbb-a77f-dcdfd1c25c1a",
//       name: "Cooperative Bank",
//       category: ["secondary", "tertiary"],
//       isActive: true,
//     },
//     {
//       id: "6d4c0a7f-5f18-4e1d-a456-2a7f3f7c6d98",
//       name: "Insurance",
//       category: ["special"],
//       isActive: false,
//     },
//     {
//       id: "b1e7c2d4-3a5f-4e2b-9c8a-7f6e5d4c3b2a",
//       name: "Memorial Service",
//       category: ["secondary", "tertiary"],
//       isActive: false,
//     },
//     {
//       id: "b2e1f7c3-6a4d-4e2b-9c1a-8f7e5d4c3b2a",
//       name: "Federation",
//       category: ["secondary", "tertiary"],
//       isActive: true,
//     },
//     {
//       id: "c3d2e1f7-5a6b-4c2d-8e1a-7f6e5d4c3b2a",
//       name: "Union",
//       category: ["secondary", "tertiary"],
//       isActive: true,
//     },
//     {
//       id: "d4c3b2a1-7e6f-4d2c-9b1a-6e5d4c3b2a1f",
//       name: "Credit Surety Fund",
//       category: ["special"],
//       isActive: true,
//     },
//   ];

//   const multipurposeType = coopTypeMap.find(
//     (t) => t.name.toLowerCase() === "multipurpose",
//   );
//   const federationType = coopTypeMap.find(
//     (t) => t.name.toLowerCase() === "federation",
//   );
//   const cooperativeBankType = coopTypeMap.find(
//     (t) => t.name.toLowerCase() === "cooperative bank",
//   );

//   const nameLower = (coopName || "").toLowerCase();

//   // Cooperative Bank
//   if (coop_type.toLowerCase().includes("cooperative bank")) {
//     return {
//       id: cooperativeBankType?.id,
//       type: "Cooperative Bank",
//       coopTypeList: [],
//     };
//   }

//   // Federation in name
//   if (nameLower.includes("federation")) {
//     return { id: federationType?.id, type: "Federation", coopTypeList: [] };
//   }

//   // Empty type
//   if (!coop_type) {
//     return { id: null, type: "Unknown", coopTypeList: [] };
//   }

//   // Normalize raw types
//   const rawTypes = coop_type
//     .split(",")
//     .map((t: string) => t.trim())
//     .filter(Boolean);

//   const hasMultipurposeRawType = rawTypes.some((t) =>
//     /multi[\s-]?purpose/i.test(t),
//   );

//   const matchedTypes = rawTypes
//     .map((raw) =>
//       coopTypeMap.find((t) => t.name.toLowerCase() === raw.toLowerCase()),
//     )
//     .filter(Boolean);

//   const isMultipurpose =
//     hasMultipurposeRawType ||
//     /multi[\s-]?purpose/i.test(coopName || "") ||
//     matchedTypes.length > 1;

//   if (isMultipurpose) {
//     const matchedTypeList = matchedTypes.map(
//       (t: { id: string; type: string }) => ({
//         id: t.id,
//         type: t.name,
//       }),
//     );

//     return {
//       id: multipurposeType?.id,
//       type: "Multipurpose",
//       coopTypeList: hasMultipurposeRawType ? [] : matchedTypeList,
//     };
//   }

//   // Single type fallback
//   return {
//     id: matchedTypes[0]?.id || multipurposeType?.id,
//     type: matchedTypes[0]?.name || "Multipurpose",
//     coopTypeList: [],
//   };
// }

// export function resolveCoopType(type: string, coopName: string) {
//   let coop_type = (type || "").trim();

//   const coopTypeMap: Array<{
//     id: string;
//     name: string;
//     category: string[];
//     isActive: boolean;
//   }> = [];

//   const multipurposeType = coopTypeMap.find(
//     (t) => t.name.toLowerCase() === "multipurpose",
//   );
//   const federationType = coopTypeMap.find(
//     (t) => t.name.toLowerCase() === "federation",
//   );
//   const cooperativeBankType = coopTypeMap.find(
//     (t) => t.name.toLowerCase() === "cooperative bank",
//   );

//   const nameLower = (coopName || "").toLowerCase();

//   // Cooperative Bank
//   if (coop_type.toLowerCase().includes("cooperative bank")) {
//     return {
//       id: cooperativeBankType?.id,
//       type: "Cooperative Bank",
//       coopTypeList: [],
//     };
//   }

//   // Federation in name
//   if (nameLower.includes("federation")) {
//     return { id: federationType?.id, type: "Federation", coopTypeList: [] };
//   }

//   // Empty type
//   if (!coop_type) {
//     return { id: null, type: "Unknown", coopTypeList: [] };
//   }

//   // Normalize raw types
//   const rawTypes = coop_type
//     .split(",")
//     .map((t: string) => t.trim())
//     .filter(Boolean);

//   const hasMultipurposeRawType = rawTypes.some((t) =>
//     /multi[\s-]?purpose/i.test(t),
//   );

//   const matchedTypes = rawTypes
//     .map((raw) =>
//       coopTypeMap.find((t) => t.name.toLowerCase() === raw.toLowerCase()),
//     )
//     .filter((t): t is NonNullable<typeof t> => t !== undefined);

//   const isMultipurpose =
//     hasMultipurposeRawType ||
//     /multi[\s-]?purpose/i.test(coopName || "") ||
//     matchedTypes.length > 1;

//   if (isMultipurpose) {
//     const matchedTypeList = matchedTypes.map((t) => ({
//       id: t.id,
//       type: t.name,
//     }));

//     return {
//       id: multipurposeType?.id,
//       type: "Multipurpose",
//       coopTypeList: hasMultipurposeRawType ? [] : matchedTypeList,
//     };
//   }

//   // Single type fallback
//   return {
//     id: matchedTypes[0]?.id || multipurposeType?.id,
//     type: matchedTypes[0]?.name || "Multipurpose",
//     coopTypeList: [],
//   };
// }

export function resolveCoopType(type: string, coopName: string) {
  const coop_type = (type || "").trim();

  const coopTypeMap = [
    {
      id: "1a869d61-bc9e-4f84-b96f-1dd71103e66c",
      name: "Advocacy",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "e8e1a2a3-5d32-45b3-bd5f-280b3025f2ce",
      name: "Agrarian Reform",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "c6f3c80e-0a38-4054-a90d-e140eaeff7ee",
      name: "Agriculture",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "81f77162-318e-4e0f-9c47-f5c4e6cbf6e6",
      name: "Consumers",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "6d4600f5-b816-4f85-b89c-ea1ec81c6d90",
      name: "Credit",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "be9c37d5-3e3e-498b-bf1b-1b8f5fd29435",
      name: "Dairy",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "eb3e11de-bbf2-44f5-bf57-e6d2266de48c",
      name: "Education",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "e61ad64a-1c22-4cd6-b994-ff68b47c07de",
      name: "Electric",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "c9ceea96-c0e7-435c-89c0-c55d8f49a314",
      name: "Financial Service",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "f536c132-45a6-4bfb-9d82-1b54a40f24c5",
      name: "Fishermen",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "678891de-d783-4d00-b2e6-26d882aa340b",
      name: "Health Service",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "3e826b2c-b1db-4d51-810e-fb8b66efbfeb",
      name: "Housing",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "57b19c89-c004-42e5-87a7-8b2b2f8bcad1",
      name: "Labor Service",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "f2e7a8c3-9b4d-4e2a-8c1a-7e3b2d4f5a6b",
      name: "Logistics Service",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "d307e98b-08f5-4518-bd2c-e2bfb24d2335",
      name: "Marketing",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "5a1f4c7e-83b3-4e73-8b6b-2c8e4d0bb08c",
      name: "Multipurpose",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "acc2055e-1b01-4e3c-a2b1-b14646aa8224",
      name: "Producers",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "9b9c66ef-0f58-498b-9384-6c826961d75f",
      name: "Professionals",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "d38d7c63-086d-47a4-871e-7c9e4e6b3bd4",
      name: "Small Scale Mining",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "2e7cb8a9-4b13-47c7-843f-d01a88969e63",
      name: "Service",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "ccf7fce3-bf80-4bc7-8a48-94ea03faef7e",
      name: "Transport",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "f6fae7b4-8b37-4f8b-810e-32ac5104cf47",
      name: "Technology Service",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "f74db779-b4ee-4295-8d1b-4c2b715e63f3",
      name: "Water Service",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "ef8eb865-cb11-421b-921b-e2f46b31b0a0",
      name: "Workers",
      category: ["primary"],
      isActive: true,
    },
    {
      id: "c464a3d0-5ff1-4dbb-a77f-dcdfd1c25c1a",
      name: "Cooperative Bank",
      category: ["secondary", "tertiary"],
      isActive: true,
    },
    {
      id: "6d4c0a7f-5f18-4e1d-a456-2a7f3f7c6d98",
      name: "Insurance",
      category: ["special"],
      isActive: false,
    },
    {
      id: "b1e7c2d4-3a5f-4e2b-9c8a-7f6e5d4c3b2a",
      name: "Memorial Service",
      category: ["secondary", "tertiary"],
      isActive: false,
    },
    {
      id: "b2e1f7c3-6a4d-4e2b-9c1a-8f7e5d4c3b2a",
      name: "Federation",
      category: ["secondary", "tertiary"],
      isActive: true,
    },
    {
      id: "c3d2e1f7-5a6b-4c2d-8e1a-7f6e5d4c3b2a",
      name: "Union",
      category: ["secondary", "tertiary"],
      isActive: true,
    },
    {
      id: "d4c3b2a1-7e6f-4d2c-9b1a-6e5d4c3b2a1f",
      name: "Credit Surety Fund",
      category: ["special"],
      isActive: true,
    },
  ];

  const multipurposeType = coopTypeMap.find(
    (t) => t.name.toLowerCase() === "multipurpose",
  );
  const federationType = coopTypeMap.find(
    (t) => t.name.toLowerCase() === "federation",
  );
  const cooperativeBankType = coopTypeMap.find(
    (t) => t.name.toLowerCase() === "cooperative bank",
  );

  const nameLower = (coopName || "").toLowerCase();

  // Cooperative Bank
  if (coop_type.toLowerCase().includes("cooperative bank")) {
    return {
      id: cooperativeBankType?.id,
      type: "Cooperative Bank",
      coopTypeList: [],
    };
  }

  // Federation in name
  if (nameLower.includes("federation")) {
    return { id: federationType?.id, type: "Federation", coopTypeList: [] };
  }

  // Empty type
  if (!coop_type) {
    return { id: null, type: "Unknown", coopTypeList: [] };
  }

  // Normalize raw types
  const rawTypes = coop_type
    .split(",")
    .map((t: string) => t.trim())
    .filter(Boolean);

  const hasMultipurposeRawType = rawTypes.some((t) =>
    /multi[\s-]?purpose/i.test(t),
  );

  // Filter out undefined values properly
  const matchedTypes = rawTypes
    .map((raw) =>
      coopTypeMap.find((t) => t.name.toLowerCase() === raw.toLowerCase()),
    )
    .filter((t): t is NonNullable<typeof t> => t !== undefined); // Type guard

  const isMultipurpose =
    hasMultipurposeRawType ||
    /multi[\s-]?purpose/i.test(coopName || "") ||
    matchedTypes.length > 1;

  if (isMultipurpose) {
    const matchedTypeList = matchedTypes.map((t) => ({
      id: t.id,
      type: t.name,
    }));

    return {
      id: multipurposeType?.id,
      type: "Multipurpose",
      coopTypeList: hasMultipurposeRawType ? [] : matchedTypeList,
    };
  }

  // Single type fallback
  const singleType = matchedTypes[0] || multipurposeType;

  return {
    id: singleType?.id || null,
    type: singleType?.name || "Multipurpose",
    coopTypeList: [],
  };
}

export function normalizeDate(dateStr: string) {
  if (dateStr == null) return null; // covers null and undefined

  const value = String(dateStr).trim(); // <-- convert first, then trim

  if (!value) return null; // empty string

  if (/^(0+[-/]?){2,3}0+$/.test(value)) return null; // all-zero placeholders

  let day, month, year;

  // YYYY-MM-DD or YYYY/MM/DD
  if (/^\d{4}[-/]\d{2}[-/]\d{2}$/.test(value)) {
    [year, month, day] = value.split(/[-/]/);
  }

  // M/D/YYYY or MM-DD-YYYY
  else if (/^\d{1,2}[-/]\d{1,2}[-/]\d{4}$/.test(value)) {
    [month, day, year] = value.split(/[-/]/);
  }

  // DD-MM-YY
  else if (/^\d{2}-\d{2}-\d{2}$/.test(value)) {
    [day, month, year] = value.split("-");
    year = Number(year) < 50 ? `20${year}` : `19${year}`;
  } else {
    return null; // unsupported format
  }

  const isoDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  const date = new Date(isoDate);

  if (isNaN(date.getTime())) return null;

  return date;
}

// export function normalizeAddress(addrCode: string) {
//   addrCode = addrCode?.toString().trim() || "";

//   // Remove non-digits (/n, /r, hidden chars, etc.)
//   addrCode = addrCode.replace(/\D+/g, "");

//   if (addrCode.startsWith("00")) {
//     addrCode = addrCode.slice(1);
//   }

//   if (addrCode.length === 10) {
//     addrCode = addrCode.slice(1);
//   }

//   if (addrCode.length === 3 && addrCode.startsWith("0")) {
//     addrCode = addrCode.slice(1, -1);
//   }

//   // pad if needed
//   if (addrCode.length === 1 || addrCode.length === 3) {
//     addrCode = "0" + addrCode;
//   }

//   if (addrCode.length === 2 && addrCode === "18") {
//     addrCode = "17";
//   }

//   const regCode = addrCode.slice(0, 2);
//   const provCode = addrCode.slice(0, 4);
//   const citymunCode = addrCode.slice(0, 6);
//   const brgyCode = addrCode.slice(0, 9);

//   return {
//     regCode,
//     provCode,
//     citymunCode,
//     brgyCode,
//   };
// }

export function normalizeAddress(addrCode: string) {
  addrCode = addrCode?.toString().trim() || "";

  // Remove non-digits
  addrCode = addrCode.replace(/\D+/g, "");

  if (addrCode.startsWith("00")) {
    addrCode = addrCode.slice(1);
  }

  if (addrCode.length === 10) {
    addrCode = addrCode.slice(1);
  }

  if (addrCode.length === 3 && addrCode.startsWith("0")) {
    addrCode = addrCode.slice(1, -1);
  }

  // pad if needed
  if (addrCode.length === 1 || addrCode.length === 3) {
    addrCode = "0" + addrCode;
  }

  if (addrCode.length === 2 && addrCode === "18") {
    addrCode = "17";
  }

  // ===== SPECIAL REMAP LOGIC =====
  const specialPrefixes = ["0645", "0746", "0761"];

  const provCodeCheck = addrCode.slice(0, 4);
  const cityMunCodeCheck = addrCode.slice(0, 6);
  const brgyCodeCheck = addrCode.slice(0, 9);

  const shouldRemap = specialPrefixes.some(
    (prefix) =>
      provCodeCheck === prefix ||
      cityMunCodeCheck.startsWith(prefix) ||
      brgyCodeCheck.startsWith(prefix),
  );

  if (shouldRemap) {
    // Replace first 2 digits with "18"
    addrCode = "18" + addrCode.slice(2);
  }

  // ===== FINAL SLICING =====
  const regCode = addrCode.slice(0, 2);
  const provCode = addrCode.slice(0, 4);
  const citymunCode = addrCode.slice(0, 6);
  const brgyCode = addrCode.slice(0, 9);

  return {
    regCode,
    provCode,
    citymunCode,
    brgyCode,
  };
}

export function normalizeCategory(category: TCoopCategory) {
  return category?.toLowerCase().trim() === "others"
    ? "secondary"
    : category?.toLowerCase().trim();
}

export function normalizeAreaOfOperation(
  areaOfOperation_reg: string,
): TAreaOfOperation | string {
  const areaOfOperation =
    areaOfOperation_reg === "national" || areaOfOperation_reg === "nationwide"
      ? "national"
      : areaOfOperation_reg === "provincial" ||
          areaOfOperation_reg === "within the province" ||
          areaOfOperation_reg === "provincewide" ||
          areaOfOperation_reg === "province wide" ||
          areaOfOperation_reg === "province" ||
          areaOfOperation_reg === "within province" ||
          areaOfOperation_reg === "probinsya" ||
          areaOfOperation_reg === "lalawigan"
        ? "provincial"
        : areaOfOperation_reg === "municipal wide" ||
            areaOfOperation_reg === "municipality/city" ||
            areaOfOperation_reg === "city/municipality" ||
            areaOfOperation_reg === "municipality" ||
            areaOfOperation_reg === "the municipality of" ||
            areaOfOperation_reg === "within the municipal" ||
            areaOfOperation_reg === "within municipality" ||
            areaOfOperation_reg === "citywide" ||
            areaOfOperation_reg === "city wide" ||
            areaOfOperation_reg === "citiwide" ||
            areaOfOperation_reg === "municuipal" ||
            areaOfOperation_reg === "municipal" ||
            areaOfOperation_reg === "municpal" ||
            areaOfOperation_reg === "munisipyo" ||
            areaOfOperation_reg === "city" ||
            areaOfOperation_reg === "lungsod"
          ? "city-municipality"
          : areaOfOperation_reg === "regional" ||
              areaOfOperation_reg === "regionwide" ||
              areaOfOperation_reg === "region"
            ? "regional"
            : areaOfOperation_reg === "barangay" ||
                areaOfOperation_reg === "baranggay" ||
                areaOfOperation_reg === "barangay wide" ||
                areaOfOperation_reg === "within the barangay" ||
                areaOfOperation_reg === "within barangay" ||
                areaOfOperation_reg === "barangays"
              ? "barangay"
              : areaOfOperation_reg === "interregional" ||
                  areaOfOperation_reg === "inter-regional" ||
                  areaOfOperation_reg === "inter-region"
                ? "inter-regional"
                : areaOfOperation_reg;

  return areaOfOperation;
}

export function getUserRepresentative() {}
