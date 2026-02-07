import {
  commet,
  features,
  portal,
  seats,
  subscriptions,
} from "@commet/better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { commet as commetClient } from "../commet";
import { db } from "../db/drizzle";
import * as schema from "../db/schema";

const authSecret =
  process.env.BETTER_AUTH_SECRET ||
  "build_time_placeholder_secret_change_in_production";
const authUrl = process.env.BETTER_AUTH_URL || "http://localhost:3002";

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
    commet({
      client: commetClient,
      createCustomerOnSignUp: true,
      use: [
        portal({ returnUrl: "/dashboard/billing" }),
        subscriptions(),
        features(),
        seats(),
      ],
    }),
  ],
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            const [newWorkspace] = await db
              .insert(schema.workspace)
              .values({
                name: `${user.name || user.email}'s Workspace`,
                ownerId: user.id,
              })
              .returning();

            if (newWorkspace) {
              await db.insert(schema.member).values({
                workspaceId: newWorkspace.id,
                email: user.email,
                name: user.name,
                role: "owner",
                status: "active",
              });

              await commetClient.seats.set({
                externalId: user.id,
                seatType: "member",
                count: 1,
              });
            }
          } catch (error) {
            console.error(
              "Failed to create workspace resources on signup:",
              error,
            );
          }
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
