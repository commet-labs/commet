import type { Commet } from "@commet/node";
import { APIError, sessionMiddleware } from "better-auth/api";
import { createAuthEndpoint } from "better-auth/plugins";

export interface FeaturesConfig {
  // Reserved for future configuration options
}

/**
 * Features plugin - Check feature access and usage
 *
 * Endpoints:
 * - GET /features - List all features for the authenticated user
 * - GET /features/:code - Get a specific feature's access/usage
 * - GET /features/:code/check - Check if feature is enabled (boolean check)
 * - GET /features/:code/can-use - Check if user can use one more unit
 */
export const features =
  (_config: FeaturesConfig = {}) =>
  (commet: Commet) => {
    return {
      listFeatures: createAuthEndpoint(
        "/commet/features",
        {
          method: "GET",
          use: [sessionMiddleware],
        },
        async (ctx) => {
          const userId = ctx.context.session?.user.id;

          if (!userId) {
            throw new APIError("UNAUTHORIZED", {
              message: "You must be logged in to view features",
            });
          }

          try {
            const result = await commet.features.list(userId);

            if (!result.success) {
              throw new APIError("INTERNAL_SERVER_ERROR", {
                message: result.message || "Failed to list features",
              });
            }

            return ctx.json(result.data ?? null);
          } catch (e: unknown) {
            if (e instanceof APIError) {
              throw e;
            }

            if (e instanceof Error) {
              ctx.context.logger.error(
                `Commet features list failed: ${e.message}`,
              );
            }

            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: "Failed to list features",
            });
          }
        },
      ),

      getFeature: createAuthEndpoint(
        "/commet/features/:code",
        {
          method: "GET",
          use: [sessionMiddleware],
        },
        async (ctx) => {
          const userId = ctx.context.session?.user.id;
          const code = ctx.params?.code;

          if (!userId) {
            throw new APIError("UNAUTHORIZED", {
              message: "You must be logged in to view feature",
            });
          }

          if (!code) {
            throw new APIError("BAD_REQUEST", {
              message: "Feature code is required",
            });
          }

          try {
            const result = await commet.features.get({
              externalId: userId,
              code,
            });

            if (!result.success) {
              throw new APIError("INTERNAL_SERVER_ERROR", {
                message: result.message || "Failed to get feature",
              });
            }

            return ctx.json(result.data ?? null);
          } catch (e: unknown) {
            if (e instanceof APIError) {
              throw e;
            }

            if (e instanceof Error) {
              ctx.context.logger.error(
                `Commet feature get failed: ${e.message}`,
              );
            }

            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: "Failed to get feature",
            });
          }
        },
      ),

      checkFeature: createAuthEndpoint(
        "/commet/features/:code/check",
        {
          method: "GET",
          use: [sessionMiddleware],
        },
        async (ctx) => {
          const userId = ctx.context.session?.user.id;
          const code = ctx.params?.code;

          if (!userId) {
            throw new APIError("UNAUTHORIZED", {
              message: "You must be logged in to check feature",
            });
          }

          if (!code) {
            throw new APIError("BAD_REQUEST", {
              message: "Feature code is required",
            });
          }

          try {
            const result = await commet.features.check({
              externalId: userId,
              code,
            });

            if (!result.success) {
              throw new APIError("INTERNAL_SERVER_ERROR", {
                message: result.message || "Failed to check feature",
              });
            }

            return ctx.json(result.data ?? null);
          } catch (e: unknown) {
            if (e instanceof APIError) {
              throw e;
            }

            if (e instanceof Error) {
              ctx.context.logger.error(
                `Commet feature check failed: ${e.message}`,
              );
            }

            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: "Failed to check feature",
            });
          }
        },
      ),

      canUseFeature: createAuthEndpoint(
        "/commet/features/:code/can-use",
        {
          method: "GET",
          use: [sessionMiddleware],
        },
        async (ctx) => {
          const userId = ctx.context.session?.user.id;
          const code = ctx.params?.code;

          if (!userId) {
            throw new APIError("UNAUTHORIZED", {
              message: "You must be logged in to check feature usage",
            });
          }

          if (!code) {
            throw new APIError("BAD_REQUEST", {
              message: "Feature code is required",
            });
          }

          try {
            const result = await commet.features.canUse({
              externalId: userId,
              code,
            });

            if (!result.success) {
              throw new APIError("INTERNAL_SERVER_ERROR", {
                message: result.message || "Failed to check feature usage",
              });
            }

            return ctx.json(result.data ?? null);
          } catch (e: unknown) {
            if (e instanceof APIError) {
              throw e;
            }

            if (e instanceof Error) {
              ctx.context.logger.error(
                `Commet feature canUse failed: ${e.message}`,
              );
            }

            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: "Failed to check feature usage",
            });
          }
        },
      ),
    };
  };
