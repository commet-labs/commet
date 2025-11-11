import Database from "better-sqlite3";

// Simple SQLite database setup
// Better Auth will manage the schema
export const db = new Database("./data/auth.db");

// Ensure the data directory exists
import { mkdirSync } from "node:fs";
try {
  mkdirSync("./data", { recursive: true });
} catch {
  // Directory already exists
}

