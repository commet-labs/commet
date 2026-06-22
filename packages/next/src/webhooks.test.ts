import {
  Webhooks as CommetWebhooks,
  type WebhookEvent,
  type WebhookEventPayload,
} from "@commet/node";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { WebhookHandlerName, WebhooksConfig } from "./types";
import { Webhooks } from "./webhooks";

// Mock @commet/node
vi.mock("@commet/node", () => ({
  Webhooks: vi.fn(),
}));

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

const mockCommetWebhooks = vi.mocked(CommetWebhooks);

// Must stay a real function (not an arrow) so vitest can call it with `new CommetWebhooks()`.
function webhooksMock(verifyResult: boolean) {
  // biome-ignore lint/complexity/useArrowFunction: a constructable function is required here
  return function () {
    return {
      verify: vi.fn().mockReturnValue(verifyResult),
    } as unknown as InstanceType<typeof CommetWebhooks>;
  };
}

function createPayload(event: WebhookEvent): WebhookEventPayload {
  return {
    event,
    timestamp: "2024-01-01T00:00:00Z",
    organizationId: "org_123",
    mode: "sandbox",
    apiVersion: "2026-06-10",
    data: {},
  } as WebhookEventPayload;
}

function createRequest(payload: WebhookEventPayload | Record<string, unknown>) {
  return new NextRequest("https://example.com/webhooks", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "x-commet-signature": "sig" },
  });
}

