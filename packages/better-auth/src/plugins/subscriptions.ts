import type { Commet } from "@commet/node";
import { APIError, sessionMiddleware } from "better-auth/api";
import { createAuthEndpoint } from "better-auth/plugins";
import { z } from "zod";

export interface SubscriptionsConfig {
  /**
   * Optional plan mappings for easy slug-based plan changes
   */
  plans?: Array<{ planId: string; slug: string }>;
}

const ChangePlanSchema = z.object({
  planId: z.string().optional(),
  slug: z.string().optional(),
  billingInterval: z.enum(["monthly", "quarterly", "yearly"]).optional(),
});

const CancelSchema = z.object({
  reason: z.string().optional(),
  immediate: z.boolean().optional(),
});

/**
 * Subscriptions plugin - Manage customer subscriptions
 *
 * Endpoints:
 * - GET /subscription - Get active subscription for the authenticated user
 * - POST /subscription/change-plan - Change subscription plan (upgrade/downgrade)
 * - POST /subscription/cancel - Cancel the subscription
 */
export const subscriptions =
  (config: SubscriptionsConfig = {}) =>
  (commet: Commet) => {
    return {
      getSubscription: createAuthEndpoint(
        "/subscription",
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
            const subscription = await commet.subscriptions.get(userId);

            if (!subscription.success) {
              throw new APIError("INTERNAL_SERVER_ERROR", {
                message:
                  subscription.message || "Failed to retrieve subscription",
              });
            }

            return ctx.json(subscription.data ?? null);
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

      changePlan: createAuthEndpoint(
        "/subscription/change-plan",
        {
          method: "POST",
          body: ChangePlanSchema,
          use: [sessionMiddleware],
        },
        async (ctx) => {
          const userId = ctx.context.session?.user.id;

          if (!userId) {
            throw new APIError("UNAUTHORIZED", {
              message: "You must be logged in to change plan",
            });
          }

          // Resolve plan ID from slug if provided
          let planId = ctx.body.planId;
          if (ctx.body.slug && !planId) {
            const plan = config.plans?.find((p) => p.slug === ctx.body.slug);
            if (!plan) {
              throw new APIError("BAD_REQUEST", {
                message: `Plan with slug "${ctx.body.slug}" not found`,
              });
            }
            planId = plan.planId;
          }

          if (!planId) {
            throw new APIError("BAD_REQUEST", {
              message: "Either planId or slug must be provided",
            });
          }

          try {
            // First get the current subscription
            const currentSub = await commet.subscriptions.get(userId);

            if (!currentSub.success || !currentSub.data) {
              throw new APIError("BAD_REQUEST", {
                message: "No active subscription found",
              });
            }

            const result = await commet.subscriptions.changePlan({
              subscriptionId: currentSub.data.id,
              planId,
              billingInterval: ctx.body.billingInterval,
            });

            if (!result.success) {
              throw new APIError("INTERNAL_SERVER_ERROR", {
                message: result.message || "Failed to change plan",
              });
            }

            return ctx.json(result.data ?? null);
          } catch (e: unknown) {
            if (e instanceof APIError) {
              throw e;
            }

            if (e instanceof Error) {
              ctx.context.logger.error(
                `Commet plan change failed: ${e.message}`,
              );
            }

            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: "Failed to change plan",
            });
          }
        },
      ),

      cancelSubscription: createAuthEndpoint(
        "/subscription/cancel",
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
            const currentSub = await commet.subscriptions.get(userId);

            if (!currentSub.success || !currentSub.data) {
              throw new APIError("BAD_REQUEST", {
                message: "No active subscription found",
              });
            }

            const result = await commet.subscriptions.cancel({
              subscriptionId: currentSub.data.id,
              reason: ctx.body?.reason,
              immediate: ctx.body?.immediate,
            });

            if (!result.success) {
              throw new APIError("INTERNAL_SERVER_ERROR", {
                message: result.message || "Failed to cancel subscription",
              });
            }

            return ctx.json(result.data ?? null);
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
