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
          success: true,
          data: { id: "pba_1", last4: "6789", object: "payout_bank_account" },
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
      vi.mocked(fetch).mockResolvedValueOnce(
        jsonResponse({ success: true, data: { id: "pba_1" } }),
      );

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
      vi.mocked(fetch).mockResolvedValueOnce(
        jsonResponse({ success: true, data: account }),
      );

      const result = await client().payouts.addBankAccount({
        accountNumber: "000123456789",
        accountHolderName: "Acme Inc",
      });

      // wire null survives as null, not coerced to undefined / dropped
      const data = unwrap(result);
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
        jsonResponse({ success: true, data: { id: "po_1", status: "pending" } }),
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
      vi.mocked(fetch).mockResolvedValueOnce(
        jsonResponse({ success: true, data: payout }),
      );

      const result = await client().payouts.request({
        amount: 5000,
        description: "weekly",
      });

      const data = unwrap(result);
      expect(data.status).toBe("pending");
      expect(data.netAmount).toBe(5000);
      expect(data.providerTransferId).toBe("tr_abc");
      expect(data.description).toBeNull();
    });
  });

  describe("completeVerification", () => {
    it("sends the nested bank + individual + address payload intact", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        jsonResponse({
          success: true,
          data: { providerAccountId: "acct_1", status: "pending_verification" },
        }),
      );

      await client().payouts.completeVerification({
        email: "ops@acme.com",
        businessType: "individual",
        businessUrl: "https://acme.com",
        documentUrl: "https://files.acme.com/id.png",
        bank: {
          accountNumber: "000123456789",
          accountHolderName: "Jane Doe",
          accountType: "checking",
        },
        individual: {
          firstName: "Jane",
          lastName: "Doe",
          phone: "+15555550100",
          dateOfBirth: "1990-01-01",
          address: {
            line1: "1 Main St",
            city: "NYC",
            postalCode: "10001",
            country: "US",
          },
        },
      });

      const { url, body } = lastRequest();
      expect(url).toContain("/payouts/verification");
      expect(body.businessType).toBe("individual");

      const bank = body.bank as Record<string, unknown>;
      expect(bank.accountNumber).toBe("000123456789");
      expect(bank.accountType).toBe("checking");
      // optional nested keys not provided stay off the wire
      expect(bank).not.toHaveProperty("routingNumber");

      const individual = body.individual as Record<string, unknown>;
      expect(individual.firstName).toBe("Jane");
      expect(individual).not.toHaveProperty("ssnLast4");

      const address = individual.address as Record<string, unknown>;
      expect(address.line1).toBe("1 Main St");
      expect(address.country).toBe("US");
      expect(address).not.toHaveProperty("line2");
      expect(address).not.toHaveProperty("state");

      // a company branch the caller never set must not appear
      expect(body).not.toHaveProperty("company");
    });

    it("parses the verification response enum and alreadyExists flag", async () => {
      const verification = {
        providerAccountId: "acct_1",
        status: "verified",
        transfersEnabled: true,
        alreadyExists: true,
        businessType: "company",
        country: "US",
        object: "payout_account",
        livemode: true,
      };
      vi.mocked(fetch).mockResolvedValueOnce(
        jsonResponse({ success: true, data: verification }),
      );

      const result = await client().payouts.completeVerification({
        email: "ops@acme.com",
        businessType: "company",
        businessUrl: "https://acme.com",
        documentUrl: "https://files.acme.com/id.png",
        bank: { accountNumber: "1", accountHolderName: "Acme" },
        company: {
          name: "Acme",
          taxId: "12-3456789",
          address: {
            line1: "1 Main St",
            city: "NYC",
            postalCode: "10001",
            country: "US",
          },
          representative: { firstName: "Jane", lastName: "Doe" },
        },
      });

      const data = unwrap(result);
      expect(data.status).toBe("verified");
      expect(data.transfersEnabled).toBe(true);
      expect(data.alreadyExists).toBe(true);
    });
  });
});
