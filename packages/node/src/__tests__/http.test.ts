import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CommetAPIError, CommetValidationError } from "../types/common";
import { CommetHTTPClient } from "../utils/http";

function createClient(overrides: Record<string, unknown> = {}) {
  return new CommetHTTPClient(
    {
      apiKey: "ck_test_abc123",
      timeout: 5000,
      ...overrides,
    },
    (overrides.environment as "sandbox" | "production") ?? "sandbox",
  );
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("CommetHTTPClient", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe("URL building", () => {
    it("builds sandbox URL with /api prefix", async () => {
      const client = createClient();
      vi.mocked(fetch).mockResolvedValueOnce(
        jsonResponse({ success: true, data: {} }),
      );

      await client.get("/customers");

      expect(fetch).toHaveBeenCalledWith(
        "https://sandbox.commet.co/api/customers",
        expect.any(Object),
      );
    });

    it("builds production URL", async () => {
      const client = createClient({ environment: "production" });
      vi.mocked(fetch).mockResolvedValueOnce(
        jsonResponse({ success: true, data: {} }),
      );

      await client.get("/customers");

      expect(fetch).toHaveBeenCalledWith(
        "https://commet.co/api/customers",
        expect.any(Object),
      );
    });

    it("appends query parameters", async () => {
      const client = createClient();
      vi.mocked(fetch).mockResolvedValueOnce(
        jsonResponse({ success: true, data: [] }),
      );

      await client.get("/customers", { limit: 10, cursor: "abc" });

      const calledUrl = vi.mocked(fetch).mock.calls[0][0] as string;
      const url = new URL(calledUrl);
      expect(url.searchParams.get("limit")).toBe("10");
      expect(url.searchParams.get("cursor")).toBe("abc");
    });

    it("omits null and undefined params", async () => {
      const client = createClient();
      vi.mocked(fetch).mockResolvedValueOnce(
        jsonResponse({ success: true, data: [] }),
      );

      await client.get("/customers", {
        limit: 10,
        cursor: undefined,
        status: null,
      });

      const calledUrl = vi.mocked(fetch).mock.calls[0][0] as string;
      const url = new URL(calledUrl);
      expect(url.searchParams.get("limit")).toBe("10");
      expect(url.searchParams.has("cursor")).toBe(false);
      expect(url.searchParams.has("status")).toBe(false);
    });

    it("normalizes endpoint without leading slash", async () => {
      const client = createClient();
      vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ success: true }));

      await client.get("customers");

      expect(fetch).toHaveBeenCalledWith(
        "https://sandbox.commet.co/api/customers",
        expect.any(Object),
      );
    });
  });

  describe("request headers", () => {
    it("sends API key and content-type headers", async () => {
      const client = createClient();
      vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ success: true }));

      await client.get("/test");

      const requestInit = vi.mocked(fetch).mock.calls[0][1] as RequestInit;
      const headers = requestInit.headers as Record<string, string>;
      expect(headers["x-api-key"]).toBe("ck_test_abc123");
      expect(headers["Content-Type"]).toBe("application/json");
      expect(headers["User-Agent"]).toMatch(/^commet-node\//);
    });

    it("includes custom idempotency key when provided", async () => {
      const client = createClient();
      vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ success: true }));

      await client.post("/test", { name: "x" }, { idempotencyKey: "idem_123" });

      const requestInit = vi.mocked(fetch).mock.calls[0][1] as RequestInit;
      const headers = requestInit.headers as Record<string, string>;
      expect(headers["Idempotency-Key"]).toBe("idem_123");
    });

    it("auto-generates idempotency key for POST with body", async () => {
      const client = createClient();
      vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ success: true }));

      await client.post("/test", { name: "x" });

      const requestInit = vi.mocked(fetch).mock.calls[0][1] as RequestInit;
      const headers = requestInit.headers as Record<string, string>;
      expect(headers["Idempotency-Key"]).toMatch(/^sdk_/);
    });
  });

  describe("error parsing", () => {
    it("throws CommetAPIError on 4xx response", async () => {
      const client = createClient({ retries: 0 });
      vi.mocked(fetch).mockResolvedValueOnce(
        jsonResponse({ message: "Customer not found", code: "not_found" }, 404),
      );

      await expect(client.get("/customers/missing")).rejects.toThrow(
        CommetAPIError,
      );

      try {
        await client.get("/customers/missing");
      } catch (_error) {
        // fetch was already consumed above, this block documents the shape
      }
    });

    it("includes statusCode and code on API error", async () => {
      const client = createClient({ retries: 0 });
      vi.mocked(fetch).mockResolvedValueOnce(
        jsonResponse({ message: "Forbidden", code: "forbidden" }, 403),
      );

      try {
        await client.get("/admin");
        expect.unreachable("should have thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(CommetAPIError);
        const apiErr = error as CommetAPIError;
        expect(apiErr.statusCode).toBe(403);
        expect(apiErr.code).toBe("forbidden");
        expect(apiErr.message).toBe("Forbidden");
      }
    });

    it("throws CommetValidationError on validation_error code", async () => {
      const client = createClient({ retries: 0 });
      vi.mocked(fetch).mockResolvedValueOnce(
        jsonResponse(
          {
            message: "Validation failed",
            code: "validation_error",
            details: [
              { field: "email", message: "is required" },
              { field: "email", message: "must be valid" },
              { field: "name", message: "is too short" },
            ],
          },
          422,
        ),
      );

      try {
        await client.post("/customers", {});
        expect.unreachable("should have thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(CommetValidationError);
        const valErr = error as CommetValidationError;
        expect(valErr.validationErrors.email).toEqual([
          "is required",
          "must be valid",
        ]);
        expect(valErr.validationErrors.name).toEqual(["is too short"]);
      }
    });

    it("throws CommetAPIError for invalid JSON on non-404", async () => {
      const client = createClient({ retries: 0 });
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response("Internal Server Error", {
          status: 500,
          headers: { "Content-Type": "text/plain" },
        }),
      );

      await expect(client.get("/broken")).rejects.toThrow(CommetAPIError);
    });

    it("throws CommetAPIError for 404 with invalid JSON", async () => {
      const client = createClient({ retries: 0 });
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response("<html>Not Found</html>", {
          status: 404,
          headers: { "Content-Type": "text/html" },
        }),
      );

      await expect(client.get("/missing-page")).rejects.toThrow(CommetAPIError);
    });
  });

  describe("retry logic", () => {
    const retryableStatuses = [408, 429, 500, 502, 503, 504];
    const nonRetryableStatuses = [400, 401, 403, 404, 422];

    for (const status of retryableStatuses) {
      it(`retries on ${status}`, async () => {
        const client = createClient({ retries: 2 });

        vi.mocked(fetch)
          .mockResolvedValueOnce(jsonResponse({ message: "error" }, status))
          .mockResolvedValueOnce(
            jsonResponse({ success: true, data: { id: "1" } }),
          );

        const promise = client.get("/test");
        await vi.advanceTimersByTimeAsync(10_000);
        const result = await promise;
        expect(result.success).toBe(true);
        expect(fetch).toHaveBeenCalledTimes(2);
      });
    }

    for (const status of nonRetryableStatuses) {
      it(`does not retry on ${status}`, async () => {
        const client = createClient({ retries: 3 });
        vi.mocked(fetch).mockResolvedValueOnce(
          jsonResponse({ message: "fail", code: "error" }, status),
        );

        await expect(client.get("/test")).rejects.toThrow();
        expect(fetch).toHaveBeenCalledTimes(1);
      });
    }

    it("respects max retries and then throws", async () => {
      const client = createClient({ retries: 2 });

      vi.mocked(fetch)
        .mockResolvedValueOnce(jsonResponse({ message: "error" }, 500))
        .mockResolvedValueOnce(jsonResponse({ message: "error" }, 500))
        .mockResolvedValueOnce(jsonResponse({ message: "error" }, 500));

      const promise = client.get("/test").catch((e: unknown) => e);
      await vi.advanceTimersByTimeAsync(30_000);
      const error = await promise;
      expect(error).toBeInstanceOf(CommetAPIError);
      expect(fetch).toHaveBeenCalledTimes(3);
    });

    it("retries on network errors (TypeError from fetch)", async () => {
      const client = createClient({ retries: 1 });

      vi.mocked(fetch)
        .mockRejectedValueOnce(new TypeError("fetch failed"))
        .mockResolvedValueOnce(jsonResponse({ success: true, data: {} }));

      const promise = client.get("/test");
      await vi.advanceTimersByTimeAsync(10_000);
      const result = await promise;
      expect(result.success).toBe(true);
      expect(fetch).toHaveBeenCalledTimes(2);
    });

    it("gives up after max retries on network errors", async () => {
      const client = createClient({ retries: 1 });

      vi.mocked(fetch)
        .mockRejectedValueOnce(new TypeError("fetch failed"))
        .mockRejectedValueOnce(new TypeError("fetch failed"));

      const promise = client.get("/test").catch((e: unknown) => e);
      await vi.advanceTimersByTimeAsync(10_000);
      const error = await promise;
      expect(error).toBeInstanceOf(TypeError);
      expect(fetch).toHaveBeenCalledTimes(2);
    });

    it("retries on AbortError (timeout)", async () => {
      const client = createClient({ retries: 1 });
      const abortError = new DOMException(
        "The operation was aborted",
        "AbortError",
      );

      vi.mocked(fetch)
        .mockRejectedValueOnce(abortError)
        .mockResolvedValueOnce(jsonResponse({ success: true, data: {} }));

      const promise = client.get("/test");
      await vi.advanceTimersByTimeAsync(10_000);
      const result = await promise;
      expect(result.success).toBe(true);
      expect(fetch).toHaveBeenCalledTimes(2);
    });

    it("retries on TimeoutError", async () => {
      const client = createClient({ retries: 1 });
      const timeoutError = new DOMException(
        "The operation timed out",
        "TimeoutError",
      );

      vi.mocked(fetch)
        .mockRejectedValueOnce(timeoutError)
        .mockResolvedValueOnce(jsonResponse({ success: true, data: {} }));

      const promise = client.get("/test");
      await vi.advanceTimersByTimeAsync(10_000);
      const result = await promise;
      expect(result.success).toBe(true);
      expect(fetch).toHaveBeenCalledTimes(2);
    });

    it("gives up after max retries on timeout errors", async () => {
      const client = createClient({ retries: 1 });
      const abortError = new DOMException(
        "The operation was aborted",
        "AbortError",
      );

      vi.mocked(fetch)
        .mockRejectedValueOnce(abortError)
        .mockRejectedValueOnce(abortError);

      const promise = client.get("/test").catch((e: unknown) => e);
      await vi.advanceTimersByTimeAsync(10_000);
      const error = await promise;
      expect(error).toBeInstanceOf(DOMException);
      expect(fetch).toHaveBeenCalledTimes(2);
    });

    it("uses exponential backoff delays", async () => {
      const client = createClient({ retries: 3 });

      vi.mocked(fetch)
        .mockResolvedValueOnce(jsonResponse({ message: "error" }, 500))
        .mockResolvedValueOnce(jsonResponse({ message: "error" }, 500))
        .mockResolvedValueOnce(jsonResponse({ message: "error" }, 500))
        .mockResolvedValueOnce(jsonResponse({ success: true }));

      const promise = client.get("/test");

      await vi.advanceTimersByTimeAsync(999);
      expect(fetch).toHaveBeenCalledTimes(1);

      await vi.advanceTimersByTimeAsync(1);
      expect(fetch).toHaveBeenCalledTimes(2);

      await vi.advanceTimersByTimeAsync(1999);
      expect(fetch).toHaveBeenCalledTimes(2);

      await vi.advanceTimersByTimeAsync(1);
      expect(fetch).toHaveBeenCalledTimes(3);

      await vi.advanceTimersByTimeAsync(3999);
      expect(fetch).toHaveBeenCalledTimes(3);

      await vi.advanceTimersByTimeAsync(1);
      expect(fetch).toHaveBeenCalledTimes(4);

      await promise;
    });
  });

  describe("HTTP methods", () => {
    it("sends GET requests", async () => {
      const client = createClient();
      vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ success: true }));

      await client.get("/test");

      const requestInit = vi.mocked(fetch).mock.calls[0][1] as RequestInit;
      expect(requestInit.method).toBe("GET");
      expect(requestInit.body).toBeUndefined();
    });

    it("sends POST with JSON body", async () => {
      const client = createClient();
      vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ success: true }));

      await client.post("/test", { name: "hello" });

      const requestInit = vi.mocked(fetch).mock.calls[0][1] as RequestInit;
      expect(requestInit.method).toBe("POST");
      expect(requestInit.body).toBe(JSON.stringify({ name: "hello" }));
    });

    it("sends PUT with JSON body", async () => {
      const client = createClient();
      vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ success: true }));

      await client.put("/test", { name: "updated" });

      const requestInit = vi.mocked(fetch).mock.calls[0][1] as RequestInit;
      expect(requestInit.method).toBe("PUT");
    });

    it("sends DELETE requests", async () => {
      const client = createClient();
      vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ success: true }));

      await client.delete("/test");

      const requestInit = vi.mocked(fetch).mock.calls[0][1] as RequestInit;
      expect(requestInit.method).toBe("DELETE");
    });
  });
});
