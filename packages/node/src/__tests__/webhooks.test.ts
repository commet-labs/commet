import crypto from "node:crypto";
import { describe, expect, expectTypeOf, it } from "vitest";
import { Webhooks } from "../resources/webhooks";
import type { CustomerStateChangedData } from "../types/webhook-events";
import type {
  WebhookFeatureAccess,
  WebhookPlanRef,
} from "../types/webhook-shared";

function signPayload(payload: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

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
      expect(result?.event).toBe("subscription.activated");
      expect(result?.organizationId).toBe("org_123");
      if (result?.event === "subscription.activated") {
        expect(result.data.customerId).toBe("cus_456");
      }
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

    it("narrows data per event in a switch", () => {
      const result = webhooks.verifyAndParse({
        rawBody: stateChangedPayload,
        signature: signPayload(stateChangedPayload, secret),
        secret,
      });

      expect(result?.event).toBe("customer.state_changed");
      if (result?.event === "customer.state_changed") {
        expectTypeOf(result.data).toEqualTypeOf<CustomerStateChangedData>();
        expectTypeOf(result.data.features).toEqualTypeOf<
          WebhookFeatureAccess[]
        >();
        expectTypeOf(result.data.plan).toEqualTypeOf<WebhookPlanRef | null>();
        expect(result.data.features[0]?.code).toBe("api_calls");
        expect(result.data.plan?.name).toBe("Pro");
      }
    });

    it("dispatches to a typed handler via on/process", async () => {
      const dispatcher = new Webhooks();
      let receivedFeatures: WebhookFeatureAccess[] | undefined;
      dispatcher.on("customer.state_changed", (data) => {
        receivedFeatures = data.features;
      });

      const payload = await dispatcher.process({
        rawBody: stateChangedPayload,
        signature: signPayload(stateChangedPayload, secret),
        secret,
      });

      expect(payload?.event).toBe("customer.state_changed");
      expect(receivedFeatures?.[0]?.code).toBe("api_calls");
    });
  });
});
