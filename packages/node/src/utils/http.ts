import type {
  ApiErrorDetail,
  ApiResponse,
  CommetClientOptions,
  RequestOptions,
} from "../types/common";
import { CommetAPIError, CommetValidationError } from "../types/common";
import { API_VERSION } from "../version";
import {
  formatRequestMetrics,
  getClientInfoHeader,
  getUserAgent,
} from "./telemetry";

const BASE_URL = "https://commet.co";

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  retryableStatusCodes: number[];
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000, // 1s
  maxDelay: 8000, // 8s
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
};

// Upper bound for server-provided Retry-After waits, so a misbehaving proxy
// cannot stall the client indefinitely.
const RETRY_AFTER_CAP_MS = 30000;

export class CommetHTTPClient {
  private config: CommetClientOptions;
  private retryConfig: RetryConfig;
  private telemetryEnabled: boolean;
  private lastRequestMetrics: { requestId: string; durationMs: number } | null =
    null;

  constructor(config: CommetClientOptions) {
    this.config = config;
    this.telemetryEnabled = config.telemetry !== false;
    this.retryConfig = {
      ...DEFAULT_RETRY_CONFIG,
      maxRetries: config.retries ?? DEFAULT_RETRY_CONFIG.maxRetries,
    };
  }

  async get<T = unknown>(
    endpoint: string,
    params?: Record<string, unknown> | object,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    return this.request(
      "GET",
      endpoint,
      undefined,
      options,
      params as Record<string, unknown>,
    );
  }

