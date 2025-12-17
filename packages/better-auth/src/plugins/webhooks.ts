import type { Commet, WebhookEvent, WebhookPayload } from "@commet/node";
import { APIError, createAuthEndpoint } from "better-auth/api";

/**
 * Webhook handler function type
 */
export type WebhookHandler<T = WebhookPayload> = (payload: T) => Promise<void>;

/**
 * Webhooks plugin configuration
 *
 * Note: Webhooks are OPTIONAL in Commet. You can always query the current state
 * using subscriptions.get(), features.list(), etc. Webhooks are useful if you want
 * to react immediately to events without polling.
 */
export interface WebhooksConfig {
  /**
   * Webhook secret for signature verification
   */
  secret: string;
  /**
   * Handler for subscription.created events
   */
  onSubscriptionCreated?: WebhookHandler;
  /**
   * Handler for subscription.activated events
   */
  onSubscriptionActivated?: WebhookHandler;
  /**
   * Handler for subscription.canceled events
   */
  onSubscriptionCanceled?: WebhookHandler;
  /**
   * Handler for subscription.updated events
   */
  onSubscriptionUpdated?: WebhookHandler;
  /**
   * Generic handler for all webhook events (catch-all)
   */
  onPayload?: WebhookHandler;
}

/**
 * Map event types to their handler keys
 */
const EVENT_HANDLER_MAP: Record<WebhookEvent, keyof WebhooksConfig> = {
  "subscription.created": "onSubscriptionCreated",
  "subscription.activated": "onSubscriptionActivated",
  "subscription.canceled": "onSubscriptionCanceled",
  "subscription.updated": "onSubscriptionUpdated",
};

/**
 * Webhooks plugin - Handle incoming Commet webhooks (OPTIONAL)
 *
 * You can always query the current state directly:
 * - authClient.subscription.get() for subscription status
 * - authClient.features.list() for feature access
 * - authClient.features.canUse() for usage checks
 *
 * Webhooks are useful when you want to:
 * - React immediately to changes (e.g., send email on cancellation)
 * - Avoid polling latency in critical cases
 * - Audit/log events
 *
 * Endpoint:
 * - POST /commet/webhooks - Receive and process Commet webhooks
 */
export const webhooks = (config: WebhooksConfig) => (commet: Commet) => {
  return {
    commetWebhooks: createAuthEndpoint(
      "/commet/webhooks",
      {
        method: "POST",
        metadata: {
          isAction: false,
        },
        cloneRequest: true,
      },
      async (ctx) => {
        if (!ctx.request?.body) {
          throw new APIError("BAD_REQUEST", {
            message: "Request body is required",
          });
        }

        const rawBody = await ctx.request.text();
        const signature = ctx.request.headers.get("x-commet-signature");

        // Verify webhook signature
        const payload = commet.webhooks.verifyAndParse({
          rawBody,
          signature,
          secret: config.secret,
        });

        if (!payload) {
          ctx.context.logger.error("Invalid webhook signature");
          throw new APIError("UNAUTHORIZED", {
            message: "Invalid webhook signature",
          });
        }

        try {
          // Call specific event handler if configured
          const handlerKey = EVENT_HANDLER_MAP[payload.event];
          if (handlerKey) {
            const handler = config[handlerKey] as WebhookHandler | undefined;
            if (handler) {
              await handler(payload);
            }
          }

          // Always call onPayload if configured (catch-all)
          if (config.onPayload) {
            await config.onPayload(payload);
          }

          return ctx.json({ received: true });
        } catch (e: unknown) {
          if (e instanceof Error) {
            ctx.context.logger.error(
              `Commet webhook handler error: ${e.message}`,
            );
          } else {
            ctx.context.logger.error("Commet webhook handler error");
          }

          throw new APIError("INTERNAL_SERVER_ERROR", {
            message: "Webhook handler error",
          });
        }
      },
    ),
  };
};
