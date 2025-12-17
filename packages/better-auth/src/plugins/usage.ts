import type { Commet } from "@commet/node";
import { APIError, sessionMiddleware } from "better-auth/api";
import { createAuthEndpoint } from "better-auth/plugins";
import { z } from "zod";

export interface UsageConfig {
  // Reserved for future configuration options
}

const TrackEventSchema = z.object({
  eventType: z.string(),
  value: z.number().optional(),
  idempotencyKey: z.string().optional(),
  properties: z.record(z.string(), z.string()).optional(),
});

/**
 * Usage plugin - Track usage events for metered billing
 *
 * Endpoints:
 * - POST /usage/track - Track a usage event for the authenticated user
 */
export const usage =
  (_config: UsageConfig = {}) =>
  (commet: Commet) => {
    return {
      trackUsage: createAuthEndpoint(
        "/commet/usage/track",
        {
          method: "POST",
          body: TrackEventSchema,
          use: [sessionMiddleware],
        },
        async (ctx) => {
          const userId = ctx.context.session?.user.id;

          if (!userId) {
            throw new APIError("UNAUTHORIZED", {
              message: "You must be logged in to track usage",
            });
          }

          try {
            const result = await commet.usage.track(
              {
                externalId: userId,
                eventType: ctx.body.eventType,
                idempotencyKey: ctx.body.idempotencyKey,
                properties: ctx.body.properties,
              },
              {},
            );

            if (!result.success) {
              throw new APIError("INTERNAL_SERVER_ERROR", {
                message: result.message || "Failed to track usage",
              });
            }

            return ctx.json(result.data ?? null);
          } catch (e: unknown) {
            if (e instanceof APIError) {
              throw e;
            }

            if (e instanceof Error) {
              ctx.context.logger.error(
                `Commet usage track failed: ${e.message}`,
              );
            }

            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: "Failed to track usage",
            });
          }
        },
      ),
    };
  };
