import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis;

function createClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString || connectionString.includes("__REPLACE__")) {
    throw new Error(
      "DATABASE_URL is missing or invalid. Set a postgresql:// URL in .env (see docker-compose.yml)."
    );
  }
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

function getPrisma() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createClient();
  }
  return globalForPrisma.prisma;
}

const prisma = new Proxy({}, {
  get(_, prop) {
    return getPrisma()[prop];
  },
});

export default prisma;
