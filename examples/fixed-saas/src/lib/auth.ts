import { betterAuth } from "better-auth";
import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";

// Get environment variables - use placeholders for build time
const authSecret =
  process.env.BETTER_AUTH_SECRET ||
  "build_time_placeholder_secret_change_in_production";
const authUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";

// Ensure data directory exists
try {
  mkdirSync("./data", { recursive: true });
} catch (error) {
  // Directory already exists or can't be created (build time)
}

// Create SQLite database
const db = new Database("./data/auth.db");

// Better Auth configuration
export const auth = betterAuth({
  database: {
    type: "sqlite",
    db,
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Keep it simple for example
  },
  secret: authSecret,
  baseURL: authUrl,
  trustedOrigins: [authUrl],
  user: {
    additionalFields: {
      commetCustomerId: {
        type: "string",
        required: false,
      },
      subscriptionId: {
        type: "string",
        required: false,
      },
      isPaid: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
    },
  },
});

// Export types
export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
