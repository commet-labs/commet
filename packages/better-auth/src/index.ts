import type { BetterAuthPlugin } from "better-auth";
import {
  onAfterUserCreate,
  onBeforeUserCreate,
  onUserDelete,
  onUserUpdate,
} from "./hooks/customer";
import type { CommetEndpoints, CommetOptions } from "./types";

// Re-export client plugin
export { commetClient } from "./client";

// Re-export all plugins
export { portal } from "./plugins/portal";
export type { PortalConfig } from "./plugins/portal";

export { subscriptions } from "./plugins/subscriptions";
export type { SubscriptionsConfig } from "./plugins/subscriptions";

export { features } from "./plugins/features";
export type { FeaturesConfig } from "./plugins/features";

export { usage } from "./plugins/usage";
export type { UsageConfig } from "./plugins/usage";

export { seats } from "./plugins/seats";
export type { SeatsConfig } from "./plugins/seats";

export { webhooks } from "./plugins/webhooks";
export type { WebhooksConfig, WebhookHandler } from "./plugins/webhooks";

// Re-export types
export type {
  CommetOptions,
  CommetPlugin,
  CommetPlugins,
  CommetEndpoints,
  CustomerCreateParams,
  PlanMapping,
} from "./types";

/**
 * Commet plugin for Better Auth
 *
 * Integrates Commet billing with Better Auth authentication.
 *
 * @example
 * ```typescript
 * import { betterAuth } from "better-auth";
 * import { commet, portal, subscriptions, features, usage, seats, webhooks } from "@commet/better-auth";
 * import { Commet } from "@commet/node";
 *
 * const commetClient = new Commet({
 *   apiKey: process.env.COMMET_API_KEY,
 *   environment: "production"
 * });
 *
 * const auth = betterAuth({
 *   plugins: [
 *     commet({
 *       client: commetClient,
 *       createCustomerOnSignUp: true,
 *       getCustomerCreateParams: ({ user }) => ({
 *         legalName: user.name,
 *         metadata: { source: "signup" }
 *       }),
 *       use: [
 *         portal({ returnUrl: "/dashboard" }),
 *         subscriptions(),
 *         features(),
 *         usage(),
 *         seats(),
 *         // Webhooks are OPTIONAL - you can always query state directly
 *         webhooks({
 *           secret: process.env.COMMET_WEBHOOK_SECRET,
 *           onSubscriptionActivated: async (payload) => { ... }
 *         })
 *       ]
 *     })
 *   ]
 * });
 * ```
 */
export const commet = <O extends CommetOptions>(options: O) => {
  // Compose all plugin endpoints
  const plugins = options.use
    .map((use) => use(options.client))
    .reduce((acc, plugin) => {
      Object.assign(acc, plugin);
      return acc;
    }, {} as CommetEndpoints);

  return {
    id: "commet",
    endpoints: {
      ...plugins,
    },
    init() {
      return {
        options: {
          databaseHooks: {
            user: {
              create: {
                before: onBeforeUserCreate(options),
                after: onAfterUserCreate(options),
              },
              update: {
                after: onUserUpdate(options),
              },
              delete: {
                after: onUserDelete(options),
              },
            },
          },
        },
      };
    },
  } satisfies BetterAuthPlugin;
};

