import { prismaCoop } from "./utils/prismaCoop.js";

export async function deleteAll() {
  const regNos = [
    "9520-01000214",
    "9520-01000206",
    "9520-02000433",
    "9520-02000436",
    "9520-03000358",
    "9520-03018015",
    "9520-04003091",
    "9520-04000200",
    "9520-04019319",
    "9520-04018952",
    "9520-05000879",
    "9520-05000939",
    "9520-06016713",
    "9520-06008174",
    "9520-07013895",
    "9520-07014069",
    "9520-08000508",
    "9520-08000346",
    "9520-09000071",
    "9520-09000260",
    "9520-10005596",
    "9520-10006791",
    "9520-11002167",
    "9520-11005118",
    "9520-12010085",
    "9520-12008154",
    "9520-13015442",
    "9520-13011486",
    "9520-16018636",
    "9520-16012864",
    "9520-15001496",
    "9520-15000052",
  ];

  try {
    const result = await prismaCoop.cooperativeOrg.deleteMany({
      where: {
        regNo: {
          in: regNos,
        },
      },
    });

    console.log(`Deleted ${result.count} records from cooperativeOrg`);
    return result;
  } catch (error) {
    console.error("Error deleting records:", error);
    throw error;
  } finally {
    await prismaCoop.$disconnect();
  }
}
