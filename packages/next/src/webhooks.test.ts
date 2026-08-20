import crypto from "node:crypto";
import type { WebhookEvent, WebhookEventPayload } from "@commet/node";
import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import type { WebhookHandlerName, WebhooksConfig } from "./types";
import { Webhooks } from "./webhooks";

const webhookHandlerCases = [
  {
    event: "subscription.created",
    handlerName: "onSubscriptionCreated",
  },
  {
    event: "subscription.activated",
    handlerName: "onSubscriptionActivated",
  },
  {
    event: "subscription.reactivated",
    handlerName: "onSubscriptionReactivated",
  },
  {
    event: "subscription.canceled",
    handlerName: "onSubscriptionCanceled",
  },
  {
    event: "subscription.updated",
    handlerName: "onSubscriptionUpdated",
  },
  {
    event: "subscription.plan_changed",
    handlerName: "onSubscriptionPlanChanged",
  },
  {
    event: "subscription.cancellation_scheduled",
    handlerName: "onSubscriptionCancellationScheduled",
  },
  {
    event: "subscription.cancellation_revoked",
    handlerName: "onSubscriptionCancellationRevoked",
  },
  {
    event: "subscription.plan_change_scheduled",
    handlerName: "onSubscriptionPlanChangeScheduled",
  },
  {
    event: "subscription.plan_change_revoked",
    handlerName: "onSubscriptionPlanChangeRevoked",
  },
  {
    event: "subscription.past_due",
    handlerName: "onSubscriptionPastDue",
  },
  {
    event: "trial.started",
    handlerName: "onTrialStarted",
  },
  {
    event: "trial.converted",
    handlerName: "onTrialConverted",
  },
  {
    event: "trial.expired",
    handlerName: "onTrialExpired",
  },
  {
    event: "trial.will_end",
    handlerName: "onTrialWillEnd",
  },
  {
    event: "trial.checkout_ready",
    handlerName: "onTrialCheckoutReady",
  },
  {
    event: "checkout.ready",
    handlerName: "onCheckoutReady",
  },
  {
    event: "payment.received",
    handlerName: "onPaymentReceived",
  },
  {
    event: "payment.failed",
    handlerName: "onPaymentFailed",
  },
  {
    event: "payment.recovered",
    handlerName: "onPaymentRecovered",
  },
  {
    event: "payment.retry_failed",
    handlerName: "onPaymentRetryFailed",
  },
  {
    event: "payment.refunded",
    handlerName: "onPaymentRefunded",
  },
  {
    event: "payment.disputed",
    handlerName: "onPaymentDisputed",
  },
  {
    event: "payment.dispute_resolved",
    handlerName: "onPaymentDisputeResolved",
  },
  {
    event: "payment_link.created",
    handlerName: "onPaymentLinkCreated",
  },
  {
    event: "payment_link.completed",
    handlerName: "onPaymentLinkCompleted",
  },
  {
    event: "payment_link.failed",
    handlerName: "onPaymentLinkFailed",
  },
  {
    event: "payment_link.canceled",
    handlerName: "onPaymentLinkCanceled",
  },
  {
    event: "invoice.created",
    handlerName: "onInvoiceCreated",
  },
  {
    event: "invoice.upcoming",
    handlerName: "onInvoiceUpcoming",
  },
  {
    event: "invoice.overdue",
    handlerName: "onInvoiceOverdue",
  },
  {
    event: "invoice.voided",
    handlerName: "onInvoiceVoided",
  },
  {
    event: "payment_method.attached",
    handlerName: "onPaymentMethodAttached",
  },
  {
    event: "payment_method.updated",
    handlerName: "onPaymentMethodUpdated",
  },
  {
    event: "customer.created",
    handlerName: "onCustomerCreated",
  },
  {
    event: "customer.updated",
    handlerName: "onCustomerUpdated",
  },
  {
    event: "customer.state_changed",
    handlerName: "onCustomerStateChanged",
  },
  {
    event: "plan_grant.created",
    handlerName: "onPlanGrantCreated",
  },
  {
    event: "plan_grant.updated",
    handlerName: "onPlanGrantUpdated",
  },
  {
    event: "plan_grant.expired",
    handlerName: "onPlanGrantExpired",
  },
  {
    event: "plan_grant.revoked",
    handlerName: "onPlanGrantRevoked",
  },
  {
    event: "credits.granted",
    handlerName: "onCreditsGranted",
  },
  {
    event: "credits.purchased",
    handlerName: "onCreditsPurchased",
  },
  {
    event: "credits.low",
    handlerName: "onCreditsLow",
  },
  {
    event: "credits.depleted",
    handlerName: "onCreditsDepleted",
  },
  {
    event: "credits.expired",
    handlerName: "onCreditsExpired",
  },
  {
    event: "balance.topped_up",
    handlerName: "onBalanceToppedUp",
  },
  {
    event: "balance.low",
    handlerName: "onBalanceLow",
  },
  {
    event: "balance.depleted",
    handlerName: "onBalanceDepleted",
  },
  {
    event: "quota.threshold_reached",
    handlerName: "onQuotaThresholdReached",
  },
  {
    event: "quota.exceeded",
    handlerName: "onQuotaExceeded",
  },
  {
    event: "usage.recorded",
    handlerName: "onUsageRecorded",
  },
  {
    event: "seats.updated",
    handlerName: "onSeatsUpdated",
  },
  {
    event: "seats.limit_reached",
    handlerName: "onSeatsLimitReached",
  },
  {
    event: "addon.activated",
    handlerName: "onAddonActivated",
  },
  {
    event: "addon.deactivated",
    handlerName: "onAddonDeactivated",
  },
  {
    event: "payout.available",
    handlerName: "onPayoutAvailable",
  },
  {
    event: "payout.created",
    handlerName: "onPayoutCreated",
  },
  {
    event: "payout.paid",
    handlerName: "onPayoutPaid",
  },
  {
    event: "payout.failed",
    handlerName: "onPayoutFailed",
  },
] as const satisfies readonly {
  event: WebhookEvent;
  handlerName: WebhookHandlerName;
}[];