  async post<T = unknown>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    return this.request("POST", endpoint, data, options);
  }

  async put<T = unknown>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    return this.request("PUT", endpoint, data, options);
  }

  async delete<T = unknown>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    return this.request("DELETE", endpoint, data, options);
  }

  private resolveApiVersion(options?: RequestOptions): string {
    return options?.apiVersion ?? this.config.apiVersion ?? API_VERSION;
  }

  private static readonly BODY_METHODS = new Set(["POST", "PUT", "PATCH"]);

  private async request<T = unknown>(
    method: string,
    endpoint: string,
    data?: unknown,
    options?: RequestOptions,
    params?: Record<string, unknown>,
  ): Promise<ApiResponse<T>> {
    const url = this.buildURL(endpoint, params);

    // Generate idempotency key once before retries — all attempts reuse the same key
    if (
      CommetHTTPClient.BODY_METHODS.has(method) &&
      this.retryConfig.maxRetries > 0 &&
      !options?.idempotencyKey
    ) {
      options = { ...options, idempotencyKey: this.generateIdempotencyKey() };
    }

    return this.executeRequest(method, url, data, options);
  }

  /**
   * Execute real API request with retry logic
   */
  private async executeRequest<T = unknown>(
    method: string,
    url: string,
    data?: unknown,
    options?: RequestOptions,
    attempt = 1,
  ): Promise<ApiResponse<T>> {
    try {
      const apiVersion = this.resolveApiVersion(options);

      const headers: Record<string, string> = {
        "x-api-key": this.config.apiKey,
        "commet-version": apiVersion,
        "Content-Type": "application/json",
        "User-Agent": getUserAgent(),
      };

      if (this.telemetryEnabled) {
        headers["commet-client-info"] = getClientInfoHeader();
        if (this.lastRequestMetrics) {
          headers["commet-client-telemetry"] = formatRequestMetrics(
            this.lastRequestMetrics,
          );
          this.lastRequestMetrics = null;
        }
      }

      if (options?.idempotencyKey) {
        headers["Idempotency-Key"] = options.idempotencyKey;
      }

      const requestConfig: RequestInit = {
        method,
        headers,
        signal: AbortSignal.timeout(
          options?.timeout ?? this.config.timeout ?? 30000,
        ),
      };

      if (data) {
        requestConfig.body = JSON.stringify(data);
      }

      if (this.config.debug) {
        console.log(`[Commet SDK] ${method} ${url}`);
        if (data) {
          console.log("Request data:", JSON.stringify(data, null, 2));
        }
      }

      const requestStart = Date.now();
      const response = await fetch(url, requestConfig);

      if (this.config.debug) {
        console.log(
          `[Commet SDK] Response status: ${response.status} ${response.statusText}`,
        );
      }

      let responseData: unknown;
      let responseText: string;

      try {
        responseData = await response.json();
        responseText = "";
      } catch (_jsonError) {
        try {
          responseText = await response.text();
        } catch (_textError) {
          responseText = "Failed to read response body";
        }
        if (this.config.debug) {
          console.log(
            "[Commet SDK] Failed to parse JSON response:",
            responseText,
          );
        }

        throw new CommetAPIError(
          `Invalid JSON response: ${response.status} ${response.statusText}`,
          response.status,
          "INVALID_JSON",
          { responseText },
        );
      }

      if (!response.ok) {
        // Check if we should retry
        if (
          attempt <= this.retryConfig.maxRetries &&
          this.retryConfig.retryableStatusCodes.includes(response.status)
        ) {
          const delay = this.retryDelayMs(attempt, response);

          if (delay !== null) {
            if (this.config.debug) {
              console.log(
                `[Commet SDK] Retrying in ${delay}ms (attempt ${attempt}/${this.retryConfig.maxRetries})`,
              );
            }

            await this.sleep(delay);
            return this.executeRequest(method, url, data, options, attempt + 1);
          }
        }

        // Log error response for debugging
        if (this.config.debug) {
          console.log(
            "[Commet SDK] Error response:",
            JSON.stringify(responseData, null, 2),
          );
        }

        const parsed =
          typeof responseData === "object" && responseData !== null
            ? (responseData as Record<string, unknown>)
            : {};
        const errorObj =
          typeof parsed.error === "object" && parsed.error !== null
            ? (parsed.error as Record<string, unknown>)
            : {};

        const errorDetail: ApiErrorDetail = {
          type: (errorObj.type as string) ?? "api_error",
          code: (errorObj.code as string) ?? "unknown",
          message:
            (errorObj.message as string) ??
            `Request failed with status ${response.status}`,
          param: errorObj.param as string | undefined,
          details: errorObj.details,
          doc_url: errorObj.doc_url as string | undefined,
        };

        if (
          errorDetail.code === "validation_error" &&
          Array.isArray(errorDetail.details)
        ) {
          const errors: Record<string, string[]> = {};
          for (const detail of errorDetail.details as Array<{
            field: string;
            message: string;
          }>) {
            if (!errors[detail.field]) errors[detail.field] = [];
            errors[detail.field].push(detail.message);
          }
          throw new CommetValidationError(errorDetail.message, errors);
        }

        throw new CommetAPIError(
          errorDetail.message,
          response.status,
          errorDetail.code,
          errorDetail.details,
          errorDetail,
        );
      }

      if (this.config.debug) {
        console.log("[Commet SDK] Response:", responseData);
      }

      if (this.telemetryEnabled) {
        this.lastRequestMetrics = {
          requestId:
            response.headers.get("x-request-id") ?? `req_${Date.now()}`,
          durationMs: Date.now() - requestStart,
        };
      }

      return responseData as ApiResponse<T>;
    } catch (error) {
      // Handle network errors and timeouts
      const isNetworkError =
        error instanceof TypeError && error.message.includes("fetch");
      const isTimeoutError =
        error instanceof DOMException && error.name === "AbortError";
      const isTimeoutErrorModern =
        typeof globalThis.DOMException !== "undefined" &&
        error instanceof DOMException &&
        error.name === "TimeoutError";

      if (isNetworkError || isTimeoutError || isTimeoutErrorModern) {
        if (attempt <= this.retryConfig.maxRetries) {
          const delay = this.backoffDelayMs(attempt);

          if (this.config.debug) {
            console.log(`[Commet SDK] Network error, retrying in ${delay}ms`);
          }

          await this.sleep(delay);
          return this.executeRequest(method, url, data, options, attempt + 1);
        }
      }

      throw error;
    }
  }

  /**
   * Build full URL from endpoint and params
   */
  private buildURL(endpoint: string, params?: Record<string, unknown>): string {
    // Construct full path with /api prefix
    const normalizedEndpoint = endpoint.startsWith("/")
      ? endpoint
      : `/${endpoint}`;
    const fullPath = `/api/v1${normalizedEndpoint}`;

    // Debug logging
    if (this.config.debug) {
      console.log(
        `[Commet SDK] Building URL - endpoint: ${endpoint}, fullPath: ${fullPath}`,
      );
    }

    const url = new URL(fullPath, BASE_URL);

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      }
    }

    const finalUrl = url.toString();

    // Debug final URL
    if (this.config.debug) {
      console.log(`[Commet SDK] Final URL: ${finalUrl}`);
    }

    return finalUrl;
  }

  // 429 retries wait exactly what the rate limiter reports in Retry-After
  // (seconds until the window resets); a 429 without the header did not come
  // from the rate limiter, so it is not retried (returns null). Exponential
  // backoff only applies to statuses that carry no server-provided wait.
  private retryDelayMs(attempt: number, response: Response): number | null {
    if (response.status === 429) {
      const retryAfterSeconds = Number(response.headers.get("retry-after"));
      if (Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0) {
        return Math.min(retryAfterSeconds * 1000, RETRY_AFTER_CAP_MS);
      }
      return null;
    }
    return this.backoffDelayMs(attempt);
  }

  private backoffDelayMs(attempt: number): number {
    return Math.min(
      this.retryConfig.baseDelay * 2 ** (attempt - 1),
      this.retryConfig.maxDelay,
    );
  }

  private generateIdempotencyKey(): string {
    return `commet-node-retry-${crypto.randomUUID()}`;
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
