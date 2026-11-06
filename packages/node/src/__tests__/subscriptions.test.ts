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

function lastRequest(): { url: string; body: Record<string, unknown> } {
  const { url, init } = lastCall();
  return { url, body: JSON.parse(init.body as string) };
}

describe("Subscriptions — successUrl on the wire", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("changePlan sends successUrl in the body and keeps id out of it", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ id: "sub_1", scheduled: false }),
    );
    const client = new Commet({ apiKey: "ck_test_123" });

    await client.subscriptions.changePlan({
      id: "sub_1",
      newPlanId: "plan_pro",
      successUrl: "https://app.example.com/billing/done",
    });

    const { url, body } = lastRequest();
    expect(body.successUrl).toBe("https://app.example.com/billing/done");
    expect(body.newPlanId).toBe("plan_pro");
    expect(body).not.toHaveProperty("id");
    expect(url).toContain("/subscriptions/sub_1/change-plan");
  });

  it("create sends the selected price and promotional offer ids", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ id: "sub_1" }));
    const client = new Commet({ apiKey: "ck_test_123" });

    await client.subscriptions.create({
      customerId: "cus_1",
      planId: "plan_pro",
      priceId: "price_ar_1",
      offerId: "offer_intro",
    });

    const { url, body } = lastRequest();
    expect(url).toContain("/subscriptions");
    expect(body.priceId).toBe("price_ar_1");
    expect(body.offerId).toBe("offer_intro");
  });
});

describe("Subscriptions — credit quantity, auto top-up and promo codes", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("purchaseCredits buys a chosen quantity without a credit pack", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ credits: 75 }));
    const client = new Commet({ apiKey: "ck_test_123" });

    await client.subscriptions.purchaseCredits({ id: "sub_1", quantity: 75 });

    const { url, body } = lastRequest();
    expect(url).toContain("/subscriptions/sub_1/credits");
    expect(body).toEqual({ quantity: 75 });
  });

  it("getAutoTopUp reads the subscription's auto top-up", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ enabled: true }));
    const client = new Commet({ apiKey: "ck_test_123" });

    await client.subscriptions.getAutoTopUp({ id: "sub_1" });

    const { url, init } = lastCall();
    expect(url).toContain("/subscriptions/sub_1/auto-top-up");
    expect(init.method).toBe("GET");
  });

  it("updateAutoTopUp patches only the fields that change", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ enabled: true }));
    const client = new Commet({ apiKey: "ck_test_123" });

    await client.subscriptions.updateAutoTopUp({
      id: "sub_1",
      enabled: true,
      threshold: 10,
      quantity: 75,
    });

    const { url, body } = lastRequest();
    expect(lastCall().init.method).toBe("PATCH");
    expect(url).toContain("/subscriptions/sub_1/auto-top-up");
    expect(body).toEqual({ enabled: true, threshold: 10, quantity: 75 });
  });

  it("changePlan and previewChange send a promoCode", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(jsonResponse({ amountDue: 0 }))
      .mockResolvedValueOnce(jsonResponse({ id: "sub_1" }));
    const client = new Commet({ apiKey: "ck_test_123" });

    await client.subscriptions.previewChange({
      id: "sub_1",
      planId: "plan_pro",
      promoCode: "LAUNCH20",
    });
    expect(lastRequest().url).toContain("/subscriptions/sub_1/preview-change");
    expect(lastRequest().body).toEqual({
      planId: "plan_pro",
      promoCode: "LAUNCH20",
    });

    await client.subscriptions.changePlan({
      id: "sub_1",
      newPlanId: "plan_pro",
      promoCode: "LAUNCH20",
    });
    expect(lastRequest().url).toContain("/subscriptions/sub_1/change-plan");
    expect(lastRequest().body).toEqual({
      newPlanId: "plan_pro",
      promoCode: "LAUNCH20",
    });
  });
});

describe("Subscriptions — plan versions", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("create sells a chosen plan version", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ id: "sub_1" }));
    const client = new Commet({ apiKey: "ck_test_123" });

    await client.subscriptions.create({
      customerId: "cus_1",
      planCode: "pro",
      planVersionId: "plnrel_v3",
    });

    expect(lastRequest().body).toEqual({
      customerId: "cus_1",
      planCode: "pro",
      planVersionId: "plnrel_v3",
    });
  });

  it("list filters by plan version", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ data: [] }));
    const client = new Commet({ apiKey: "ck_test_123" });

    await client.subscriptions.list({ planVersionId: "plnrel_v3" });

    const searchParams = new URL(lastCall().url).searchParams;
    expect(searchParams.get("planVersionId")).toBe("plnrel_v3");
  });

  it("changeVersion and revokeScheduledVersionChange move a subscription between versions", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(jsonResponse({ id: "sub_1" }))
      .mockResolvedValueOnce(jsonResponse({ id: "sub_1" }));
    const client = new Commet({ apiKey: "ck_test_123" });

    await client.subscriptions.changeVersion({
      id: "sub_1",
      planVersionId: "plnrel_v4",
      effective: "period_end",
    });
    expect(lastRequest().url).toContain("/subscriptions/sub_1/change-version");
    expect(lastRequest().body).toEqual({
      planVersionId: "plnrel_v4",
      effective: "period_end",
    });

    await client.subscriptions.revokeScheduledVersionChange({ id: "sub_1" });
    const { url, init } = lastCall();
    expect(url).toContain("/subscriptions/sub_1/scheduled-version-change");
    expect(init.method).toBe("DELETE");
  });
});
