import { describe, expect, it } from "vitest";
import { Commet } from "../client";

describe("Commet client", () => {
  it("creates client with valid key", () => {
    const client = new Commet({ apiKey: "ck_test_abc123" });
    expect(client).toBeInstanceOf(Commet);
  });

  it("rejects invalid API keys", () => {
    expect(() => new Commet({ apiKey: "" })).toThrow("API key is required");
    expect(() => new Commet({ apiKey: "sk_wrong_prefix" })).toThrow(
      "Invalid API key format",
    );
  });
});
