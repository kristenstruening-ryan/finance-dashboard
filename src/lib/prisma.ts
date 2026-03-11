import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error(
    "CRITICAL: DATABASE_URL is undefined at Prisma initialization.",
  );
}
const pool = new Pool({
  connectionString,
  password: process.env.DB_PASSWORD
    ? String(process.env.DB_PASSWORD)
    : undefined,
});
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });
