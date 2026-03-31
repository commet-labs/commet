import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

dotenv.config();

const url =
  process.env.POSTGRES_URL ||
  "postgresql://postgres:postgres@localhost:5432/ai_saas";

export const client = postgres(url);
export const db = drizzle(client, { schema });
