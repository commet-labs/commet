import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Commet } from "../client";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function lastCall(): { url: string; init: RequestInit } {
  const calls = vi.mocked(fetch).mock.calls;
  const call = calls[calls.length - 1];
  return { url: String(call?.[0]), init: call?.[1] as RequestInit };
}

function lastBody(): Record<string, unknown> {
  return JSON.parse(lastCall().init.body as string);
}

function lastQuery(): URLSearchParams {
  return new URL(lastCall().url).searchParams;
}

function client() {
  return new Commet({ apiKey: "ck_test_123" });
}

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Seats — wire serialization", () => {
  it("set() PUTs the exact count and routes to /seats", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ newBalance: 10 }));

    await client().seats.set({
      customerId: "cus_1",
      featureCode: "seats",
      count: 10,
    });

    const { url, init } = lastCall();
    expect(url).toContain("/seats");
    expect(init.method).toBe("PUT");
    expect(lastBody()).toEqual({
      customerId: "cus_1",
      featureCode: "seats",
      count: 10,
    });
  });

  it("remove() POSTs to the explicit action endpoint", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ newBalance: 0 }));

    await client().seats.remove({
      customerId: "cus_1",
      featureCode: "seats",
      count: 3,
    });

    const { init } = lastCall();
    expect(lastCall().url).toContain("/seats/remove");
    expect(init.method).toBe("POST");
    expect(lastBody()).toEqual({
      customerId: "cus_1",
      featureCode: "seats",
      count: 3,
    });
  });

  it("setAll() sends the seats map as a nested object", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ object: "list", data: [], hasMore: false }),
    );

    await client().seats.setAll({
      customerId: "cus_1",
      seats: { admin: 2, editor: 5 },
    });

    const { url, init } = lastCall();
    expect(url).toContain("/seats/bulk");
    expect(init.method).toBe("PUT");
    expect(lastBody().seats).toEqual({ admin: 2, editor: 5 });
  });

  it("getBalance() carries identifiers as query params, not a body", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ current: 7, asOf: "2026-06-08T00:00:00.000Z" }),
    );

    const result = await client().seats.getBalance({
      customerId: "cus_1",
      featureCode: "seats",
    });

    const { url, init } = lastCall();
    expect(url).toContain("/seats/balance");
    expect(init.method).toBe("GET");
    expect(init.body).toBeUndefined();
    const q = lastQuery();
    expect(q.get("customerId")).toBe("cus_1");
    expect(q.get("featureCode")).toBe("seats");
    expect(result.current).toBe(7);
  });
});

describe("CreditPacks — wire serialization", () => {
  it("create() omits unset optionals (no leaked isActive/description)", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ id: "cp_1" }));

    await client().creditPacks.create({
      name: "Starter",
      credits: 1000,
      price: 999,
    });

    const { url } = lastCall();
    expect(url).toContain("/credit-packs");
    expect(url).not.toContain("/manage");
    const body = lastBody();
    expect(body).toEqual({ name: "Starter", credits: 1000, price: 999 });
    expect(body).not.toHaveProperty("description");
    expect(body).not.toHaveProperty("isActive");
  });

  it("create() keeps an explicit isActive=false on the wire", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ id: "cp_1" }));

    await client().creditPacks.create({
      name: "Starter",
      credits: 1000,
      price: 999,
      isActive: false,
    });

    expect(lastBody().isActive).toBe(false);
  });

  it("update() strips the id path param from the body", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ id: "cp_1" }));

    await client().creditPacks.update({ id: "cp_1", price: 1999 });

    const { url, init } = lastCall();
    expect(url).toContain("/credit-packs/cp_1");
    expect(init.method).toBe("PATCH");
    const body = lastBody();
    expect(body).not.toHaveProperty("id");
    expect(body.price).toBe(1999);
  });

  it("parses a credit-pack list with nullable description and money fields", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({
        object: "list",
        data: [
          {
            id: "cp_1",
            name: "Starter",
            description: null,
            credits: 1000,
            price: 999,
            currency: "usd",
            isActive: true,
            object: "credit_pack",
            livemode: true,
          },
        ],
        hasMore: false,
      }),
    );

    const result = await client().creditPacks.list();
    const pack = result.data[0];
    expect(pack.description).toBeNull();
    expect(pack.isActive).toBe(true);
    expect(pack.credits).toBe(1000);
    expect(pack.price).toBe(999);
  });
});

