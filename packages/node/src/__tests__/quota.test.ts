import { describe, expect, it, vi } from "vitest";
import { QuotaResource } from "../resources/quota";
import { CommetAPIError } from "../types/common";
import type { CommetHTTPClient } from "../utils/http";

function createMockClient() {
  return {
    get: vi.fn().mockResolvedValue({ success: true, data: {} }),
    post: vi.fn().mockResolvedValue({ success: true, data: {} }),
    put: vi.fn().mockResolvedValue({ success: true, data: {} }),
    delete: vi.fn().mockResolvedValue({ success: true, data: {} }),
  };
}

function quotaResource(client: ReturnType<typeof createMockClient>) {
  return new QuotaResource(client as unknown as CommetHTTPClient);
}

describe("QuotaResource", () => {
  describe("add", () => {
    it("posts to /usage/quota with count defaulting to 1", async () => {
      const client = createMockClient();
      await quotaResource(client).add({
        customerId: "cus_1",
        featureCode: "projects",
      });

      expect(client.post).toHaveBeenCalledWith(
        "/usage/quota",
        { customerId: "cus_1", featureCode: "projects", count: 1 },
        undefined,
      );
    });

    it("passes an explicit count and request options", async () => {
      const client = createMockClient();
      await quotaResource(client).add(
        { customerId: "cus_1", featureCode: "projects", count: 5 },
        { idempotencyKey: "idem_1" },
      );

      expect(client.post).toHaveBeenCalledWith(
        "/usage/quota",
        { customerId: "cus_1", featureCode: "projects", count: 5 },
        { idempotencyKey: "idem_1" },
      );
    });
  });

  describe("set", () => {
    it("puts the exact count to /usage/quota", async () => {
      const client = createMockClient();
      await quotaResource(client).set({
        customerId: "cus_1",
        featureCode: "projects",
        count: 100,
      });

      expect(client.put).toHaveBeenCalledWith(
        "/usage/quota",
        { customerId: "cus_1", featureCode: "projects", count: 100 },
        undefined,
      );
    });
  });

  describe("remove", () => {
    it("deletes from /usage/quota with count defaulting to 1", async () => {
      const client = createMockClient();
      await quotaResource(client).remove({
        customerId: "cus_1",
        featureCode: "projects",
      });

      expect(client.delete).toHaveBeenCalledWith(
        "/usage/quota",
        { customerId: "cus_1", featureCode: "projects", count: 1 },
        undefined,
      );
    });

    it("propagates an insufficient_balance API error", async () => {
      const client = createMockClient();
      client.delete.mockRejectedValueOnce(
        new CommetAPIError(
          "Cannot decrement 9999 from quota. Current balance is 5",
          400,
          "insufficient_balance",
        ),
      );

      await expect(
        quotaResource(client).remove({
          customerId: "cus_1",
          featureCode: "projects",
          count: 9999,
        }),
      ).rejects.toMatchObject({
        statusCode: 400,
        code: "insufficient_balance",
      });
    });
  });

  describe("get", () => {
    it("gets the single allowance from /usage/quota", async () => {
      const client = createMockClient();
      const allowance = {
        featureCode: "projects",
        current: 5,
        included: 100,
        remaining: 95,
        unlimited: false,
        overageEnabled: true,
        asOf: "2026-05-29T00:00:00.000Z",
      };
      client.get.mockResolvedValueOnce({ success: true, data: allowance });

      const result = await quotaResource(client).get({
        customerId: "cus_1",
        featureCode: "projects",
      });

      expect(client.get).toHaveBeenCalledWith("/usage/quota", {
        customerId: "cus_1",
        featureCode: "projects",
      });
      expect(result.data).toEqual(allowance);
    });
  });

  describe("getAll", () => {
    it("returns the array of allowances from /usage/quota/all", async () => {
      const client = createMockClient();
      const allowances = [
        {
          featureCode: "projects",
          current: 42,
          included: 1000,
          remaining: 958,
          unlimited: false,
          overageEnabled: true,
          asOf: "2026-05-29T00:00:00.000Z",
        },
      ];
      client.get.mockResolvedValueOnce({ success: true, data: allowances });

      const result = await quotaResource(client).getAll({
        customerId: "cus_1",
      });

      expect(client.get).toHaveBeenCalledWith("/usage/quota/all", {
        customerId: "cus_1",
      });
      expect(result.data).toEqual(allowances);
    });
  });

  describe("count boundary", () => {
    it("treats an explicit count of 0 as 0, not the default", async () => {
      const client = createMockClient();
      await quotaResource(client).add({
        customerId: "cus_1",
        featureCode: "projects",
        count: 0,
      });
      await quotaResource(client).remove({
        customerId: "cus_1",
        featureCode: "projects",
        count: 0,
      });

      expect(client.post).toHaveBeenCalledWith(
        "/usage/quota",
        { customerId: "cus_1", featureCode: "projects", count: 0 },
        undefined,
      );
      expect(client.delete).toHaveBeenCalledWith(
        "/usage/quota",
        { customerId: "cus_1", featureCode: "projects", count: 0 },
        undefined,
      );
    });
  });
});
