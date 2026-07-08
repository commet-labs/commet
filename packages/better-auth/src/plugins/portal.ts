import type { Commet } from "@commet/node";
import {
  APIError,
  createAuthEndpoint,
  sessionMiddleware,
} from "better-auth/api";

/**
 * Portal plugin - Provides customer portal access
 *
 * Endpoints:
 * - GET /customer/portal - Redirects to the Commet customer portal
 */
export interface PortalConfig {
  /** Absolute or app-relative URL to return to after leaving the customer portal */
  returnUrl?: string;
}

function resolvePortalReturnUrl(
  returnUrl: string,
  baseUrl: string,
): string | null {
  try {
    const parsedUrl = new URL(returnUrl, baseUrl);
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return null;
    }

    return parsedUrl.toString();
  } catch {
    return null;
  }
}

export const portal =
  ({ returnUrl }: PortalConfig = {}) =>
  (commet: Commet) => {
    return {
      portal: createAuthEndpoint(
        "/commet/portal",
        {
          method: "GET",
          use: [sessionMiddleware],
        },
        async (ctx) => {
          const userId = ctx.context.session?.user.id;

          if (!userId) {
            throw new APIError("UNAUTHORIZED", {
              message: "You must be logged in to access the customer portal",
            });
          }

          try {
            const resolvedReturnUrl = returnUrl
              ? resolvePortalReturnUrl(returnUrl, ctx.context.baseURL)
              : null;

            const portalAccess = await commet.portal.getUrl({
              customerId: userId,
              ...(resolvedReturnUrl ? { returnUrl: resolvedReturnUrl } : {}),
            });

            if (!portalAccess.success || !portalAccess.data) {
              throw new APIError("INTERNAL_SERVER_ERROR", {
                message:
                  portalAccess.error?.message ||
                  "Failed to generate portal URL",
              });
            }

            return ctx.json({
              url: portalAccess.data.portalUrl,
              redirect: true,
            });
          } catch (e: unknown) {
            if (e instanceof APIError) {
              throw e;
            }

            if (e instanceof Error) {
              ctx.context.logger.error(
                `Commet portal access failed: ${e.message}`,
              );
            }

            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: "Failed to access customer portal",
            });
          }
        },
      ),
    };
  };
