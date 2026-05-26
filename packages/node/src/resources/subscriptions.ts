import type { ApiResponse, RequestOptions } from "../types/common";
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
  type: "boolean" | "usage" | "seats";
  enabled?: boolean;
  usage?: {
    current: number;
    included: number;
    overage: number;
    overageUnitPrice?: number;
  };
}

export interface CreditsSummary {
  remaining: number;
  included: number;
  purchased: number;
}

export interface BalanceSummary {
  remaining: number;
  included: number;
  currency: string;
}

export interface CancellationSummary {
  scheduledAt: string;
  reason: string | null;
  effectiveAt: string;
}

export interface DiscountSummary {
  type: "percentage" | "amount";
  value: number;
  name: string | null;
  endsAt: string | null;
}

export type ConsumptionModel = "metered" | "credits" | "balance";

export interface ActiveSubscription {
  id: string;
  object: "subscription";
  livemode: boolean;
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
  consumptionModel: ConsumptionModel | null;
  trialEndsAt: string | null;
  currentPeriod: {
    start: string;
    end: string;
    daysRemaining: number;
  };
  features: FeatureSummary[];
  credits: CreditsSummary | null;
  balance: BalanceSummary | null;
  cancellation: CancellationSummary | null;
  discount: DiscountSummary | null;
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
  object: "subscription";
  livemode: boolean;
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
  object: "subscription";
  livemode: boolean;
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
  | { planCode: string; planId?: never }
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

export interface GetActiveParams {
  customerId: string;
}

export interface CancelParams {
  id: string;
  reason?: string;
  immediate?: boolean;
}

export interface UncancelParams {
  id: string;
}

export interface ChangePlanParams {
  id: string;
  newPlanId?: string;
  newBillingInterval?: BillingInterval;
}

export interface ChangePlanResult {
  id: string;
  scheduled: boolean;
  customerId?: string;
  previousPlan?: { id: string; name: string };
  currentPlan?: { id: string; name: string; price: number };
  billingInterval?: string;
  billing?: {
    credit: number;
    creditsApplied: number;
    charge: number;
    taxAmount: number;
    netAmount: number;
    totalCharged: number;
    remainingCreditBalance: number;
  };
  invoiceId?: string;
  scheduledFor?: string;
  changeType?: string;
  requiresCheckout?: boolean;
  checkoutUrl?: string;
}

/** Each customer can only have one active subscription at a time. */
export class SubscriptionsResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /** Returns a `checkoutUrl` when payment is required before activation. */
  async create(
    params: CreateSubscriptionParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<CreatedSubscription>> {
    return this.httpClient.post("/subscriptions", params, options);
  }

  async getActive(
    params: GetActiveParams,
  ): Promise<ApiResponse<ActiveSubscription | null>> {
    return this.httpClient.get("/subscriptions/active", {
      customerId: params.customerId,
    });
  }

  /** Schedules cancellation at period end by default. Set `immediate: true` to cancel now. */
  async cancel(
    params: CancelParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Subscription>> {
    const { id, ...body } = params;
    return this.httpClient.post(`/subscriptions/${id}/cancel`, body, options);
  }

  /** Only works on subscriptions with a pending cancellation — cannot revert already-canceled. */
  async uncancel(
    params: UncancelParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Subscription>> {
    return this.httpClient.post(
      `/subscriptions/${params.id}/uncancel`,
      {},
      options,
    );
  }

  /** Upgrades execute immediately with proration. Downgrades are scheduled for end of period. */
  async changePlan(
    params: ChangePlanParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<ChangePlanResult>> {
    const { id, ...body } = params;
    return this.httpClient.post(
      `/subscriptions/${id}/change-plan`,
      body,
      options,
    );
  }
}