describe("Invoices — query filters and status enum", () => {
  it("list() serializes the status enum filter as a query param", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ object: "list", data: [], hasMore: false }),
    );

    await client().invoices.list({
      customerId: "cus_1",
      status: "outstanding",
      limit: 25,
    });

    const { url, init } = lastCall();
    expect(url).toContain("/invoices");
    expect(init.method).toBe("GET");
    const q = lastQuery();
    expect(q.get("customerId")).toBe("cus_1");
    expect(q.get("status")).toBe("outstanding");
    expect(q.get("limit")).toBe("25");
    // an unset filter must not appear in the query string
    expect(q.has("subscriptionId")).toBe(false);
  });

  it("createAdjustment() sends a negative amount intact (credit note)", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ id: "inv_1" }));

    await client().invoices.createAdjustment({
      customerId: "cus_1",
      amount: -500,
      description: "Goodwill credit",
    });

    const body = lastBody();
    expect(body.amount).toBe(-500);
    expect(body.description).toBe("Goodwill credit");
    expect(body).not.toHaveProperty("metadata");
  });

  it("send() POSTs an empty body to the per-invoice send endpoint", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ sent: true }));

    await client().invoices.send({ id: "inv_1" });

    const { url, init } = lastCall();
    expect(url).toContain("/invoices/inv_1/send");
    expect(init.method).toBe("POST");
    expect(init.body).toBe(JSON.stringify({}));
  });

  it("parses an invoice with nested lineItems and nullable subscriptionId", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({
        id: "inv_1",
        customerId: "cus_1",
        subscriptionId: null,
        invoiceNumber: "INV-001",
        status: "paid",
        invoiceType: "subscription",
        currency: "usd",
        subtotal: 5000,
        discountAmount: 0,
        taxAmount: 450,
        total: 5450,
        periodStart: "2026-06-01T00:00:00.000Z",
        periodEnd: "2026-07-01T00:00:00.000Z",
        issueDate: "2026-06-01T00:00:00.000Z",
        dueDate: "2026-06-08T00:00:00.000Z",
        memo: null,
        metadata: {},
        createdAt: "2026-06-01T00:00:00.000Z",
        updatedAt: "2026-06-01T00:00:00.000Z",
        lineItems: [
          {
            lineType: "plan_base",
            featureName: null,
            description: "Pro plan",
            quantity: 1,
            unitAmount: 5000,
            amount: 5000,
            includedAmount: null,
            usedAmount: null,
            overageAmount: null,
            discountType: null,
            discountValue: null,
            discountName: null,
            chargeType: "standard",
          },
        ],
        object: "invoice",
        livemode: true,
      }),
    );

    const data = await client().invoices.get({ id: "inv_1" });
    expect(data.subscriptionId).toBeNull();
    expect(data.status).toBe("paid");
    expect(data.lineItems?.[0].lineType).toBe("plan_base");
    expect(data.lineItems?.[0].featureName).toBeNull();
    expect(data.lineItems?.[0].chargeType).toBe("standard");
  });
});

