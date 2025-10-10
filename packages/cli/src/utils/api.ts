import { loadAuth } from './config';

export function getBaseURL(environment: 'sandbox' | 'production'): string {
  if (environment === 'production') {
    return 'https://billing.commet.co';
  }
  // Sandbox uses the same domain for now - in future could be sandbox.commet.co
  return 'https://billing.commet.co';
  
  // NOTE: The environment is determined by the API key used, not the URL
  // API keys are scoped to either sandbox or production in the backend
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<{ data?: T; error?: string }> {
  const auth = loadAuth();

  if (!auth) {
    return { error: 'Not authenticated. Run `commet login` first.' };
  }

  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${auth.token}`,
        'Content-Type': 'application/json',
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
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

