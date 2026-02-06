import {
  commet,
  features,
  portal,
  seats,
  subscriptions,
  usage,
} from "@commet/better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { commet as commetClient } from "../commet";
import { db } from "../db/drizzle";
import * as schema from "../db/schema";

// Get environment variables - use placeholders for build time
const authSecret =
  process.env.BETTER_AUTH_SECRET ||
  "build_time_placeholder_secret_change_in_production";
const authUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";

// Better Auth configuration with Commet plugin
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  secret: authSecret,
  baseURL: authUrl,
  trustedOrigins: [authUrl],
  plugins: [
    // Commet plugin handles customer sync automatically
    commet({
      client: commetClient,
      createCustomerOnSignUp: true,
      use: [
        // Customer portal for self-service billing management
        portal({ returnUrl: "/dashboard/billing" }),
        // Subscription management (get, change plan, cancel)
        subscriptions(),
        // Feature flags and access checks
        features(),
        // Usage tracking for metered billing
        usage(),
        // Seat management for team features
        seats(),
      ],
    }),
  ],
});

// Export types
export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
