import type {
  ApiResponse,
  GeneratedPlanCode,
  RequestOptions,
} from "../types/common";
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
    overageUnitPrice?: number;
  };
}

export interface ActiveSubscription {
  id: string;
  customerId: string;
  plan: {
    id: string;
    name: string;
    basePrice: number;
    billingInterval: BillingInterval | null;
  };
  name: string;
  description: string | null;
  status: SubscriptionStatus;
  trialEndsAt: string | null;
  currentPeriod: {
    start: string;
    end: string;
    daysRemaining: number;
  };
  features: FeatureSummary[];
  startDate: string;
  endDate: string | null;
  billingDayOfMonth: number;
  nextBillingDate: string;
  checkoutUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatedSubscription {
  id: string;
  customerId: string;
  planId: string;
  planName: string;
  name: string;
  status: SubscriptionStatus;
  billingInterval: BillingInterval | null;
  trialEndsAt: string | null;
  startDate: string;
  endDate: string | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  billingDayOfMonth: number;
  checkoutUrl: string | null;
  createdAt: string;
  updatedAt: string;
  introOfferEndsAt: string | null;
  introOfferDiscountType: "percentage" | "amount" | null;
  introOfferDiscountValue: number | null;
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
  checkoutUrl?: string;
  createdAt: string;
  updatedAt: string;
}

type PlanIdentifier =
  | { planCode: GeneratedPlanCode; planId?: never }
  | { planCode?: never; planId: string };

export type CreateSubscriptionParams = PlanIdentifier & {
    customerId: string;
  } & {
    billingInterval?: BillingInterval;
    initialSeats?: Record<string, number>;
    skipTrial?: boolean;
    name?: string;
    startDate?: string;
    successUrl?: string;
  };

export interface CancelParams {
  subscriptionId: string;
  reason?: string;
  immediate?: boolean;
}

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
   *   planCode: 'pro', // autocomplete works after `commet pull`
   *   billingInterval: 'yearly',
   *   initialSeats: { editor: 5 }
   * });
   * ```
   */
  async create(
    params: CreateSubscriptionParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<CreatedSubscription>> {
    return this.httpClient.post("/subscriptions", params, options);
  }

  /**
   * Get the active subscription for a customer
   *
   * @example
   * ```typescript
   * const sub = await commet.subscriptions.get('user_123');
   * ```
   */
  async get(
    customerId: string,
  ): Promise<ApiResponse<ActiveSubscription | null>> {
    return this.httpClient.get("/subscriptions/active", { customerId });
  }

  /**
   * Cancel a subscription
   *
   * @example
   * ```typescript
   * await commet.subscriptions.cancel({
   *   subscriptionId: 'sub_xxx',
   *   reason: 'switched_to_competitor'
   * });
   * ```
   */
  async cancel(
    params: CancelParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Subscription>> {
    return this.httpClient.post(
      `/subscriptions/${params.subscriptionId}/cancel`,
      params || {},
      options,
    );
  }
}
