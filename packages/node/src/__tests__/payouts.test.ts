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

function client() {
  return new Commet({ apiKey: "ck_test_123" });
}

describe("Payouts — wire serialization", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("addBankAccount", () => {
    it("sends the full camelCase bank payload and omits unset optionals", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        jsonResponse({
          id: "pba_1",
          last4: "6789",
          object: "payout_bank_account",
        }),
      );

      await client().payouts.addBankAccount({
        accountNumber: "000123456789",
        accountHolderName: "Acme Inc",
      });

      const { url, body } = lastRequest();
      expect(url).toContain("/payouts/bank-accounts");
      expect(body.accountNumber).toBe("000123456789");
      expect(body.accountHolderName).toBe("Acme Inc");
      // optional fields the caller never passed must NOT leak onto the wire as null
      expect(body).not.toHaveProperty("routingNumber");
      expect(body).not.toHaveProperty("accountType");
      expect(body).not.toHaveProperty("setDefault");
    });

    it("serializes the accountType enum and setDefault=false (not dropped)", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ id: "pba_1" }));

      await client().payouts.addBankAccount({
        accountNumber: "000123456789",
        accountHolderName: "Acme Inc",
        routingNumber: "110000000",
        accountType: "savings",
        setDefault: false,
      });

      const { body } = lastRequest();
      expect(body.routingNumber).toBe("110000000");
      expect(body.accountType).toBe("savings");
      expect(body.setDefault).toBe(false);
    });

    it("parses a camelCase bank-account response into the typed model", async () => {
      const account = {
        id: "pba_1",
        providerExternalAccountId: null,
        holderName: "Acme Inc",
        last4: "6789",
        bankName: null,
        country: "US",
        currency: "usd",
        accountType: "checking",
        isDefault: true,
        status: "active",
        createdAt: "2026-06-08T00:00:00.000Z",
        object: "payout_bank_account",
        livemode: true,
      };
      vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(account));

      const result = await client().payouts.addBankAccount({
        accountNumber: "000123456789",
        accountHolderName: "Acme Inc",
      });

      // wire null survives as null, not coerced to undefined / dropped
      const data = result;
      expect(data.providerExternalAccountId).toBeNull();
      expect(data.bankName).toBeNull();
      expect(data.last4).toBe("6789");
      expect(data.isDefault).toBe(true);
      expect(data.status).toBe("active");
    });
  });

  describe("request", () => {
    it("sends amount (cents) and omits description when not provided", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        jsonResponse({
          id: "po_1",
          status: "pending",
        }),
      );

      await client().payouts.request({ amount: 1000 });

      const { url, body } = lastRequest();
      expect(url).toContain("/payouts");
      expect(body.amount).toBe(1000);
      expect(body).not.toHaveProperty("description");
    });

    it("parses a pending payout response with its money fields and enum", async () => {
      const payout = {
        id: "po_1",
        status: "pending",
        amount: 5000,
        fee: 0,
        netAmount: 5000,
        currency: "usd",
        description: null,
        providerTransferId: "tr_abc",
        createdAt: "2026-06-08T00:00:00.000Z",
        object: "payout",
        livemode: true,
      };
      vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(payout));

      const result = await client().payouts.request({
        amount: 5000,
        description: "weekly",
      });

      const data = result;
      expect(data.status).toBe("pending");
      expect(data.netAmount).toBe(5000);
      expect(data.providerTransferId).toBe("tr_abc");
      expect(data.description).toBeNull();
    });
  });

  describe("completeVerification", () => {
    it("keeps the deprecated endpoint as an empty compatibility request", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ success: true }));

      await client().payouts.completeVerification();

      const { url, body } = lastRequest();
      expect(url).toContain("/payouts/verification");
      expect(body).toEqual({});
    });
  });
});
