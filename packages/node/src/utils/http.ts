import type {
  ApiResponse,
  CommetConfig,
  Environment,
  RequestOptions,
} from "../types/common";
import { CommetAPIError, CommetValidationError } from "../types/common";

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

export class CommetHTTPClient {
  private config: CommetConfig;
  private environment: Environment;
  private retryConfig: RetryConfig;

  constructor(config: CommetConfig, environment: Environment) {
    this.config = config;
    this.environment = environment;
    this.retryConfig = {
      ...DEFAULT_RETRY_CONFIG,
      maxRetries: config.retries ?? DEFAULT_RETRY_CONFIG.maxRetries,
    };
  }

  async get<T = unknown>(
    endpoint: string,
    params?: Record<string, unknown>,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    return this.request("GET", endpoint, undefined, options, params);
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

  /**
   * Core request method with retry logic
   */
  private async request<T = unknown>(
    method: string,
    endpoint: string,
    data?: unknown,
    options?: RequestOptions,
    params?: Record<string, unknown>,
  ): Promise<ApiResponse<T>> {
    const url = this.buildURL(endpoint, params);
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
      const headers: Record<string, string> = {
        "x-api-key": this.config.apiKey,
        "Content-Type": "application/json",
        "User-Agent": "commet/0.1.0",
      };

      if (options?.idempotencyKey) {
        headers["Idempotency-Key"] = options.idempotencyKey;
      } else if (method === "POST" && data) {
        headers["Idempotency-Key"] = this.generateIdempotencyKey();
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
      } catch (jsonError) {
        try {
          responseText = await response.text();
        } catch (textError) {
          responseText = "Failed to read response body";
        }
        if (this.config.debug) {
          console.log(
            "[Commet SDK] Failed to parse JSON response:",
            responseText,
          );
        }

        // For 404 errors with invalid JSON, return a graceful response
        // This handles cases like HTML error pages or empty responses
        if (response.status === 404) {
          return {
            success: false,
            error: "Resource not found",
          } as ApiResponse<T>;
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
          const delay = Math.min(
            this.retryConfig.baseDelay * 2 ** (attempt - 1),
            this.retryConfig.maxDelay,
          );

          if (this.config.debug) {
            console.log(
              `[Commet SDK] Retrying in ${delay}ms (attempt ${attempt}/${this.retryConfig.maxRetries})`,
            );
          }

          await this.sleep(delay);
          return this.executeRequest(method, url, data, options, attempt + 1);
        }

        // Log error response for debugging
        if (this.config.debug) {
          console.log(
            "[Commet SDK] Error response:",
            JSON.stringify(responseData, null, 2),
          );
        }

        // Type guard for error response
        const isErrorResponse = (
          data: unknown,
        ): data is {
          message?: string;
          errors?: Record<string, string[]>;
          code?: string;
          details?: unknown;
        } => {
          return typeof data === "object" && data !== null;
        };

        const errorData = isErrorResponse(responseData) ? responseData : {};

        // Handle different error types
        if (response.status === 400 && errorData.errors) {
          throw new CommetValidationError(
            errorData.message || "Validation failed",
            errorData.errors,
          );
        }

        throw new CommetAPIError(
          errorData.message || `Request failed with status ${response.status}`,
          response.status,
          errorData.code,
          errorData.details,
        );
      }

      if (this.config.debug) {
        console.log("[Commet SDK] Response:", responseData);
      }

      return responseData as ApiResponse<T>;
    } catch (error) {
      // Handle network errors and timeouts
      if (error instanceof TypeError && error.message.includes("fetch")) {
        if (attempt <= this.retryConfig.maxRetries) {
          const delay = Math.min(
            this.retryConfig.baseDelay * 2 ** (attempt - 1),
            this.retryConfig.maxDelay,
          );

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
   * Get base URL based on environment
   */
  private getBaseURL(): string {
    return this.environment === "production"
      ? "https://commet.co"
      : "https://sandbox.commet.co";
  }

  /**
   * Build full URL from endpoint and params
   */
  private buildURL(endpoint: string, params?: Record<string, unknown>): string {
    const baseURL = this.getBaseURL();

    // Construct full path with /api prefix
    const normalizedEndpoint = endpoint.startsWith("/")
      ? endpoint
      : `/${endpoint}`;
    const fullPath = `/api${normalizedEndpoint}`;

    // Debug logging
    if (this.config.debug) {
      console.log(
        `[Commet SDK] Building URL - baseURL: ${baseURL}, endpoint: ${endpoint}, fullPath: ${fullPath}`,
      );
    }

    const url = new URL(fullPath, baseURL);

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

  /**
   * Generate idempotency key
   */
  private generateIdempotencyKey(): string {
    // Generate UUID-like key for idempotency
    return `sdk_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
