import type { ApiResponse, ListParams, RequestOptions } from "../types/common";
import type { CommetHTTPClient } from "../utils/http";
import type { BillingInterval } from "./plans";

export type SubscriptionStatus =
  | "draft"
  | "pending_payment"
  | "trialing"
  | "active"
  | "paused"
  | "past_due"
  | "canceled"
  | "expired";

export interface FeatureSummary {
  code: string;
  name: string;
  type: "boolean" | "metered" | "seats";
  enabled?: boolean;
  usage?: {
    current: number;
    included: number;
    overage: number;
  };
}

export interface ActiveSubscription {
  id: string;
  customerId: string;
  plan: {
    id: string;
    name: string;
    basePrice: number;
    billingInterval: BillingInterval;
  };
  name: string;
  description?: string;
  status: SubscriptionStatus;
  trialEndsAt?: string;
  currentPeriod: {
    start: string;
    end: string;
    daysRemaining: number;
  };
  features: FeatureSummary[];
  startDate: string;
  endDate?: string;
  billingDayOfMonth: number;
  nextBillingDate: string;
  checkoutUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  customerId: string;
  planId: string;
  planName: string;
  name: string;
  description?: string;
  status: SubscriptionStatus;
  billingInterval: BillingInterval;
  trialEndsAt?: string;
  startDate: string;
  endDate?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  billingDayOfMonth: number;
  createdAt: string;
  updatedAt: string;
}

// Customer identifier: mutually exclusive customerId or externalId
type CustomerIdentifier =
  | { customerId: string; externalId?: never }
  | { customerId?: never; externalId: string };

export type CreateSubscriptionParams = CustomerIdentifier & {
  planId: string;
  billingInterval?: BillingInterval;
  initialSeats?: Record<string, number>;
  skipTrial?: boolean;
  name?: string;
  startDate?: string;
};

export interface ChangePlanParams {
  planId: string;
  billingInterval?: BillingInterval;
  prorate?: boolean;
}

export interface PauseParams {
  reason?: string;
}

export interface CancelParams {
  reason?: string;
  immediate?: boolean;
}

export interface ListSubscriptionsParams extends ListParams {
  customerId?: string;
  externalId?: string;
  status?: SubscriptionStatus;
}

export type GetSubscriptionParams = CustomerIdentifier;

/**
 * Subscription resource for managing subscriptions (plan-first model)
 *
 * Each customer can only have ONE active subscription at a time.
 */
export class SubscriptionsResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /**
   * Create a subscription with a plan (plan-first model)
   *
   * @example
   * ```typescript
   * await commet.subscriptions.create({
   *   externalId: 'user_123',
   *   planId: 'plan_pro',
   *   billingInterval: 'yearly',
   *   initialSeats: { editor: 5 }
   * });
   * ```
   */
  async create(
    params: CreateSubscriptionParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Subscription>> {
    return this.httpClient.post("/subscriptions", params, options);
  }

  /**
   * Get the active subscription for a customer (includes summary)
   *
   * Returns the subscription with plan info, current period, and feature usage.
   * Since each customer can only have one active subscription, this returns
   * that subscription or null if none exists.
   *
   * @example
   * ```typescript
   * const sub = await commet.subscriptions.get({ externalId: 'user_123' });
   * if (sub.data) {
   *   console.log('Plan:', sub.data.plan.name);
   *   console.log('Days remaining:', sub.data.currentPeriod.daysRemaining);
   *   for (const feature of sub.data.features) {
   *     if (feature.usage) {
   *       console.log(`${feature.name}: ${feature.usage.current}/${feature.usage.included}`);
   *     }
   *   }
   * }
   * ```
   */
  async get(
    params: GetSubscriptionParams,
  ): Promise<ApiResponse<ActiveSubscription | null>> {
    return this.httpClient.get("/subscriptions/active", params);
  }

  /**
   * List subscriptions (includes canceled/expired for history)
   *
   * @example
   * ```typescript
   * const history = await commet.subscriptions.list({
   *   externalId: 'user_123',
   *   status: 'canceled'
   * });
   * ```
   */
  async list(
    params?: ListSubscriptionsParams,
  ): Promise<ApiResponse<Subscription[]>> {
    return this.httpClient.get("/subscriptions", params);
  }

  /**
   * Change the plan of a subscription (upgrade/downgrade)
   *
   * @example
   * ```typescript
   * await commet.subscriptions.changePlan('sub_xxx', {
   *   planId: 'plan_enterprise',
   *   prorate: true
   * });
   * ```
   */
  async changePlan(
    subscriptionId: string,
    params: ChangePlanParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Subscription>> {
    return this.httpClient.post(
      `/subscriptions/${subscriptionId}/change-plan`,
      params,
      options,
    );
  }

  /**
   * Pause a subscription
   *
   * @example
   * ```typescript
   * await commet.subscriptions.pause('sub_xxx', { reason: 'seasonal' });
   * ```
   */
  async pause(
    subscriptionId: string,
    params?: PauseParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Subscription>> {
    return this.httpClient.post(
      `/subscriptions/${subscriptionId}/pause`,
      params || {},
      options,
    );
  }

  /**
   * Resume a paused subscription
   *
   * @example
   * ```typescript
   * await commet.subscriptions.resume('sub_xxx');
   * ```
   */
  async resume(
    subscriptionId: string,
    options?: RequestOptions,
  ): Promise<ApiResponse<Subscription>> {
    return this.httpClient.post(
      `/subscriptions/${subscriptionId}/resume`,
      {},
      options,
    );
  }

  /**
   * Cancel a subscription
   *
   * @example
   * ```typescript
   * await commet.subscriptions.cancel('sub_xxx', {
   *   reason: 'switched_to_competitor'
   * });
   * ```
   */
  async cancel(
    subscriptionId: string,
    params?: CancelParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Subscription>> {
    return this.httpClient.post(
      `/subscriptions/${subscriptionId}/cancel`,
      params || {},
      options,
    );
  }
}
