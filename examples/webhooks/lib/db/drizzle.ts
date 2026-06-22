import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/lib/env";
import * as schema from "./schema";

dotenv.config();

export const client = postgres(env.POSTGRES_URL);
export const db = drizzle(client, { schema });
