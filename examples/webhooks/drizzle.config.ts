import * as dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config();

const postgresUrl = process.env.POSTGRES_URL;
if (!postgresUrl) {
  throw new Error("POSTGRES_URL is required");
}

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: postgresUrl,
  },
});
