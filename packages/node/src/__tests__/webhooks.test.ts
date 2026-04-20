import crypto from "node:crypto";
import { describe, expect, it } from "vitest";
import { Webhooks } from "../resources/webhooks";

function signPayload(payload: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

describe("Webhooks", () => {
  const webhooks = new Webhooks();
  const secret = "whsec_test_secret_key_1234567890";
  const payload = JSON.stringify({
    event: "subscription.activated",
    timestamp: "2026-04-11T12:00:00Z",
    organizationId: "org_123",
    data: {
      id: "sub_abc",
      customerId: "cus_456",
      status: "active",
    },
  });

  describe("verify", () => {
    it("accepts a valid signature", () => {
      const signature = signPayload(payload, secret);
      expect(webhooks.verify({ payload, signature, secret })).toBe(true);
    });

    it("rejects an invalid signature", () => {
      expect(
        webhooks.verify({
          payload,
          signature: "deadbeef".repeat(8),
          secret,
        }),
      ).toBe(false);
    });

    it("rejects a tampered payload", () => {
      const signature = signPayload(payload, secret);
      const tampered = payload.replace(
        "subscription.activated",
        "subscription.canceled",
      );

      expect(webhooks.verify({ payload: tampered, signature, secret })).toBe(
        false,
      );
    });

    it("rejects a wrong secret", () => {
      const signature = signPayload(payload, secret);

      expect(
        webhooks.verify({
          payload,
          signature,
          secret: "whsec_wrong_secret",
        }),
      ).toBe(false);
    });

    it("returns false when signature is null", () => {
      expect(webhooks.verify({ payload, signature: null, secret })).toBe(false);
    });

    it("returns false when secret is empty", () => {
      const signature = signPayload(payload, secret);
      expect(webhooks.verify({ payload, signature, secret: "" })).toBe(false);
    });

    it("returns false when payload is empty", () => {
      expect(webhooks.verify({ payload: "", signature: "abc", secret })).toBe(
        false,
      );
    });

    it("returns false for non-hex signature (catches timingSafeEqual throw)", () => {
      expect(
        webhooks.verify({
          payload,
          signature: "not-valid-hex!!",
          secret,
        }),
      ).toBe(false);
    });

    it("returns false for signature with wrong length", () => {
      expect(
        webhooks.verify({
          payload,
          signature: "abcdef",
          secret,
        }),
      ).toBe(false);
    });
  });

  describe("verifyAndParse", () => {
    it("returns parsed payload for valid signature", () => {
      const signature = signPayload(payload, secret);
      const result = webhooks.verifyAndParse({
        rawBody: payload,
        signature,
        secret,
      });

      expect(result).not.toBeNull();
      expect(result?.event).toBe("subscription.activated");
      expect(result?.organizationId).toBe("org_123");
      expect(result?.data.customerId).toBe("cus_456");
    });

    it("returns null for invalid signature", () => {
      const result = webhooks.verifyAndParse({
        rawBody: payload,
        signature: "deadbeef".repeat(8),
        secret,
      });

      expect(result).toBeNull();
    });

    it("returns null for valid signature but invalid JSON body", () => {
      const badJson = "not json at all{{{";
      const signature = signPayload(badJson, secret);

      const result = webhooks.verifyAndParse({
        rawBody: badJson,
        signature,
        secret,
      });

      expect(result).toBeNull();
    });
  });
});
