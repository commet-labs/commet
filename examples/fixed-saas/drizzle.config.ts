import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load .env file
dotenv.config();

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ||
      "postgresql://postgres:postgres@localhost:5432/fixed_saas",
  },
});
