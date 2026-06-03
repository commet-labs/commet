import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Commet } from "../client";

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

describe("Subscriptions — successUrl on the wire", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("changePlan sends successUrl in the body and keeps id out of it", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ success: true, data: { id: "sub_1", scheduled: false } }),
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

  it("create sends customIntroOffer with camelCase keys", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ success: true, data: { id: "sub_1" } }),
    );
    const client = new Commet({ apiKey: "ck_test_123" });

    await client.subscriptions.create({
      customerId: "cus_1",
      planId: "plan_pro",
      customIntroOffer: {
        discountType: "percentage",
        discountValue: 2500,
        durationCycles: 3,
      },
    });

    const { url, body } = lastRequest();
    expect(url).toContain("/subscriptions");
    expect(body.customIntroOffer).toEqual({
      discountType: "percentage",
      discountValue: 2500,
      durationCycles: 3,
    });
  });
});
