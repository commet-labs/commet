import type { WebhookEvent, WebhookEventPayload } from "@commet/node";
import { Webhooks as CommetWebhooks } from "@commet/node";
import { type NextRequest, NextResponse } from "next/server";
import type { WebhookHandlerName, WebhooksConfig } from "./types";

const webhookEventHandlerNames = {
  "subscription.created": "onSubscriptionCreated",
  "subscription.activated": "onSubscriptionActivated",
  "subscription.reactivated": "onSubscriptionReactivated",
  "subscription.canceled": "onSubscriptionCanceled",
  "subscription.updated": "onSubscriptionUpdated",
  "subscription.plan_changed": "onSubscriptionPlanChanged",
  "subscription.cancellation_scheduled": "onSubscriptionCancellationScheduled",
  "subscription.cancellation_revoked": "onSubscriptionCancellationRevoked",
  "subscription.plan_change_scheduled": "onSubscriptionPlanChangeScheduled",
  "subscription.plan_change_revoked": "onSubscriptionPlanChangeRevoked",
  "subscription.past_due": "onSubscriptionPastDue",
  "trial.started": "onTrialStarted",
  "trial.converted": "onTrialConverted",
  "trial.expired": "onTrialExpired",
  "trial.will_end": "onTrialWillEnd",
  "trial.checkout_ready": "onTrialCheckoutReady",
  "checkout.ready": "onCheckoutReady",
  "payment.received": "onPaymentReceived",
  "payment.failed": "onPaymentFailed",
  "payment.recovered": "onPaymentRecovered",
  "payment.retry_failed": "onPaymentRetryFailed",
  "payment.refunded": "onPaymentRefunded",
  "payment.disputed": "onPaymentDisputed",
  "payment.dispute_resolved": "onPaymentDisputeResolved",
  "payment_link.created": "onPaymentLinkCreated",
  "payment_link.completed": "onPaymentLinkCompleted",
  "payment_link.failed": "onPaymentLinkFailed",
  "payment_link.canceled": "onPaymentLinkCanceled",
  "invoice.created": "onInvoiceCreated",
  "invoice.upcoming": "onInvoiceUpcoming",
  "invoice.overdue": "onInvoiceOverdue",
  "invoice.voided": "onInvoiceVoided",
  "payment_method.attached": "onPaymentMethodAttached",
  "payment_method.updated": "onPaymentMethodUpdated",
  "customer.created": "onCustomerCreated",
  "customer.updated": "onCustomerUpdated",
  "customer.state_changed": "onCustomerStateChanged",
  "credits.granted": "onCreditsGranted",
  "credits.purchased": "onCreditsPurchased",
  "credits.low": "onCreditsLow",
  "credits.depleted": "onCreditsDepleted",
  "credits.expired": "onCreditsExpired",
  "balance.topped_up": "onBalanceToppedUp",
  "balance.low": "onBalanceLow",
  "balance.depleted": "onBalanceDepleted",
  "quota.threshold_reached": "onQuotaThresholdReached",
  "quota.exceeded": "onQuotaExceeded",
  "usage.recorded": "onUsageRecorded",
  "seats.updated": "onSeatsUpdated",
  "seats.limit_reached": "onSeatsLimitReached",
  "addon.activated": "onAddonActivated",
  "addon.deactivated": "onAddonDeactivated",
  "payout.available": "onPayoutAvailable",
  "payout.created": "onPayoutCreated",
  "payout.paid": "onPayoutPaid",
  "payout.failed": "onPayoutFailed",
} as const satisfies Record<WebhookEvent, WebhookHandlerName>;

type RuntimeWebhookHandler = (payload: WebhookEventPayload) => Promise<void>;

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
  const { webhookSecret, onPayload, onError } = config;

  const webhooks = new CommetWebhooks();

  return async (request: NextRequest) => {
    try {
      const rawBody = await request.text();
      const signature = request.headers.get("x-commet-signature");

      const isValid = webhooks.verify({
        payload: rawBody,
        signature,
        secret: webhookSecret,
      });

      if (!isValid) {
        console.error("[Commet Webhook] Invalid signature");
        return NextResponse.json(
          { received: false, error: "Invalid signature" },
          { status: 403 },
        );
      }

      let payload: WebhookEventPayload;
      try {
        payload = JSON.parse(rawBody) as WebhookEventPayload;
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

      const promises: Promise<void>[] = [];

      if (onPayload) {
        promises.push(onPayload(payload));
      }

      const handlerName = webhookEventHandlerNames[payload.event];
      const handler = config[handlerName] as RuntimeWebhookHandler | undefined;
      if (handler) {
        promises.push(handler(payload));
      }

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
        return NextResponse.json(
          { received: false, error: "Handler failed" },
          { status: 500 },
        );
      }

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
