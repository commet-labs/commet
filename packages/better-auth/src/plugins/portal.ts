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
export const portal =
  () =>
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
              customerId: userId,
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
