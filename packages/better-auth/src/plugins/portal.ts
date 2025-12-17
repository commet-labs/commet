import type { Commet } from "@commet/node";
import { APIError, sessionMiddleware } from "better-auth/api";
import { createAuthEndpoint } from "better-auth/plugins";

export interface PortalConfig {
  /**
   * URL to return to after leaving the customer portal
   */
  returnUrl?: string;
}

/**
 * Portal plugin - Provides customer portal access
 *
 * Endpoints:
 * - GET /customer/portal - Redirects to the Commet customer portal
 */
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
            const portalAccess = await commet.portal.getUrl({
              externalId: userId,
            });

            if (!portalAccess.success || !portalAccess.data) {
              throw new APIError("INTERNAL_SERVER_ERROR", {
                message:
                  portalAccess.message || "Failed to generate portal URL",
              });
            }

            // Append return URL if configured
            let portalUrl = portalAccess.data.portalUrl;
            if (returnUrl) {
              const url = new URL(portalUrl);
              url.searchParams.set("return_url", returnUrl);
              portalUrl = url.toString();
            }

            return ctx.json({
              url: portalUrl,
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

