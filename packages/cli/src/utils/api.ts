import { loadAuth } from "./config";

export const BASE_URL = "https://beta.commet.co";

export function bypassHeaders(): Record<string, string> {
  return {
    Cookie:
      "_vercel_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJiZXRhLmNvbW1ldC5jbyIsImJ5cGFzcyI6IjFERUlTcngyczA3YXFjVmhBbVhDUnhjTEdvOHNZaGFTIiwiaWF0IjoxNzc4NjkxNzMxLCJzdWIiOiJwcm90ZWN0aW9uLWJ5cGFzcy1hdXRvbWF0aW9uIn0.ONjvMguLM-7wXfTppY1cQveu9IN05x4VSblB39YpW_A",
    Origin: "https://beta.commet.co",
  };
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
        ...bypassHeaders(),
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
