import {
  commet as commetPlugin,
  features,
  portal,
  subscriptions,
  usage,
} from "@commet/better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { commet } from "../commet";
import { db } from "../db/drizzle";
import * as schema from "../db/schema";

const authSecret =
  process.env.BETTER_AUTH_SECRET ||
  "build_time_placeholder_secret_change_in_production";
const authUrl = process.env.BETTER_AUTH_URL || "http://localhost:3005";

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
    commetPlugin({
      client: commet,
      createCustomerOnSignUp: true,
      use: [
        portal({ returnUrl: "/dashboard/billing" }),
        subscriptions(),
        features(),
        usage(),
      ],
    }),
  ],
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