describe("Transactions — status enum + refund/retry bodies", () => {
  it("list() serializes the status enum and customerEmail as query params", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ object: "list", data: [], hasMore: false }),
    );

    await client().transactions.list({
      status: "succeeded",
      customerEmail: "a@b.com",
    });

    const q = lastQuery();
    expect(lastCall().url).toContain("/transactions");
    expect(q.get("status")).toBe("succeeded");
    expect(q.get("customerEmail")).toBe("a@b.com");
    expect(q.has("cursor")).toBe(false);
  });

  it("refund() POSTs an empty body to the per-transaction refund endpoint", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({
        id: "ref_1",
        transactionId: "txn_1",
        amount: 5450,
        currency: "usd",
        status: "succeeded",
        object: "refund",
        livemode: true,
      }),
    );

    const result = await client().transactions.refund({ id: "txn_1" });

    const { url, init } = lastCall();
    expect(url).toContain("/transactions/txn_1/refund");
    expect(init.method).toBe("POST");
    expect(init.body).toBe(JSON.stringify({}));
    expect(result.status).toBe("succeeded");
  });

  it("parses a transaction with nullable invoiceId/paidAt and the status enum", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({
        id: "txn_1",
        invoiceId: null,
        grossAmount: 5450,
        subtotal: 5000,
        taxAmount: 450,
        currency: "usd",
        status: "failed",
        customerEmail: "a@b.com",
        customerName: null,
        paidAt: null,
        createdAt: "2026-06-08T00:00:00.000Z",
        updatedAt: "2026-06-08T00:00:00.000Z",
        object: "transaction",
        livemode: true,
      }),
    );

    const data = await client().transactions.get({ id: "txn_1" });
    expect(data.invoiceId).toBeNull();
    expect(data.paidAt).toBeNull();
    expect(data.customerName).toBeNull();
    expect(data.status).toBe("failed");
  });
});

describe("Addons — consumptionModel enum + active listing", () => {
  it("create() sends the consumptionModel enum and omits unset numeric optionals", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ id: "addon_1" }));

    await client().addons.create({
      name: "Extra seats",
      basePrice: 1000,
      featureId: "feat_1",
      consumptionModel: "metered",
    });

    const { url } = lastCall();
    expect(url).toContain("/addons");
    const body = lastBody();
    expect(body.consumptionModel).toBe("metered");
    expect(body).not.toHaveProperty("includedUnits");
    expect(body).not.toHaveProperty("overageRate");
    expect(body).not.toHaveProperty("creditCost");
  });

  it("listActive() carries the customerId filter as a query param", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ object: "list", data: [], hasMore: false }),
    );

    await client().addons.listActive({ customerId: "cus_1" });

    const { url, init } = lastCall();
    expect(url).toContain("/active-addons");
    expect(init.method).toBe("GET");
    expect(lastQuery().get("customerId")).toBe("cus_1");
  });

  it("parses an addon with nullable description/includedUnits and its enum", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({
        id: "addon_1",
        name: "Extra seats",
        slug: "extra-seats",
        description: null,
        basePrice: 1000,
        consumptionModel: "boolean",
        featureCode: "seats",
        featureName: "Seats",
        includedUnits: null,
        overageRate: null,
        creditCost: null,
        createdAt: "2026-06-08T00:00:00.000Z",
        updatedAt: "2026-06-08T00:00:00.000Z",
        object: "addon",
        livemode: true,
      }),
    );

    const data = await client().addons.get({ id: "addon_1" });
    expect(data.consumptionModel).toBe("boolean");
    expect(data.description).toBeNull();
    expect(data.includedUnits).toBeNull();
  });
});

describe("Usage — contract-generated methods", () => {
  it("track() sends featureCode and forwards request idempotency", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({
        id: "evt_1",
        featureCode: "api_calls",
        customerId: "cus_1",
      }),
    );

    const result = await client().usage.track(
      {
        featureCode: "api_calls",
        customerId: "cus_1",
        value: 2,
      },
      { idempotencyKey: "usage_1" },
    );

    const { url, init } = lastCall();
    expect(url).toContain("/usage/events");
    expect(init.method).toBe("POST");
    expect(lastBody()).toEqual({
      featureCode: "api_calls",
      customerId: "cus_1",
      value: 2,
    });
    expect((init.headers as Record<string, string>)["Idempotency-Key"]).toBe(
      "usage_1",
    );
    expect(result.id).toBe("evt_1");
  });

  it("check() returns the direct availability response", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({
        allowed: true,
        consumptionModel: "metered",
        featureCode: "api_calls",
        quantity: 1,
      }),
    );

    const result = await client().usage.check({
      customerId: "cus_1",
      featureCode: "api_calls",
    });

    expect(lastCall().url).toContain("/usage/check");
    expect(lastBody()).toEqual({
      customerId: "cus_1",
      featureCode: "api_calls",
    });
    expect(result.allowed).toBe(true);
  });
});

