import { PrismaClient } from "@prisma/client/auth/index.js";

export const prismaAuth = new PrismaClient();

prismaAuth
  .$connect()
  .then(() => console.log("✅ Prisma AUTH connected"))
  .catch(console.error);