type CoveredWebhookEvent = (typeof webhookHandlerCases)[number]["event"];
type MissingWebhookEvent = Exclude<WebhookEvent, CoveredWebhookEvent>;
type ExtraWebhookEvent = Exclude<CoveredWebhookEvent, WebhookEvent>;
type ConfigNamedWebhookHandlerName = Exclude<
  Extract<keyof WebhooksConfig, `on${string}`>,
  "onError" | "onPayload"
>;
type MissingWebhookHandlerName = Exclude<
  WebhookHandlerName,
  ConfigNamedWebhookHandlerName
>;
type ExtraWebhookHandlerName = Exclude<
  ConfigNamedWebhookHandlerName,
  WebhookHandlerName
>;

const webhookEventCoverage: [MissingWebhookEvent, ExtraWebhookEvent] extends [
  never,
  never,
]
  ? true
  : never = true;
const webhookHandlerCoverage: [
  MissingWebhookHandlerName,
  ExtraWebhookHandlerName,
] extends [never, never]
  ? true
  : never = true;

const webhookSecret = "secret_123";

function createPayload(event: WebhookEvent): WebhookEventPayload {
  return {
    event,
    timestamp: "2024-01-01T00:00:00Z",
    organizationId: "org_123",
    mode: "sandbox",
    apiVersion: "2026-07-31",
    data: {},
  } as WebhookEventPayload;
}

function createRequest(payload: WebhookEventPayload | Record<string, unknown>) {
  return createRawRequest(JSON.stringify(payload));
}

function createRawRequest(rawBody: string, signature = signPayload(rawBody)) {
  return new NextRequest("https://example.com/webhooks", {
    method: "POST",
    body: rawBody,
    headers: { "x-commet-signature": signature },
  });
}

function signPayload(rawBody: string): string {
  return crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");
}

