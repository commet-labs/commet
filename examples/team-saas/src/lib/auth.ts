import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { eq } from "drizzle-orm";
import { commet } from "./commet";
import { db } from "./db/connection";
import * as schema from "./db/schema";

// Get environment variables - use placeholders for build time
const authSecret =
  process.env.BETTER_AUTH_SECRET ||
  "build_time_placeholder_secret_change_in_production";
const authUrl = process.env.BETTER_AUTH_URL || "http://localhost:3001";

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
    additionalFields: {},
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            // 1. Create customer in Commet
            await commet.customers.create({
              email: user.email,
              externalId: user.id,
              legalName: user.name || undefined,
            });

            // 2. Create workspace for user
            const [newWorkspace] = await db
              .insert(schema.workspace)
              .values({
                name: `${user.name || user.email}'s Workspace`,
                ownerId: user.id,
              })
              .returning();

            // 3. Add owner as first member (consumes first seat)
            if (newWorkspace) {
              await db.insert(schema.member).values({
                workspaceId: newWorkspace.id,
                email: user.email,
                name: user.name,
                role: "owner",
                status: "active",
              });

              // 4. Initialize seat count in Commet (owner = 1 seat)
              await commet.seats.set({
                externalId: user.id,
                seatType: "member",
                count: 1,
              });
            }
          } catch (error) {
            // Log but don't fail signup - resources can be created later
            console.error(
              "Failed to create Commet resources on signup:",
              error,
            );
          }
        },
      },
    },
  },
});

// Export types
export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;

