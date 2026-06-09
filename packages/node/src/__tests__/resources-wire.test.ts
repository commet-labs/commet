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
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ success: true, data: { newBalance: 10 } }),
    );

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

  it("remove() DELETEs with a body (seat decrement carried as data, not query)", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ success: true, data: { newBalance: 0 } }),
    );

    await client().seats.remove({
      customerId: "cus_1",
      featureCode: "seats",
      count: 3,
    });

    const { init } = lastCall();
    expect(init.method).toBe("DELETE");
    expect(lastBody()).toEqual({
      customerId: "cus_1",
      featureCode: "seats",
      count: 3,
    });
  });

  it("setAll() sends the seats map as a nested object", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ success: true, data: [] }),
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
      jsonResponse({
        success: true,
        data: { current: 7, asOf: "2026-06-08T00:00:00.000Z" },
      }),
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
    expect(unwrap(result).current).toBe(7);
  });
});

describe("CreditPacks — wire serialization", () => {
  it("create() omits unset optionals (no leaked isActive/description)", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ success: true, data: { id: "cp_1" } }),
    );

    await client().creditPacks.create({
      name: "Starter",
      credits: 1000,
      price: 999,
    });

    const { url } = lastCall();
    expect(url).toContain("/credit-packs/manage");
    const body = lastBody();
    expect(body).toEqual({ name: "Starter", credits: 1000, price: 999 });
    expect(body).not.toHaveProperty("description");
    expect(body).not.toHaveProperty("isActive");
  });

  it("create() keeps an explicit isActive=false on the wire", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ success: true, data: { id: "cp_1" } }),
    );

    await client().creditPacks.create({
      name: "Starter",
      credits: 1000,
      price: 999,
      isActive: false,
    });

    expect(lastBody().isActive).toBe(false);
  });

  it("update() strips the id path param from the body", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ success: true, data: { id: "cp_1" } }),
    );

    await client().creditPacks.update({ id: "cp_1", price: 1999 });

    const { url, init } = lastCall();
    expect(url).toContain("/credit-packs/cp_1");
    expect(init.method).toBe("PUT");
    const body = lastBody();
    expect(body).not.toHaveProperty("id");
    expect(body.price).toBe(1999);
  });

  it("parses a credit-pack list with nullable description and money fields", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({
        success: true,
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
      }),
    );

    const result = await client().creditPacks.list();
    const pack = unwrap(result)[0];
    expect(pack.description).toBeNull();
    expect(pack.isActive).toBe(true);
    expect(pack.credits).toBe(1000);
    expect(pack.price).toBe(999);
  });
});

describe("Invoices — query filters and status enum", () => {
  it("list() serializes the status enum filter as a query param", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ success: true, data: [] }),
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
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ success: true, data: { id: "inv_1" } }),
    );

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
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ success: true, data: { sent: true } }),
    );

    await client().invoices.send({ id: "inv_1" });

    const { url, init } = lastCall();
    expect(url).toContain("/invoices/inv_1/send");
    expect(init.method).toBe("POST");
    expect(init.body).toBe(JSON.stringify({}));
  });

  it("parses an invoice with nested lineItems and nullable subscriptionId", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({
        success: true,
        data: {
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
        },
      }),
    );

    const data = unwrap(await client().invoices.get({ id: "inv_1" }));
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
      jsonResponse({ success: true, data: [] }),
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
        success: true,
        data: { id: "txn_1", status: "refunded" },
      }),
    );

    const result = await client().transactions.refund({ id: "txn_1" });

    const { url, init } = lastCall();
    expect(url).toContain("/transactions/txn_1/refund");
    expect(init.method).toBe("POST");
    expect(init.body).toBe(JSON.stringify({}));
    expect(unwrap(result).status).toBe("refunded");
  });

  it("parses a transaction with nullable invoiceId/paidAt and the status enum", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({
        success: true,
        data: {
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
        },
      }),
    );

    const data = unwrap(await client().transactions.get({ id: "txn_1" }));
    expect(data.invoiceId).toBeNull();
    expect(data.paidAt).toBeNull();
    expect(data.customerName).toBeNull();
    expect(data.status).toBe("failed");
  });
});

describe("Addons — consumptionModel enum + active listing", () => {
  it("create() sends the consumptionModel enum and omits unset numeric optionals", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ success: true, data: { id: "addon_1" } }),
    );

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
      jsonResponse({ success: true, data: [] }),
    );

    await client().addons.listActive({ customerId: "cus_1" });

    const { url, init } = lastCall();
    expect(url).toContain("/addons/active");
    expect(init.method).toBe("GET");
    expect(lastQuery().get("customerId")).toBe("cus_1");
  });

  it("parses an addon with nullable description/includedUnits and its enum", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({
        success: true,
        data: {
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
        },
      }),
    );

    const data = unwrap(await client().addons.get({ id: "addon_1" }));
    expect(data.consumptionModel).toBe("boolean");
    expect(data.description).toBeNull();
    expect(data.includedUnits).toBeNull();
  });
});

describe("Features — canUse query injection + access parsing", () => {
  it("canUse() injects action=canUse into the query and puts code in the path", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ success: true, data: { allowed: true } }),
    );

    await client().features.canUse({ code: "api_calls", customerId: "cus_1" });

    const { url, init } = lastCall();
    expect(url).toContain("/features/api_calls");
    expect(init.method).toBe("GET");
    const q = lastQuery();
    expect(q.get("customerId")).toBe("cus_1");
    expect(q.get("action")).toBe("canUse");
    // code is a path segment, never a query param
    expect(q.has("code")).toBe(false);
  });

  it("get() forwards a custom action verbatim without forcing canUse", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ success: true, data: { allowed: false } }),
    );

    await client().features.get({
      code: "api_calls",
      customerId: "cus_1",
      action: "check",
    });

    const q = lastQuery();
    expect(q.get("action")).toBe("check");
  });

  it("parses a feature-access lookup with willBeCharged + reason", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({
        success: true,
        data: {
          allowed: true,
          code: "api_calls",
          name: "API calls",
          type: "usage",
          current: 90,
          included: 100,
          remaining: 10,
          willBeCharged: false,
          reason: "within_included",
          object: "feature",
          livemode: true,
        },
      }),
    );

    const data = unwrap(
      await client().features.canUse({
        code: "api_calls",
        customerId: "cus_1",
      }),
    );
    expect(data.allowed).toBe(true);
    expect(data.type).toBe("usage");
    expect(data.willBeCharged).toBe(false);
    expect(data.reason).toBe("within_included");
  });
});
