import { Webhooks as CommetWebhooks } from "@commet/node";
import type { WebhookPayload } from "@commet/node";
import { type NextRequest, NextResponse } from "next/server";
import type { WebhooksConfig } from "./types";

/**
 * Create a Next.js webhook handler for Commet events
 *
 * Automatically verifies signatures, routes events to handlers, and returns proper responses.
 *
 * @param config - Webhook configuration with secret and event handlers
 * @returns Next.js route handler function
 *
 * @example
 * ```typescript
 * // app/api/webhooks/commet/route.ts
 * import { Webhooks } from "@commet/next";
 *
 * export const POST = Webhooks({
 *   webhookSecret: process.env.COMMET_WEBHOOK_SECRET!,
 *   onSubscriptionActivated: async (payload) => {
 *     // Grant access to user
 *   },
 *   onSubscriptionCanceled: async (payload) => {
 *     // Revoke access from user
 *   },
 * });
 * ```
 */
export const Webhooks = (config: WebhooksConfig) => {
  const {
    webhookSecret,
    onSubscriptionActivated,
    onSubscriptionCanceled,
    onSubscriptionCreated,
    onSubscriptionUpdated,
    onPayload,
    onError,
  } = config;

  // Create webhook verifier instance
  const webhooks = new CommetWebhooks();

  return async (request: NextRequest) => {
    try {
      // 1. Read raw request body
      const rawBody = await request.text();

      // 2. Extract signature from headers
      const signature = request.headers.get("x-commet-signature");

      // 3. Verify signature
      const isValid = webhooks.verify({ payload: rawBody, signature, secret: webhookSecret });

      if (!isValid) {
        console.error("[Commet Webhook] Invalid signature");
        return NextResponse.json(
          { received: false, error: "Invalid signature" },
          { status: 403 },
        );
      }

      // 4. Parse payload
      let payload: WebhookPayload;
      try {
        payload = JSON.parse(rawBody) as WebhookPayload;
      } catch (parseError) {
        console.error("[Commet Webhook] Failed to parse payload:", parseError);
        if (onError) {
          await onError(
            parseError instanceof Error
              ? parseError
              : new Error("Failed to parse webhook payload"),
            rawBody,
          );
        }
        return NextResponse.json(
          { received: false, error: "Invalid payload" },
          { status: 400 },
        );
      }

      // 5. Collect promises for parallel execution
      const promises: Promise<void>[] = [];

      // Call catch-all handler if provided
      if (onPayload) {
        promises.push(onPayload(payload));
      }

      // 6. Route to specific event handler
      switch (payload.event) {
        case "subscription.activated":
          if (onSubscriptionActivated) {
            promises.push(onSubscriptionActivated(payload));
          }
          break;

        case "subscription.canceled":
          if (onSubscriptionCanceled) {
            promises.push(onSubscriptionCanceled(payload));
          }
          break;

        case "subscription.created":
          if (onSubscriptionCreated) {
            promises.push(onSubscriptionCreated(payload));
          }
          break;

        case "subscription.updated":
          if (onSubscriptionUpdated) {
            promises.push(onSubscriptionUpdated(payload));
          }
          break;

        default:
          console.log(`[Commet Webhook] Unhandled event: ${payload.event}`);
      }

      // 7. Execute all handlers in parallel
      try {
        await Promise.all(promises);
      } catch (handlerError) {
        console.error(
          "[Commet Webhook] Handler error:",
          handlerError instanceof Error ? handlerError.message : handlerError,
        );
        if (onError) {
          await onError(
            handlerError instanceof Error
              ? handlerError
              : new Error("Handler execution failed"),
            payload,
          );
        }
        // Still return 200 to prevent retries for handler errors
        return NextResponse.json(
          { received: true, warning: "Handler failed" },
          { status: 200 },
        );
      }

      // 8. Success response
      return NextResponse.json({ received: true }, { status: 200 });
    } catch (error) {
      console.error("[Commet Webhook] Unexpected error:", error);
      if (onError) {
        try {
          await onError(
            error instanceof Error ? error : new Error("Unexpected error"),
            undefined,
          );
        } catch (errorHandlerError) {
          console.error(
            "[Commet Webhook] Error handler failed:",
            errorHandlerError,
          );
        }
      }
      return NextResponse.json(
        { received: false, error: "Internal error" },
        { status: 500 },
      );
    }
  };
};
