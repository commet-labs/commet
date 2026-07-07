import crypto from "node:crypto";
import { describe, expect, expectTypeOf, it } from "vitest";
import { type WebhookPayload, Webhooks } from "../resources/webhooks";
import type {
  CustomerStateChangedData,
  PaymentLinkCompletedData,
  PaymentLinkFailedData,
  PaymentRetryFailedData,
  SubscriptionReactivatedData,
  WebhookEvent,
  WebhookEventDataMap,
} from "../types/webhook-events";
import type { WebhookFeatureAccess, WebhookPlanRef } from "../types/models";

function signPayload(payload: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

const PLATFORM_WEBHOOK_EVENTS = [
  "subscription.created",
  "subscription.activated",
  "subscription.reactivated",
  "subscription.canceled",
  "subscription.updated",
  "subscription.plan_changed",
  "subscription.cancellation_scheduled",
  "subscription.cancellation_revoked",
  "subscription.plan_change_scheduled",
  "subscription.plan_change_revoked",
  "subscription.past_due",
  "trial.started",
  "trial.converted",
  "trial.expired",
  "trial.will_end",
  "trial.checkout_ready",
  "checkout.ready",
  "payment.received",
  "payment.failed",
  "payment.recovered",
  "payment.retry_failed",
  "payment.refunded",
  "payment.disputed",
  "payment.dispute_resolved",
  "payment_link.created",
  "payment_link.completed",
  "payment_link.failed",
  "payment_link.canceled",
  "invoice.created",
  "invoice.voided",
  "invoice.overdue",
  "invoice.upcoming",
  "payment_method.attached",
  "payment_method.updated",
  "customer.created",
  "customer.updated",
  "customer.state_changed",
  "credits.granted",
  "credits.purchased",
  "credits.low",
  "credits.depleted",
  "credits.expired",
  "balance.topped_up",
  "balance.low",
  "balance.depleted",
  "quota.threshold_reached",
  "quota.exceeded",
  "seats.updated",
  "seats.limit_reached",
  "addon.activated",
  "addon.deactivated",
  "usage.recorded",
  "payout.available",
  "payout.created",
  "payout.paid",
  "payout.failed",
] as const satisfies readonly WebhookEvent[];

type PlatformWebhookEvent = (typeof PLATFORM_WEBHOOK_EVENTS)[number];

describe("Webhooks", () => {
  const webhooks = new Webhooks();
  const secret = "whsec_test_secret_key_1234567890";
  const payload = JSON.stringify({
    event: "subscription.activated",
    timestamp: "2026-04-11T12:00:00Z",
    organizationId: "org_123",
    data: {
      subscriptionId: "sub_abc",
      customerId: "cus_456",
      status: "active",
    },
  });

  describe("verify", () => {
    it("accepts a valid signature", () => {
      const signature = signPayload(payload, secret);
      expect(webhooks.verify({ payload, signature, secret })).toBe(true);
    });

    it("rejects an invalid signature", () => {
      expect(
        webhooks.verify({
          payload,
          signature: "deadbeef".repeat(8),
          secret,
        }),
      ).toBe(false);
    });

    it("rejects a tampered payload", () => {
      const signature = signPayload(payload, secret);
      const tampered = payload.replace(
        "subscription.activated",
        "subscription.canceled",
      );

      expect(webhooks.verify({ payload: tampered, signature, secret })).toBe(
        false,
      );
    });

    it("rejects a wrong secret", () => {
      const signature = signPayload(payload, secret);

      expect(
        webhooks.verify({
          payload,
          signature,
          secret: "whsec_wrong_secret",
        }),
      ).toBe(false);
    });

    it("returns false when signature is null", () => {
      expect(webhooks.verify({ payload, signature: null, secret })).toBe(false);
    });

    it("returns false when secret is empty", () => {
      const signature = signPayload(payload, secret);
      expect(webhooks.verify({ payload, signature, secret: "" })).toBe(false);
    });

    it("returns false when payload is empty", () => {
      expect(webhooks.verify({ payload: "", signature: "abc", secret })).toBe(
        false,
      );
    });

    it("returns false for non-hex signature (catches timingSafeEqual throw)", () => {
      expect(
        webhooks.verify({
          payload,
          signature: "not-valid-hex!!",
          secret,
        }),
      ).toBe(false);
    });

    it("returns false for signature with wrong length", () => {
      expect(
        webhooks.verify({
          payload,
          signature: "abcdef",
          secret,
        }),
      ).toBe(false);
    });
  });

  describe("verifyAndParse", () => {
    it("returns parsed payload for valid signature", () => {
      const signature = signPayload(payload, secret);
      const result = webhooks.verifyAndParse({
        rawBody: payload,
        signature,
        secret,
      });

      expect(result).not.toBeNull();
      expectTypeOf(result).toEqualTypeOf<WebhookPayload | null>();
      expect(result?.event).toBe("subscription.activated");
      expect(result?.organizationId).toBe("org_123");
      expect(result?.data.customerId).toBe("cus_456");
    });

    it("returns null for invalid signature", () => {
      const result = webhooks.verifyAndParse({
        rawBody: payload,
        signature: "deadbeef".repeat(8),
        secret,
      });

      expect(result).toBeNull();
    });

    it("returns null for valid signature but invalid JSON body", () => {
      const badJson = "not json at all{{{";
      const signature = signPayload(badJson, secret);

      const result = webhooks.verifyAndParse({
        rawBody: badJson,
        signature,
        secret,
      });

      expect(result).toBeNull();
    });
  });

  describe("event narrowing and dispatch", () => {
    const stateChangedPayload = JSON.stringify({
      event: "customer.state_changed",
      timestamp: "2026-04-11T12:00:00Z",
      organizationId: "org_123",
      mode: "live",
      apiVersion: "2026-06-10",
      data: {
        customerId: "cus_456",
        trigger: "subscription_activated",
        status: "active",
        subscriptionId: "sub_abc",
        plan: { id: "plan_pro", name: "Pro" },
        billingInterval: "monthly",
        consumptionModel: "metered",
        features: [
          {
            code: "api_calls",
            name: "API Calls",
            type: "usage",
            allowed: true,
            enabled: null,
            current: 120,
            included: 1000,
            remaining: 880,
            overageQuantity: 0,
            overageUnitPrice: 50,
            unlimited: false,
            overageEnabled: true,
            billedQuantity: null,
          },
        ],
        seats: [],
        credits: null,
        balance: null,
      },
    });

    it("verifyAndParse stays wide; on() delivers the typed, narrowed data", async () => {
      const dispatcher = new Webhooks();
      let received: CustomerStateChangedData | undefined;
      dispatcher.on("customer.state_changed", (data, payload) => {
        expectTypeOf(data).toEqualTypeOf<CustomerStateChangedData>();
        expectTypeOf(data.features).toEqualTypeOf<WebhookFeatureAccess[]>();
        expectTypeOf(data.plan).toEqualTypeOf<WebhookPlanRef | null>();
        expectTypeOf(payload.data).toEqualTypeOf<CustomerStateChangedData>();
        received = data;
      });

      const result = await dispatcher.process({
        rawBody: stateChangedPayload,
        signature: signPayload(stateChangedPayload, secret),
        secret,
      });

      expectTypeOf(result).toEqualTypeOf<WebhookPayload | null>();
      expect(result?.event).toBe("customer.state_changed");
      expect(received?.features[0]?.code).toBe("api_calls");
      expect(received?.plan?.name).toBe("Pro");
    });

    it("covers the current Platform webhook catalog", () => {
      expect(PLATFORM_WEBHOOK_EVENTS).toHaveLength(56);
      expectTypeOf<PlatformWebhookEvent>().toEqualTypeOf<WebhookEvent>();
    });

    it("narrows Platform payment link and recovery additions", () => {
      const dispatcher = new Webhooks();

      dispatcher.on("payment_link.completed", (data, payload) => {
        expectTypeOf(data).toEqualTypeOf<PaymentLinkCompletedData>();
        expectTypeOf(payload.data).toEqualTypeOf<PaymentLinkCompletedData>();
        expectTypeOf(data.invoiceId).toEqualTypeOf<string>();
        expectTypeOf(data.paymentTransactionId).toEqualTypeOf<string | null>();
      });

      dispatcher.on("payment_link.failed", (data, payload) => {
        expectTypeOf(data).toEqualTypeOf<PaymentLinkFailedData>();
        expectTypeOf(payload.data).toEqualTypeOf<PaymentLinkFailedData>();
        expectTypeOf(data.failureCode).toEqualTypeOf<string>();
        expectTypeOf(data.failureMessage).toEqualTypeOf<string>();
      });

      dispatcher.on("subscription.reactivated", (data, payload) => {
        expectTypeOf(data).toEqualTypeOf<SubscriptionReactivatedData>();
        expectTypeOf(payload.data).toEqualTypeOf<SubscriptionReactivatedData>();
        expectTypeOf(data.invoiceTotal).toEqualTypeOf<number>();
      });

      dispatcher.on("payment.retry_failed", (data, payload) => {
        expectTypeOf(data).toEqualTypeOf<PaymentRetryFailedData>();
        expectTypeOf(payload.data).toEqualTypeOf<PaymentRetryFailedData>();
        expectTypeOf(data.reason).toEqualTypeOf<string>();
      });

      expectTypeOf<
        WebhookEventDataMap["payment_link.completed"]
      >().toEqualTypeOf<PaymentLinkCompletedData>();
      expectTypeOf<
        WebhookEventDataMap["payment.retry_failed"]
      >().toEqualTypeOf<PaymentRetryFailedData>();
    });

    it("process returns null and skips handlers on invalid signature", async () => {
      const dispatcher = new Webhooks();
      let called = false;
      dispatcher.on("customer.state_changed", () => {
        called = true;
      });

      const result = await dispatcher.process({
        rawBody: stateChangedPayload,
        signature: "deadbeef".repeat(8),
        secret,
      });

      expect(result).toBeNull();
      expect(called).toBe(false);
    });
  });
});
