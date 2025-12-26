import { PrismaClient } from "@prisma/client/coop/index.js";

export const prismaCoop = new PrismaClient();

prismaCoop
  .$connect()
  .then(() => console.log("✅ Prisma COOP connected"))
  .catch(console.error);
