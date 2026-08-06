import { loadAuth } from "./config";
import { getClientInfoHeader, getUserAgent, markApiRequest } from "./telemetry";

export interface ApiRequestError {
  code: string;
  message: string;
  issues?: Array<{
    code: string;
    path: string;
    expected: string;
    received: unknown;
  }>;
}

export const BASE_URL = "https://commet.co";

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<{ data?: T; error?: ApiRequestError }> {
  const apiKey = process.env.COMMET_API_KEY;
  const auth = apiKey ? null : loadAuth();

  if (!apiKey && !auth) {
    return {
      error: {
        code: "auth_required",
        message: "Not authenticated. Run `commet login` first.",
      },
    };
  }

  try {
    markApiRequest();
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        ...(options.headers as Record<string, string>),
        "Content-Type": "application/json",
        "User-Agent": getUserAgent(),
        "commet-client-info": getClientInfoHeader(),
        ...(apiKey
          ? { "x-api-key": apiKey }
          : { Authorization: `Bearer ${auth!.token}` }),
      },
    });

    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({}))) as {
        message?: string;
        error?: string;
        code?: string;
        issues?: ApiRequestError["issues"];
      };
      return {
        error: {
          code: errorData.code ?? `http_${response.status}`,
          message:
            errorData.message ??
            errorData.error ??
            `Request failed with status ${response.status}`,
          ...(errorData.issues ? { issues: errorData.issues } : {}),
        },
      };
    }

    const data = (await response.json()) as T;
    return { data };
  } catch (error) {
    return {
      error: {
        code: "network_error",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
    };
  }
}
