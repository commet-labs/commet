import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Commet } from "../client";
import type { ApiResponse } from "../types/common";

function unwrap<T>(response: ApiResponse<T>): T {
  if (response.data === undefined) {
    throw new Error("expected response.data to be defined");
  }
  return response.data;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function lastRequest(): { url: string; body: Record<string, unknown> } {
  const calls = vi.mocked(fetch).mock.calls;
  const call = calls[calls.length - 1];
  return {
    url: String(call?.[0]),
    body: JSON.parse((call?.[1] as RequestInit).body as string),
  };
}

function client() {
  return new Commet({ apiKey: "ck_test_123" });
}

describe("Plans — wire serialization of nested pricing", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("path params are stripped from the body", () => {
    it("addPrice keeps id in the URL but never in the body", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        jsonResponse({ success: true, data: { id: "price_1" } }),
      );

      await client().plans.addPrice({
        id: "plan_pro",
        billingInterval: "monthly",
        price: 5000,
      });

      const { url, body } = lastRequest();
      expect(url).toContain("/plans/plan_pro/prices");
      expect(body).not.toHaveProperty("id");
      expect(body.billingInterval).toBe("monthly");
      expect(body.price).toBe(5000);
      // optionals never set must not leak as null
      expect(body).not.toHaveProperty("trialDays");
      expect(body).not.toHaveProperty("includedBalance");
      expect(body).not.toHaveProperty("introOffer");
    });

    it("updatePrice strips both id and priceId path params from the body", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        jsonResponse({ success: true, data: { id: "price_1" } }),
      );

      await client().plans.updatePrice({
        id: "plan_pro",
        priceId: "price_1",
        price: 6000,
      });

      const { url, body } = lastRequest();
      expect(url).toContain("/plans/plan_pro/prices/price_1");
      expect(body).not.toHaveProperty("id");
      expect(body).not.toHaveProperty("priceId");
      expect(body.price).toBe(6000);
    });
  });

  describe("nested introOffer", () => {
    it("serializes the introOffer object verbatim on addPrice", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        jsonResponse({ success: true, data: { id: "price_1" } }),
      );

      await client().plans.addPrice({
        id: "plan_pro",
        billingInterval: "yearly",
        price: 50000,
        trialDays: 14,
        includedCredits: 1000,
        introOffer: {
          enabled: true,
          discountType: "percentage",
          discountValue: 2500,
          durationCycles: 3,
        },
      });

      const { body } = lastRequest();
      expect(body.trialDays).toBe(14);
      expect(body.includedCredits).toBe(1000);
      expect(body.introOffer).toEqual({
        enabled: true,
        discountType: "percentage",
        discountValue: 2500,
        durationCycles: 3,
      });
    });

    it("preserves an explicit null discountType inside introOffer (disabled offer)", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        jsonResponse({ success: true, data: { id: "price_1" } }),
      );

      await client().plans.addPrice({
        id: "plan_pro",
        billingInterval: "monthly",
        price: 5000,
        introOffer: {
          enabled: false,
          discountType: null,
          discountValue: null,
          durationCycles: null,
        },
      });

      const introOffer = lastRequest().body.introOffer as Record<
        string,
        unknown
      >;
      expect(introOffer.enabled).toBe(false);
      expect(introOffer.discountType).toBeNull();
      expect(introOffer.discountValue).toBeNull();
    });
  });

  describe("regional pricing", () => {
    it("sends the full nested regional payload (prices, features, introOffers arrays)", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        jsonResponse({
          success: true,
          data: {
            planId: "plan_pro",
            currency: "brl",
            exchangeRate: 5.2,
            pricesConfigured: 1,
            featuresConfigured: 1,
            object: "plan",
            livemode: true,
          },
        }),
      );

      await client().plans.setRegionalPricing({
        id: "plan_pro",
        currency: "brl",
        exchangeRate: 5.2,
        prices: [{ priceId: "price_1", price: 26000, includedBalance: 1000 }],
        features: [{ featureId: "feat_1", overageUnitPrice: 50 }],
        introOffers: [
          {
            priceId: "price_1",
            discountType: "amount",
            discountValue: 1000,
            durationCycles: 2,
          },
        ],
      });

      const { url, body } = lastRequest();
      expect(url).toContain("/plans/plan_pro/regional");
      expect(body).not.toHaveProperty("id");
      expect(body.currency).toBe("brl");
      expect(body.exchangeRate).toBe(5.2);
      expect(body.prices).toEqual([
        { priceId: "price_1", price: 26000, includedBalance: 1000 },
      ]);
      expect(body.features).toEqual([
        { featureId: "feat_1", overageUnitPrice: 50 },
      ]);
      expect(body.introOffers).toEqual([
        {
          priceId: "price_1",
          discountType: "amount",
          discountValue: 1000,
          durationCycles: 2,
        },
      ]);
    });

    it("setRegionalPrices nests the overrides array under a clean body", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        jsonResponse({ success: true, data: { priceId: "price_1" } }),
      );

      await client().plans.setRegionalPrices({
        id: "plan_pro",
        priceId: "price_1",
        overrides: [
          { currency: "eur", price: 4500 },
          { currency: "brl", price: 26000, includedBalance: 500 },
        ],
      });

      const { url, body } = lastRequest();
      expect(url).toContain("/plans/plan_pro/prices/price_1/regional");
      expect(body).not.toHaveProperty("id");
      expect(body).not.toHaveProperty("priceId");
      expect(body.overrides).toEqual([
        { currency: "eur", price: 4500 },
        { currency: "brl", price: 26000, includedBalance: 500 },
      ]);
    });
  });

  describe("list query + nested response parsing", () => {
    it("passes includePrivate as a query string, not a body", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        jsonResponse({ success: true, data: [] }),
      );

      await client().plans.list({ includePrivate: "true" });

      const calls = vi.mocked(fetch).mock.calls;
      const url = new URL(String(calls[calls.length - 1]?.[0]));
      expect(url.pathname).toContain("/plans");
      expect(url.searchParams.get("includePrivate")).toBe("true");
      expect(
        (calls[calls.length - 1]?.[1] as RequestInit).body,
      ).toBeUndefined();
    });

    it("parses a plan with nested prices[].introOffer and regionalPrices", async () => {
      const plan = {
        id: "plan_pro",
        name: "Pro",
        code: "pro",
        description: null,
        consumptionModel: "metered",
        isPublic: true,
        isDefault: false,
        isFree: false,
        blockOnExhaustion: null,
        sortOrder: 0,
        planGroupId: null,
        metadata: null,
        createdAt: "2026-06-08T00:00:00.000Z",
        updatedAt: "2026-06-08T00:00:00.000Z",
        prices: [
          {
            billingInterval: "monthly",
            price: 5000,
            isDefault: true,
            trialDays: 14,
            includedBalance: null,
            includedCredits: 1000,
            introOffer: {
              enabled: true,
              discountType: "percentage",
              discountValue: 2500,
              durationCycles: 3,
            },
            regionalPrices: [
              {
                currency: "brl",
                price: 26000,
                includedBalance: null,
                autoSynced: true,
              },
            ],
          },
        ],
        object: "plan",
        livemode: true,
      };
      vi.mocked(fetch).mockResolvedValueOnce(
        jsonResponse({ success: true, data: [plan] }),
      );

      const result = await client().plans.list();
      const parsed = unwrap(result)[0];

      expect(parsed.consumptionModel).toBe("metered");
      const price = parsed.prices?.[0];
      expect(price?.introOffer?.discountType).toBe("percentage");
      expect(price?.introOffer?.durationCycles).toBe(3);
      // wire null deep inside the nested array stays null
      expect(price?.includedBalance).toBeNull();
      expect(price?.regionalPrices?.[0].currency).toBe("brl");
      expect(price?.regionalPrices?.[0].autoSynced).toBe(true);
    });
  });
});
