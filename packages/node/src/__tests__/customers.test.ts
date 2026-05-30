import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Commet } from "../client";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function lastBody(): Record<string, unknown> {
  const call = vi.mocked(fetch).mock.calls.at(-1);
  return JSON.parse((call?.[1] as RequestInit).body as string);
}

describe("Customers — id (external_id) on the wire", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("create sends id in the body", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ success: true, data: { id: "cus_x" } }),
    );
    const client = new Commet({ apiKey: "ck_test_123" });

    await client.customers.create({ email: "a@b.com", id: "ext_123" });

    const body = lastBody();
    expect(body.id).toBe("ext_123");
    expect(body.billingEmail).toBe("a@b.com");
  });

  it("create without id omits it", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ success: true, data: { id: "cus_x" } }),
    );
    const client = new Commet({ apiKey: "ck_test_123" });

    await client.customers.create({ email: "a@b.com" });

    expect(lastBody()).not.toHaveProperty("id");
  });

  it("createBatch sends id per customer", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ success: true, data: { successful: [], failed: [] } }),
    );
    const client = new Commet({ apiKey: "ck_test_123" });

    await client.customers.createBatch({
      customers: [
        { email: "a@b.com", id: "ext_a" },
        { email: "b@b.com" },
      ],
    });

    const customers = lastBody().customers as Array<Record<string, unknown>>;
    expect(customers[0].id).toBe("ext_a");
    expect(customers[1]).not.toHaveProperty("id");
  });
});
