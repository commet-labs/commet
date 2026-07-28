import type { Commet } from "@commet/node";
import {
  APIError,
  createAuthEndpoint,
  sessionMiddleware,
} from "better-auth/api";
import { z } from "zod";

export interface SubscriptionsConfig {
  /**
   * Optional plan mappings for easy slug-based plan changes
   */
  plans?: Array<{ planId: string; slug: string }>;
}

const CancelSchema = z.object({
  reason: z.string().optional(),
  immediate: z.boolean().optional(),
});

/**
 * Subscriptions plugin - Manage customer subscriptions
 *
 * Endpoints:
 * - GET /subscription - Get active subscription for the authenticated user
 * - POST /subscription/cancel - Cancel the subscription
 */
export const subscriptions =
  (_config: SubscriptionsConfig = {}) =>
  (commet: Commet) => {
    return {
      getSubscription: createAuthEndpoint(
        "/commet/subscription",
        {
          method: "GET",
          use: [sessionMiddleware],
        },
        async (ctx) => {
          const userId = ctx.context.session?.user.id;

          if (!userId) {
            throw new APIError("UNAUTHORIZED", {
              message: "You must be logged in to view subscription",
            });
          }

          try {
            const subscription = await commet.subscriptions.getActive({
              customerId: userId,
            });

            return ctx.json(subscription);
          } catch (e: unknown) {
            if (e instanceof APIError) {
              throw e;
            }

            if (e instanceof Error) {
              ctx.context.logger.error(
                `Commet subscription get failed: ${e.message}`,
              );
            }

            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: "Failed to retrieve subscription",
            });
          }
        },
      ),

      cancelSubscription: createAuthEndpoint(
        "/commet/subscription/cancel",
        {
          method: "POST",
          body: CancelSchema.optional(),
          use: [sessionMiddleware],
        },
        async (ctx) => {
          const userId = ctx.context.session?.user.id;

          if (!userId) {
            throw new APIError("UNAUTHORIZED", {
              message: "You must be logged in to cancel subscription",
            });
          }

          try {
            // First get the current subscription
            const currentSub = await commet.subscriptions.getActive({
              customerId: userId,
            });

            if (!currentSub) {
              throw new APIError("BAD_REQUEST", {
                message: "No active subscription found",
              });
            }

            const result = await commet.subscriptions.cancel({
              id: currentSub.id,
              reason: ctx.body?.reason,
              immediate: ctx.body?.immediate,
            });

            return ctx.json(result);
          } catch (e: unknown) {
            if (e instanceof APIError) {
              throw e;
            }

            if (e instanceof Error) {
              ctx.context.logger.error(
                `Commet subscription cancel failed: ${e.message}`,
              );
            }

            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: "Failed to cancel subscription",
            });
          }
        },
      ),
    };
  };
