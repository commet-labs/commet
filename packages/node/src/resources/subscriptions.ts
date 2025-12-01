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
}

export interface CancelParams {
  reason?: string;
  immediate?: boolean;
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
   * Create a subscription with a plan
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
   * Get the active subscription for a customer
   *
   * @example
   * ```typescript
   * const sub = await commet.subscriptions.get({ externalId: 'user_123' });
   * ```
   */
  async get(
    params: GetSubscriptionParams,
  ): Promise<ApiResponse<ActiveSubscription | null>> {
    return this.httpClient.get("/subscriptions/active", params);
  }

  /**
   * Change the plan of a subscription (upgrade/downgrade)
   *
   * @example
   * ```typescript
   * await commet.subscriptions.changePlan('sub_xxx', {
   *   planId: 'plan_enterprise'
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
