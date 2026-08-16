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

function client() {
  return new Commet({ apiKey: "ck_test_123" });
}

describe("TestClock — wire behavior", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("get", () => {
    it("issues a bodyless GET and parses the simulated-time state", async () => {
      const state = {
        simulatedTime: "2026-07-01T00:00:00.000Z",
        isActive: true,
        now: "2026-07-01T00:00:00.000Z",
        object: "test_clock",
        livemode: false,
      };
      vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(state));

      const result = await client().testClock.get();

      const { url, init } = lastCall();
      expect(url).toContain("/test-clock");
      expect(init.method).toBe("GET");
      expect(init.body).toBeUndefined();
      const data = result;
      expect(data.simulatedTime).toBe("2026-07-01T00:00:00.000Z");
      expect(data.isActive).toBe(true);
    });

    it("preserves a null simulatedTime (clock never advanced)", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        jsonResponse({
          simulatedTime: null,
          isActive: false,
          now: "2026-06-08T00:00:00.000Z",
          object: "test_clock",
          livemode: false,
        }),
      );

      const result = await client().testClock.get();
      const data = result;
      expect(data.simulatedTime).toBeNull();
      expect(data.isActive).toBe(false);
    });
  });

  describe("advance", () => {
    it("posts advanceDays in the body", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ isActive: true }));

      await client().testClock.advance({ advanceDays: 30 });

      const { url, init } = lastCall();
      expect(url).toContain("/test-clock");
      expect(init.method).toBe("POST");
      expect(JSON.parse(init.body as string)).toEqual({ advanceDays: 30 });
    });

    it("posts an absolute frozenTime when given instead of days", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ isActive: true }));

      await client().testClock.advance({
        frozenTime: "2026-12-31T23:59:59.000Z",
      });

      const body = JSON.parse(lastCall().init.body as string);
      expect(body.frozenTime).toBe("2026-12-31T23:59:59.000Z");
      expect(body).not.toHaveProperty("advanceDays");
    });
  });
});
