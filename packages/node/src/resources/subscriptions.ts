import type {
  ApiResponse,
  ListParams,
  RequestOptions,
  RetrieveOptions,
} from "../types/common";
import type { CommetHTTPClient } from "../utils/http";
import type { BillingInterval, PlanID } from "./plans";

export type SubscriptionStatus =
  | "draft"
  | "pending_payment"
  | "trialing"
  | "active"
  | "paused"
  | "past_due"
  | "canceled"
  | "expired";

export interface Subscription {
  id: string; // publicId (e.g., "sub_xxx")
  customerId: string;
  externalId?: string;
  planId: string;
  planName: string;
  name: string;
  description?: string;
  status: SubscriptionStatus;
  billingInterval: BillingInterval;
  trialEndsAt?: string; // ISO datetime
  startDate: string; // ISO datetime
  endDate?: string; // ISO datetime
  currentPeriodStart?: string; // ISO datetime
  currentPeriodEnd?: string; // ISO datetime
  billingDayOfMonth: number; // 1-31
  checkoutUrl?: string; // Stripe checkout URL for pending payment
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionWithPlan extends Subscription {
  plan: {
    id: string;
    name: string;
    price: number;
    billingInterval: BillingInterval;
  };
  currentPeriod: {
    start: string;
    end: string;
  };
}

export interface FeatureSummary {
  code: string;
  name: string;
  type: "boolean" | "metered" | "seats";
  enabled?: boolean;
  usage?: {
    current: number;
    included: number;
    overage: number;
    estimatedCost: number;
  };
}

export interface SubscriptionSummary {
  subscription: {
    id: string;
    status: SubscriptionStatus;
    trialEndsAt?: string;
  };
  plan: {
    id: string;
    name: string;
    basePrice: number;
    billingInterval: BillingInterval;
  };
  currentPeriod: {
    start: string;
    end: string;
    daysRemaining: number;
  };
  features: FeatureSummary[];
  estimatedTotal: number;
  nextBillingDate: string;
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
   * // Subscribe to a plan
   * await commet.subscriptions.create({
   *   externalId: 'user_123',
   *   planId: 'plan_pro',
   *   billingInterval: 'yearly',
   *   initialSeats: { editor: 5 }
   * });
   *
   * // Skip trial period
   * await commet.subscriptions.create({
   *   customerId: 'cus_xxx',
   *   planId: 'plan_enterprise',
   *   skipTrial: true
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
   * Since each customer can only have one active subscription,
   * this returns that subscription or null if none exists.
   *
   * @example
   * ```typescript
   * const sub = await commet.subscriptions.get({ externalId: 'user_123' });
   * if (sub.data) {
   *   console.log('Current plan:', sub.data.plan.name);
   * }
   * ```
   */
  async get(
    params: GetSubscriptionParams,
  ): Promise<ApiResponse<SubscriptionWithPlan | null>> {
    return this.httpClient.get("/subscriptions/active", params);
  }

  /**
   * Retrieve a subscription by ID
   */
  async retrieve(
    subscriptionId: string,
    options?: RetrieveOptions,
  ): Promise<ApiResponse<Subscription>> {
    const params = options?.expand
      ? { expand: options.expand.join(",") }
      : undefined;
    return this.httpClient.get(`/subscriptions/${subscriptionId}`, params);
  }

  /**
   * List subscriptions with optional filters
   *
   * @example
   * ```typescript
   * // List all subscriptions for a customer
   * await commet.subscriptions.list({
   *   externalId: 'user_123'
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
   * // Upgrade to enterprise plan
   * await commet.subscriptions.changePlan('sub_xxx', {
   *   planId: 'plan_enterprise',
   *   billingInterval: 'yearly',
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
   * Get a summary of the current billing period
   *
   * Returns usage, seat counts, and estimated total for the current period.
   *
   * @example
   * ```typescript
   * const summary = await commet.subscriptions.getSummary('sub_xxx');
   * console.log('Estimated total:', summary.data.estimatedTotal);
   * console.log('Days remaining:', summary.data.currentPeriod.daysRemaining);
   * ```
   */
  async getSummary(
    subscriptionId: string,
  ): Promise<ApiResponse<SubscriptionSummary>> {
    return this.httpClient.get(`/subscriptions/${subscriptionId}/summary`);
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
