import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { commet } from "./commet";
import { db } from "./db/connection";
import * as schema from "./db/schema";

// Get environment variables - use placeholders for build time
const authSecret =
  process.env.BETTER_AUTH_SECRET ||
  "build_time_placeholder_secret_change_in_production";
const authUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";

// Better Auth configuration with Drizzle
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Keep it simple for example
  },
  secret: authSecret,
  baseURL: authUrl,
  trustedOrigins: [authUrl],
  user: {
    // Create customer in Commet when user signs up
    additionalFields: {},
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          // Create customer in Commet automatically on signup
          try {
            await commet.customers.create({
              email: user.email,
              externalId: user.id,
              legalName: user.name || undefined,
            });
          } catch (error) {
            // Log but don't fail signup - customer can be created later
            console.error("Failed to create Commet customer on signup:", error);
          }
        },
      },
    },
  },
});

// Export types
export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
