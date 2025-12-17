import type { BetterAuthClientPlugin } from "better-auth";
import type { BetterFetchOption } from "better-auth/client";
import type { commet } from "./index";

/**
 * Commet client plugin for Better Auth
 *
 * Provides client-side methods to interact with Commet billing features.
 *
 * @example
 * ```typescript
 * import { createAuthClient } from "better-auth/react";
 * import { commetClient } from "@commet/better-auth";
 *
 * export const authClient = createAuthClient({
 *   plugins: [commetClient()]
 * });
 *
 * // Usage - you can always query state directly (no webhooks needed)
 * const { data: subscription } = await authClient.subscription.get();
 * const { data: features } = await authClient.features.list();
 * const { data: canUse } = await authClient.features.canUse({ code: "api_calls" });
 * await authClient.usage.track({ eventType: "api_call" });
 * await authClient.customer.portal(); // Redirect to portal
 * ```
 */
export const commetClient = () => {
  return {
    id: "commet-client",
    $InferServerPlugin: {} as ReturnType<typeof commet>,
    getActions: ($fetch) => {
      return {
        // Customer Portal
        customer: {
          /**
           * Redirect to the Commet customer portal
           */
          portal: async (fetchOptions?: BetterFetchOption) => {
            const res = await $fetch("/customer/portal", {
              method: "GET",
              ...fetchOptions,
            });

            if (res.error) {
              throw new Error(res.error.message);
            }

            const data = res.data as { url: string; redirect: boolean };

            if (data.redirect && typeof window !== "undefined") {
              window.location.href = data.url;
            }

            return data;
          },
        },

        // Subscription management
        subscription: {
          /**
           * Get the current subscription for the authenticated user
           */
          get: async (fetchOptions?: BetterFetchOption) => {
            return $fetch("/subscription", {
              method: "GET",
              ...fetchOptions,
            });
          },

          /**
           * Change the subscription plan (upgrade/downgrade)
           */
          changePlan: async (
            data: {
              planId?: string;
              slug?: string;
              billingInterval?: "monthly" | "quarterly" | "yearly";
            },
            fetchOptions?: BetterFetchOption,
          ) => {
            return $fetch("/subscription/change-plan", {
              method: "POST",
              body: data,
              ...fetchOptions,
            });
          },

          /**
           * Cancel the subscription
           */
          cancel: async (
            data?: { reason?: string; immediate?: boolean },
            fetchOptions?: BetterFetchOption,
          ) => {
            return $fetch("/subscription/cancel", {
              method: "POST",
              body: data ?? {},
              ...fetchOptions,
            });
          },
        },

        // Feature access
        features: {
          /**
           * List all features for the authenticated user
           */
          list: async (fetchOptions?: BetterFetchOption) => {
            return $fetch("/features", {
              method: "GET",
              ...fetchOptions,
            });
          },

          /**
           * Get a specific feature's access/usage
           */
          get: async (
            data: { code: string },
            fetchOptions?: BetterFetchOption,
          ) => {
            return $fetch(`/features/${data.code}`, {
              method: "GET",
              ...fetchOptions,
            });
          },

          /**
           * Check if a feature is enabled (boolean check)
           */
          check: async (
            data: { code: string },
            fetchOptions?: BetterFetchOption,
          ) => {
            return $fetch(`/features/${data.code}/check`, {
              method: "GET",
              ...fetchOptions,
            });
          },

          /**
           * Check if user can use one more unit of a feature
           * Returns { allowed: boolean, willBeCharged: boolean }
           */
          canUse: async (
            data: { code: string },
            fetchOptions?: BetterFetchOption,
          ) => {
            return $fetch(`/features/${data.code}/can-use`, {
              method: "GET",
              ...fetchOptions,
            });
          },
        },

        // Usage tracking
        usage: {
          /**
           * Track a usage event for the authenticated user
           */
          track: async (
            data: {
              eventType: string;
              value?: number;
              idempotencyKey?: string;
              properties?: Record<string, string>;
            },
            fetchOptions?: BetterFetchOption,
          ) => {
            return $fetch("/usage/track", {
              method: "POST",
              body: data,
              ...fetchOptions,
            });
          },
        },

        // Seat management
        seats: {
          /**
           * List all seat balances for the authenticated user
           */
          list: async (fetchOptions?: BetterFetchOption) => {
            return $fetch("/seats", {
              method: "GET",
              ...fetchOptions,
            });
          },

          /**
           * Add seats of a specific type
           */
          add: async (
            data: { seatType: string; count: number },
            fetchOptions?: BetterFetchOption,
          ) => {
            return $fetch("/seats/add", {
              method: "POST",
              body: data,
              ...fetchOptions,
            });
          },

          /**
           * Remove seats of a specific type
           */
          remove: async (
            data: { seatType: string; count: number },
            fetchOptions?: BetterFetchOption,
          ) => {
            return $fetch("/seats/remove", {
              method: "POST",
              body: data,
              ...fetchOptions,
            });
          },

          /**
           * Set seats to a specific count
           */
          set: async (
            data: { seatType: string; count: number },
            fetchOptions?: BetterFetchOption,
          ) => {
            return $fetch("/seats/set", {
              method: "POST",
              body: data,
              ...fetchOptions,
            });
          },

          /**
           * Set all seat types at once
           */
          setAll: async (
            data: { seats: Record<string, number> },
            fetchOptions?: BetterFetchOption,
          ) => {
            return $fetch("/seats/set-all", {
              method: "POST",
              body: data,
              ...fetchOptions,
            });
          },
        },
      };
    },
  } satisfies BetterAuthClientPlugin;
};