describe("Offers — contract-generated CRUD", () => {
  it("create() sends canonical offer phases", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ id: "offer_1" }));

    await client().offers.create({
      name: "Launch",
      purpose: "promotional",
      planPriceIds: ["price_1"],
      phases: [
        {
          type: "percentage",
          durationCycles: 3,
          percentage: 2000,
        },
      ],
    });

    const { url, init } = lastCall();
    expect(url).toContain("/offers");
    expect(init.method).toBe("POST");
    expect(lastBody().phases).toEqual([
      {
        type: "percentage",
        durationCycles: 3,
        percentage: 2000,
      },
    ]);
  });

  it("update() uses PATCH and keeps the id out of the body", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ id: "offer_1" }));

    await client().offers.update({
      id: "offer_1",
      name: "Launch",
      purpose: "promotional",
      planPriceIds: ["price_1"],
      phases: [{ type: "free_trial", durationDays: 14 }],
      active: false,
    });

    const { url, init } = lastCall();
    expect(url).toContain("/offers/offer_1");
    expect(init.method).toBe("PATCH");
    expect(lastBody()).not.toHaveProperty("id");
    expect(lastBody().active).toBe(false);
  });
});

describe("Webhooks — generated endpoints plus signed-event helpers", () => {
  it("create() is available on the same webhooks resource", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ id: "wh_1", secretKey: "whsec_1" }),
    );

    const result = await client().webhooks.create({
      url: "https://example.com/webhooks",
      events: ["subscription.activated"],
    });

    const { url, init } = lastCall();
    expect(url).toContain("/webhooks");
    expect(init.method).toBe("POST");
    expect(lastBody()).toEqual({
      url: "https://example.com/webhooks",
      events: ["subscription.activated"],
    });
    expect(result.secretKey).toBe("whsec_1");
  });

  it("update() uses PATCH and strips the endpoint id", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ id: "wh_1" }));

    await client().webhooks.update({
      id: "wh_1",
      isActive: false,
    });

    const { url, init } = lastCall();
    expect(url).toContain("/webhooks/wh_1");
    expect(init.method).toBe("PATCH");
    expect(lastBody()).toEqual({ isActive: false });
  });
});

describe("FeatureAccess — direct access lookup", () => {
  it("gets and parses the consumption variant", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({
        allowed: true,
        code: "api_calls",
        name: "API calls",
        unitName: "request",
        type: "usage",
        consumption: {
          model: "metered",
          period: {
            start: "2026-07-01T00:00:00.000Z",
            end: "2026-08-01T00:00:00.000Z",
          },
          unitsUsed: 90,
          includedUnits: 100,
          remainingUnits: 10,
          unlimited: false,
          overage: {
            enabled: true,
            units: 0,
          },
        },
        object: "feature",
        livemode: true,
      }),
    );

    const data = await client().featureAccess.get({
      code: "api_calls",
      customerId: "cus_1",
    });
    const { url, init } = lastCall();
    expect(url).toContain("/feature-access/api_calls");
    expect(init.method).toBe("GET");
    expect(lastQuery().get("customerId")).toBe("cus_1");
    expect(data.allowed).toBe(true);
    if (!("type" in data) || data.type !== "usage") {
      throw new Error("Expected usage feature access");
    }
    expect(data.type).toBe("usage");
    expect(data.consumption.model).toBe("metered");
    expect(data.consumption.unitsUsed).toBe(90);
  });
});
