import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("CRITICAL: DATABASE_URL is undefined.");
}

const pool = new Pool({
  connectionString,
  password: process.env.DB_PASSWORD
    ? String(process.env.DB_PASSWORD)
    : undefined,
});

const adapter = new PrismaPg(pool);

// Define the type for our global object
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Initialize the client only if it doesn't exist
export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

// Save it to global in development to prevent hot-reload crashes
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