describe("Webhooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the mock to return true by default
    mockCommetWebhooks.mockImplementation(webhooksMock(true));
  });

  describe("signature verification", () => {
    it("should verify webhook signature and process valid payloads", async () => {
      const mockHandler = vi.fn().mockResolvedValue(undefined);
      const webhookHandler = Webhooks({
        webhookSecret: "secret_123",
        onSubscriptionActivated: mockHandler,
      });
      const payload = createPayload("subscription.activated");

      const response = await webhookHandler(createRequest(payload));
      const data = (await response.json()) as { received: boolean };

      expect(response.status).toBe(200);
      expect(data.received).toBe(true);
      expect(mockHandler).toHaveBeenCalledWith(payload);
    });

    it("should return 403 for invalid signatures", async () => {
      // Mock verify to return false
      mockCommetWebhooks.mockImplementation(webhooksMock(false));

      const mockHandler = vi.fn();
      const webhookHandler = Webhooks({
        webhookSecret: "secret_123",
        onSubscriptionActivated: mockHandler,
      });

      const request = new NextRequest("https://example.com/webhooks", {
        method: "POST",
        body: JSON.stringify(createPayload("subscription.activated")),
        headers: {
          "x-commet-signature": "invalid_signature",
        },
      });

      const response = await webhookHandler(request);
      const data = (await response.json()) as {
        received: boolean;
        error?: string;
      };

      expect(response.status).toBe(403);
      expect(data.received).toBe(false);
      expect(data.error).toBe("Invalid signature");
      expect(mockHandler).not.toHaveBeenCalled();
    });

    it("should handle missing signature header", async () => {
      // Mock verify to return false for null signature
      mockCommetWebhooks.mockImplementation(webhooksMock(false));

      const webhookHandler = Webhooks({
        webhookSecret: "secret_123",
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
      expect(webhookHandlerCases).toHaveLength(56);
      expect(new Set(webhookHandlerCases.map(({ event }) => event)).size).toBe(
        56,
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
      const mockHandler = vi.fn().mockResolvedValue(undefined);
      const webhookHandler = Webhooks({
        webhookSecret: "secret_123",
        [handlerName]: mockHandler,
      } as WebhooksConfig);
      const payload = createPayload(event);

      const response = await webhookHandler(createRequest(payload));

      expect(response.status).toBe(200);
      expect(mockHandler).toHaveBeenCalledWith(payload);
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it("should not call handler for unregistered events", async () => {
      const activatedHandler = vi.fn().mockResolvedValue(undefined);
      const webhookHandler = Webhooks({
        webhookSecret: "secret_123",
        onSubscriptionActivated: activatedHandler,
      });
      const payload = createPayload("subscription.canceled");

      const response = await webhookHandler(createRequest(payload));

      expect(response.status).toBe(200);
      expect(activatedHandler).not.toHaveBeenCalled();
    });
  });

  describe("catch-all handler", () => {
    it("should call onPayload for all events", async () => {
      const onPayload = vi.fn().mockResolvedValue(undefined);
      const specificHandler = vi.fn().mockResolvedValue(undefined);

      const webhookHandler = Webhooks({
        webhookSecret: "secret_123",
        onPayload,
        onSubscriptionActivated: specificHandler,
      });
      const payload = createPayload("subscription.activated");

      await webhookHandler(createRequest(payload));

      expect(onPayload).toHaveBeenCalledWith(payload);
      expect(specificHandler).toHaveBeenCalledWith(payload);
    });

    it("should call onPayload even when no specific handler exists", async () => {
      const onPayload = vi.fn().mockResolvedValue(undefined);

      const webhookHandler = Webhooks({
        webhookSecret: "secret_123",
        onPayload,
      });
      const payload = createPayload("subscription.created");

      await webhookHandler(createRequest(payload));

      expect(onPayload).toHaveBeenCalledWith(payload);
    });
  });

  describe("error handling", () => {
    it("should return 400 for invalid JSON", async () => {
      const onError = vi.fn().mockResolvedValue(undefined);
      const webhookHandler = Webhooks({
        webhookSecret: "secret_123",
        onError,
      });

      const request = new NextRequest("https://example.com/webhooks", {
        method: "POST",
        body: "invalid json{",
        headers: { "x-commet-signature": "sig" },
      });

      const response = await webhookHandler(request);
      const data = (await response.json()) as {
        received: boolean;
        error?: string;
      };

      expect(response.status).toBe(400);
      expect(data.received).toBe(false);
      expect(data.error).toBe("Invalid payload");
      expect(onError).toHaveBeenCalled();
    });

    it("should call onError when handler throws", async () => {
      const handlerError = new Error("Handler failed");
      const mockHandler = vi.fn().mockRejectedValue(handlerError);
      const onError = vi.fn().mockResolvedValue(undefined);

      const webhookHandler = Webhooks({
        webhookSecret: "secret_123",
        onSubscriptionActivated: mockHandler,
        onError,
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
      expect(onError).toHaveBeenCalledWith(handlerError, payload);
    });

    it("should handle errors gracefully even when onError is not provided", async () => {
      const mockHandler = vi.fn().mockRejectedValue(new Error("Handler error"));

      const webhookHandler = Webhooks({
        webhookSecret: "secret_123",
        onSubscriptionActivated: mockHandler,
      });
      const payload = createPayload("subscription.activated");

      const response = await webhookHandler(createRequest(payload));

      expect(response.status).toBe(500);
    });
  });

  describe("parallel execution", () => {
    it("should execute onPayload and specific handler in parallel", async () => {
      const executionOrder: string[] = [];

      const onPayload = vi.fn().mockImplementation(async () => {
        executionOrder.push("onPayload-start");
        await new Promise((resolve) => setTimeout(resolve, 10));
        executionOrder.push("onPayload-end");
      });

      const specificHandler = vi.fn().mockImplementation(async () => {
        executionOrder.push("specific-start");
        await new Promise((resolve) => setTimeout(resolve, 10));
        executionOrder.push("specific-end");
      });

      const webhookHandler = Webhooks({
        webhookSecret: "secret_123",
        onPayload,
        onSubscriptionActivated: specificHandler,
      });
      const payload = createPayload("subscription.activated");

      await webhookHandler(createRequest(payload));

      expect(onPayload).toHaveBeenCalled();
      expect(specificHandler).toHaveBeenCalled();
      // Both should start before either ends (parallel execution)
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
        webhookSecret: "secret_123",
      });
      const payload = createPayload("subscription.activated");

      const response = await webhookHandler(createRequest(payload));
      const data = (await response.json()) as { received: boolean };

      expect(response.status).toBe(200);
      expect(data.received).toBe(true);
    });
  });
});
