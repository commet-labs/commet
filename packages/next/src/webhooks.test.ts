import { Webhooks as CommetWebhooks } from "@commet/node";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Webhooks } from "./webhooks";

// Mock @commet/node
vi.mock("@commet/node", () => ({
  Webhooks: vi.fn().mockImplementation(() => ({
    verify: vi.fn().mockReturnValue(true),
  })),
}));

const mockCommetWebhooks = vi.mocked(CommetWebhooks);

describe("Webhooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the mock to return true by default
    mockCommetWebhooks.mockImplementation(
      () =>
        ({
          verify: vi.fn().mockReturnValue(true),
        }) as unknown as InstanceType<typeof CommetWebhooks>,
    );
  });

  describe("signature verification", () => {
    it("should verify webhook signature and process valid payloads", async () => {
      const mockHandler = vi.fn().mockResolvedValue(undefined);
      const webhookHandler = Webhooks({
        webhookSecret: "secret_123",
        onSubscriptionActivated: mockHandler,
      });

      const payload = {
        event: "subscription.activated",
        timestamp: "2024-01-01T00:00:00Z",
        organizationId: "org_123",
        data: {
          subscriptionId: "sub_123",
          customerId: "cus_123",
          status: "active",
        },
      };

      const request = new NextRequest("https://example.com/webhooks", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "x-commet-signature": "valid_signature",
        },
      });

      const response = await webhookHandler(request);
      const data = (await response.json()) as { received: boolean };

      expect(response.status).toBe(200);
      expect(data.received).toBe(true);
      expect(mockHandler).toHaveBeenCalledWith(payload);
    });

    it("should return 403 for invalid signatures", async () => {
      // Mock verify to return false
      mockCommetWebhooks.mockImplementation(
        () =>
          ({
            verify: vi.fn().mockReturnValue(false),
          }) as unknown as InstanceType<typeof CommetWebhooks>,
      );

      const mockHandler = vi.fn();
      const webhookHandler = Webhooks({
        webhookSecret: "secret_123",
        onSubscriptionActivated: mockHandler,
      });

      const request = new NextRequest("https://example.com/webhooks", {
        method: "POST",
        body: JSON.stringify({ event: "subscription.activated" }),
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
      mockCommetWebhooks.mockImplementation(
        () =>
          ({
            verify: vi.fn().mockReturnValue(false),
          }) as unknown as InstanceType<typeof CommetWebhooks>,
      );

      const webhookHandler = Webhooks({
        webhookSecret: "secret_123",
      });

      const request = new NextRequest("https://example.com/webhooks", {
        method: "POST",
        body: JSON.stringify({ event: "subscription.activated" }),
      });

      const response = await webhookHandler(request);
      const data = (await response.json()) as { received: boolean };

      expect(response.status).toBe(403);
      expect(data.received).toBe(false);
    });
  });

  describe("event routing", () => {
    it("should route subscription.activated events", async () => {
      const mockHandler = vi.fn().mockResolvedValue(undefined);
      const webhookHandler = Webhooks({
        webhookSecret: "secret_123",
        onSubscriptionActivated: mockHandler,
      });

      const payload = {
        event: "subscription.activated",
        timestamp: "2024-01-01T00:00:00Z",
        organizationId: "org_123",
        data: { subscriptionId: "sub_123" },
      };

      const request = new NextRequest("https://example.com/webhooks", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "x-commet-signature": "sig" },
      });

      await webhookHandler(request);

      expect(mockHandler).toHaveBeenCalledWith(payload);
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it("should route subscription.canceled events", async () => {
      const mockHandler = vi.fn().mockResolvedValue(undefined);
      const webhookHandler = Webhooks({
        webhookSecret: "secret_123",
        onSubscriptionCanceled: mockHandler,
      });

      const payload = {
        event: "subscription.canceled",
        timestamp: "2024-01-01T00:00:00Z",
        organizationId: "org_123",
        data: { subscriptionId: "sub_123" },
      };

      const request = new NextRequest("https://example.com/webhooks", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "x-commet-signature": "sig" },
      });

      await webhookHandler(request);

      expect(mockHandler).toHaveBeenCalledWith(payload);
    });

    it("should route subscription.created events", async () => {
      const mockHandler = vi.fn().mockResolvedValue(undefined);
      const webhookHandler = Webhooks({
        webhookSecret: "secret_123",
        onSubscriptionCreated: mockHandler,
      });

      const payload = {
        event: "subscription.created",
        timestamp: "2024-01-01T00:00:00Z",
        organizationId: "org_123",
        data: { subscriptionId: "sub_123" },
      };

      const request = new NextRequest("https://example.com/webhooks", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "x-commet-signature": "sig" },
      });

      await webhookHandler(request);

      expect(mockHandler).toHaveBeenCalledWith(payload);
    });

    it("should route subscription.updated events", async () => {
      const mockHandler = vi.fn().mockResolvedValue(undefined);
      const webhookHandler = Webhooks({
        webhookSecret: "secret_123",
        onSubscriptionUpdated: mockHandler,
      });

      const payload = {
        event: "subscription.updated",
        timestamp: "2024-01-01T00:00:00Z",
        organizationId: "org_123",
        data: { subscriptionId: "sub_123" },
      };

      const request = new NextRequest("https://example.com/webhooks", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "x-commet-signature": "sig" },
      });

      await webhookHandler(request);

      expect(mockHandler).toHaveBeenCalledWith(payload);
    });

    it("should not call handler for unregistered events", async () => {
      const activatedHandler = vi.fn().mockResolvedValue(undefined);
      const webhookHandler = Webhooks({
        webhookSecret: "secret_123",
        onSubscriptionActivated: activatedHandler,
      });

      const payload = {
        event: "subscription.canceled",
        timestamp: "2024-01-01T00:00:00Z",
        organizationId: "org_123",
        data: { subscriptionId: "sub_123" },
      };

      const request = new NextRequest("https://example.com/webhooks", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "x-commet-signature": "sig" },
      });

      const response = await webhookHandler(request);

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

      const payload = {
        event: "subscription.activated",
        timestamp: "2024-01-01T00:00:00Z",
        organizationId: "org_123",
        data: { subscriptionId: "sub_123" },
      };

      const request = new NextRequest("https://example.com/webhooks", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "x-commet-signature": "sig" },
      });

      await webhookHandler(request);

      expect(onPayload).toHaveBeenCalledWith(payload);
      expect(specificHandler).toHaveBeenCalledWith(payload);
    });

    it("should call onPayload even when no specific handler exists", async () => {
      const onPayload = vi.fn().mockResolvedValue(undefined);

      const webhookHandler = Webhooks({
        webhookSecret: "secret_123",
        onPayload,
      });

      const payload = {
        event: "subscription.created",
        timestamp: "2024-01-01T00:00:00Z",
        organizationId: "org_123",
        data: { subscriptionId: "sub_123" },
      };

      const request = new NextRequest("https://example.com/webhooks", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "x-commet-signature": "sig" },
      });

      await webhookHandler(request);

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

      const payload = {
        event: "subscription.activated",
        timestamp: "2024-01-01T00:00:00Z",
        organizationId: "org_123",
        data: { subscriptionId: "sub_123" },
      };

      const request = new NextRequest("https://example.com/webhooks", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "x-commet-signature": "sig" },
      });

      const response = await webhookHandler(request);
      const data = (await response.json()) as {
        received: boolean;
        warning?: string;
      };

      // Should still return 200 to prevent retries
      expect(response.status).toBe(200);
      expect(data.received).toBe(true);
      expect(data.warning).toBe("Handler failed");
      expect(onError).toHaveBeenCalledWith(handlerError, payload);
    });

    it("should handle errors gracefully even when onError is not provided", async () => {
      const mockHandler = vi.fn().mockRejectedValue(new Error("Handler error"));

      const webhookHandler = Webhooks({
        webhookSecret: "secret_123",
        onSubscriptionActivated: mockHandler,
      });

      const payload = {
        event: "subscription.activated",
        timestamp: "2024-01-01T00:00:00Z",
        organizationId: "org_123",
        data: { subscriptionId: "sub_123" },
      };

      const request = new NextRequest("https://example.com/webhooks", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "x-commet-signature": "sig" },
      });

      const response = await webhookHandler(request);

      expect(response.status).toBe(200);
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

      const payload = {
        event: "subscription.activated",
        timestamp: "2024-01-01T00:00:00Z",
        organizationId: "org_123",
        data: { subscriptionId: "sub_123" },
      };

      const request = new NextRequest("https://example.com/webhooks", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "x-commet-signature": "sig" },
      });

      await webhookHandler(request);

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

      const payload = {
        event: "subscription.activated",
        timestamp: "2024-01-01T00:00:00Z",
        organizationId: "org_123",
        data: { subscriptionId: "sub_123" },
      };

      const request = new NextRequest("https://example.com/webhooks", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "x-commet-signature": "sig" },
      });

      const response = await webhookHandler(request);
      const data = (await response.json()) as { received: boolean };

      expect(response.status).toBe(200);
      expect(data.received).toBe(true);
    });
  });
});