describe("Webhooks", () => {
  describe("signature verification", () => {
    it("should verify webhook signature and process valid payloads", async () => {
      let receivedPayload: WebhookEventPayload | undefined;
      const webhookHandler = Webhooks({
        webhookSecret,
        onSubscriptionActivated: async (payload) => {
          receivedPayload = payload;
        },
      });
      const payload = createPayload("subscription.activated");

      const response = await webhookHandler(createRequest(payload));
      const data = (await response.json()) as { received: boolean };

      expect(response.status).toBe(200);
      expect(data.received).toBe(true);
      expect(receivedPayload).toEqual(payload);
    });

    it("should return 403 for invalid signatures", async () => {
      let handlerCalled = false;
      const webhookHandler = Webhooks({
        webhookSecret,
        onSubscriptionActivated: async () => {
          handlerCalled = true;
        },
      });
      const payload = createPayload("subscription.activated");
      const rawBody = JSON.stringify(payload);

      const response = await webhookHandler(
        createRawRequest(rawBody, "invalid_signature"),
      );
      const data = (await response.json()) as {
        received: boolean;
        error?: string;
      };

      expect(response.status).toBe(403);
      expect(data.received).toBe(false);
      expect(data.error).toBe("Invalid signature");
      expect(handlerCalled).toBe(false);
    });

    it("should handle missing signature header", async () => {
      const webhookHandler = Webhooks({
        webhookSecret,
      });

      const request = new NextRequest("https://example.com/webhooks", {
        method: "POST",
        body: JSON.stringify(createPayload("subscription.activated")),
      });

      const response = await webhookHandler(request);
      const data = (await response.json()) as { received: boolean };

      expect(response.status).toBe(403);
      expect(data.received).toBe(false);
    });
  });

  describe("event routing", () => {
    it("should cover every typed webhook event and named handler", () => {
      expect(webhookHandlerCases).toHaveLength(60);
      expect(new Set(webhookHandlerCases.map(({ event }) => event)).size).toBe(
        60,
      );
      expect(webhookEventCoverage).toBe(true);
      expect(webhookHandlerCoverage).toBe(true);
    });

    it.each(
      webhookHandlerCases,
    )("should route $event events to $handlerName", async ({
      event,
      handlerName,
    }) => {
      let receivedPayload: WebhookEventPayload | undefined;
      let callCount = 0;
      const webhookHandler = Webhooks({
        webhookSecret,
        [handlerName]: async (payload: WebhookEventPayload) => {
          receivedPayload = payload;
          callCount += 1;
        },
      } as WebhooksConfig);
      const payload = createPayload(event);

      const response = await webhookHandler(createRequest(payload));

      expect(response.status).toBe(200);
      expect(receivedPayload).toEqual(payload);
      expect(callCount).toBe(1);
    });

    it("should not call handler for unregistered events", async () => {
      let activatedHandlerCalled = false;
      const webhookHandler = Webhooks({
        webhookSecret,
        onSubscriptionActivated: async () => {
          activatedHandlerCalled = true;
        },
      });
      const payload = createPayload("subscription.canceled");

      const response = await webhookHandler(createRequest(payload));

      expect(response.status).toBe(200);
      expect(activatedHandlerCalled).toBe(false);
    });
  });

  describe("catch-all handler", () => {
    it("should call onPayload for all events", async () => {
      let catchAllPayload: WebhookEventPayload | undefined;
      let specificPayload: WebhookEventPayload | undefined;

      const webhookHandler = Webhooks({
        webhookSecret,
        onPayload: async (payload) => {
          catchAllPayload = payload;
        },
        onSubscriptionActivated: async (payload) => {
          specificPayload = payload;
        },
      });
      const payload = createPayload("subscription.activated");

      await webhookHandler(createRequest(payload));

      expect(catchAllPayload).toEqual(payload);
      expect(specificPayload).toEqual(payload);
    });

    it("should call onPayload even when no specific handler exists", async () => {
      let receivedPayload: WebhookEventPayload | undefined;

      const webhookHandler = Webhooks({
        webhookSecret,
        onPayload: async (payload) => {
          receivedPayload = payload;
        },
      });
      const payload = createPayload("subscription.created");

      await webhookHandler(createRequest(payload));

      expect(receivedPayload).toEqual(payload);
    });
  });

  describe("error handling", () => {
    it("should return 400 for invalid JSON", async () => {
      let capturedError: Error | undefined;
      const webhookHandler = Webhooks({
        webhookSecret,
        onError: async (error) => {
          capturedError = error;
        },
      });

      const request = createRawRequest("invalid json{");

      const response = await webhookHandler(request);
      const data = (await response.json()) as {
        received: boolean;
        error?: string;
      };

      expect(response.status).toBe(400);
      expect(data.received).toBe(false);
      expect(data.error).toBe("Invalid payload");
      expect(capturedError).toBeInstanceOf(Error);
    });

    it("should call onError when handler throws", async () => {
      const handlerError = new Error("Handler failed");
      let capturedError: Error | undefined;
      let capturedPayload: unknown;

      const webhookHandler = Webhooks({
        webhookSecret,
        onSubscriptionActivated: async () => {
          throw handlerError;
        },
        onError: async (error, payload) => {
          capturedError = error;
          capturedPayload = payload;
        },
      });
      const payload = createPayload("subscription.activated");

      const response = await webhookHandler(createRequest(payload));
      const data = (await response.json()) as {
        received: boolean;
        error?: string;
      };

      expect(response.status).toBe(500);
      expect(data.received).toBe(false);
      expect(data.error).toBe("Handler failed");
      expect(capturedError).toBe(handlerError);
      expect(capturedPayload).toEqual(payload);
    });

    it("should handle errors gracefully even when onError is not provided", async () => {
      const webhookHandler = Webhooks({
        webhookSecret,
        onSubscriptionActivated: async () => {
          throw new Error("Handler error");
        },
      });
      const payload = createPayload("subscription.activated");

      const response = await webhookHandler(createRequest(payload));

      expect(response.status).toBe(500);
    });
  });

  describe("parallel execution", () => {
    it("should execute onPayload and specific handler in parallel", async () => {
      const executionOrder: string[] = [];

      const onPayload = async () => {
        executionOrder.push("onPayload-start");
        await new Promise((resolve) => setTimeout(resolve, 10));
        executionOrder.push("onPayload-end");
      };

      const specificHandler = async () => {
        executionOrder.push("specific-start");
        await new Promise((resolve) => setTimeout(resolve, 10));
        executionOrder.push("specific-end");
      };

      const webhookHandler = Webhooks({
        webhookSecret,
        onPayload,
        onSubscriptionActivated: specificHandler,
      });
      const payload = createPayload("subscription.activated");

      await webhookHandler(createRequest(payload));

      expect(executionOrder.indexOf("onPayload-start")).toBeLessThan(
        executionOrder.indexOf("specific-end"),
      );
      expect(executionOrder.indexOf("specific-start")).toBeLessThan(
        executionOrder.indexOf("onPayload-end"),
      );
    });
  });

  describe("minimal configuration", () => {
    it("should work with only webhookSecret", async () => {
      const webhookHandler = Webhooks({
        webhookSecret,
      });
      const payload = createPayload("subscription.activated");

      const response = await webhookHandler(createRequest(payload));
      const data = (await response.json()) as { received: boolean };

      expect(response.status).toBe(200);
      expect(data.received).toBe(true);
    });
  });
});
