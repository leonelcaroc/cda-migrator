import { PrismaClient as CoopClient } from "@prisma/client/coop/index.js";
// import { PrismaClient } from "@prisma/client/coop";
// import { PrismaClient } from "@prisma/client";
export const prismaCoop = new CoopClient();
prismaCoop
    .$connect()
    .then(() => console.log("✅ Prisma COOP connected"))
    .catch(console.error);
//# sourceMappingURL=prismaCoop.js.map