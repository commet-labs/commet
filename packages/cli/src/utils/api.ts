import { loadAuth } from "./config";

/**
 * Get base URL for web app (for device auth flow)
 */
export function getWebBaseURL(environment: "sandbox" | "production"): string {
  if (environment === "production") {
    return "https://billing.commet.co";
  }
  return "https://sandbox.commet.co";
}

/**
 * Get base URL for API (for CLI endpoints after auth)
 */
export function getApiBaseURL(environment: "sandbox" | "production"): string {
  if (environment === "production") {
    return "https://api.commet.co";
  }
  return "https://api.sandbox.commet.co";
}

/**
 * @deprecated Use getWebBaseURL or getApiBaseURL instead
 */
export function getBaseURL(environment: "sandbox" | "production"): string {
  return getWebBaseURL(environment);
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<{ data?: T; error?: string }> {
  const auth = loadAuth();

  if (!auth) {
    return { error: "Not authenticated. Run `commet login` first." };
  }

  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${auth.token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({}))) as {
        message?: string;
        error?: string;
      };
      return {
        error:
          errorData.message ||
          errorData.error ||
          `Request failed with status ${response.status}`,
      };
    }

    const data = (await response.json()) as T;
    return { data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
