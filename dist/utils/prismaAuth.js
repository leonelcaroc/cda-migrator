import { PrismaClient as AuthClient } from "@prisma/client/auth/index.js";
// import { PrismaClient } from "@prisma/client/auth";
// import { PrismaClient } from "@prisma/client";
export const prismaAuth = new AuthClient();
prismaAuth
    .$connect()
    .then(() => console.log("✅ Prisma AUTH connected"))
    .catch(console.error);
//# sourceMappingURL=prismaAuth.js.map