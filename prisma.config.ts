import path from "path";
import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// const DB_USER = String(process.env.DB_USER || "user");
const DB_PASSWORD = String(process.env.DB_PASSWORD || "password");
// const DB_NAME = String(process.env.DB_NAME || "finance_db");

if (!DB_PASSWORD) {
  console.error("ERROR: DB_PASSWORD not found in .env file!");
}

// const databaseUrl = `postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}?schema=public`;

// console.log("Connecting to:", databaseUrl.replace(DB_PASSWORD, "****"));

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
