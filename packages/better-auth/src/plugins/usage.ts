import type { Commet } from "@commet/node";
import {
  APIError,
  createAuthEndpoint,
  sessionMiddleware,
} from "better-auth/api";
import { z } from "zod";

export type UsageConfig = Record<string, never>;

const TrackEventSchema = z.object({
  feature: z.string(),
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
                customerId: userId,
                featureCode: ctx.body.feature,
                value: ctx.body.value,
                properties: ctx.body.properties
                  ? Object.entries(ctx.body.properties).map(
                      ([property, value]) => ({ property, value }),
                    )
                  : undefined,
              },
              ctx.body.idempotencyKey
                ? { idempotencyKey: ctx.body.idempotencyKey }
                : undefined,
            );

            return ctx.json(result);
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
