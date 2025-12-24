import type { Commet } from "@commet/node";
import type { UnionToIntersection, User } from "better-auth";
import type { features } from "./plugins/features";
import type { portal } from "./plugins/portal";
import type { seats } from "./plugins/seats";
import type { subscriptions } from "./plugins/subscriptions";
import type { usage } from "./plugins/usage";
import type { webhooks } from "./plugins/webhooks";

/**
 * Plan mapping for easy reference in subscriptions
 */
export interface PlanMapping {
  /**
   * Plan ID from Commet
   */
  planId: string;
  /**
   * Easily identifiable slug for the plan
   */
  slug: string;
}

/**
 * Union type of all Commet plugins
 */
export type CommetPlugin =
  | ReturnType<typeof portal>
  | ReturnType<typeof subscriptions>
  | ReturnType<typeof features>
  | ReturnType<typeof usage>
  | ReturnType<typeof seats>
  | ReturnType<typeof webhooks>;

/**
 * Array of Commet plugins (at least one required)
 */
export type CommetPlugins = [CommetPlugin, ...CommetPlugin[]];

/**
 * Intersection of all plugin endpoints
 */
export type CommetEndpoints = UnionToIntersection<ReturnType<CommetPlugin>>;

/**
 * Customer creation parameters that can be customized
 */
export interface CustomerCreateParams {
  /**
   * Full name of the customer/company
   */
  fullName?: string;
  /**
   * Company domain
   */
  domain?: string;
  /**
   * Custom metadata
   */
  metadata?: Record<string, unknown>;
}

/**
 * Main Commet plugin options
 */
export interface CommetOptions {
  /**
   * Commet SDK client instance
   */
  client: Commet;
  /**
   * Automatically create a Commet customer when a user signs up
   * @default false
   */
  createCustomerOnSignUp?: boolean;
  /**
   * Custom function to provide additional customer creation parameters
   * Called when a new user signs up (if createCustomerOnSignUp is true)
   *
   * @param data - Object containing the user being created
   * @param request - Optional request object for additional context
   * @returns Customer creation parameters
   */
  getCustomerCreateParams?: (
    data: { user: Partial<User> },
    request?: Request
  ) => Promise<CustomerCreateParams> | CustomerCreateParams;
  /**
   * Array of Commet plugins to use
   */
  use: CommetPlugins;
}
