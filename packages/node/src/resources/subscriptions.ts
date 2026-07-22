import type { ApiResponse, RequestOptions } from "../types/common";
import type {
  BillingInterval,
  DiscountType,
  SubscriptionStatus,
} from "../types/enums";
import type {
  BalanceAdjustment,
  BalanceTopup,
  CanceledSubscription,
  CreditGrant,
  DeletedSubscriptionAddon,
  PaymentMethodUpdateCheckout,
  PlanChange,
  PreviewChange,
  ReactivatedSubscription,
  RecoveryLink,
  Subscription,
  SubscriptionAddon,
  UncanceledSubscription,
} from "../types/models";
import type { CommetHTTPClient } from "../utils/http";

export interface ListSubscriptionsParams {
  customerId?: string;
  status?: SubscriptionStatus;
}

export interface CreateSubscriptionParams {
  planId?: string;
  planCode?: string;
  customerId: string;
  billingInterval?: BillingInterval | null;
  initialSeats?: Record<string, number>;
  skipTrial?: boolean;
  customTrialDays?: number;
  introOffer?: {
    discountType: DiscountType;
    discountValue: number;
    durationCycles: number;
  };
  promoCode?: string;
  name?: string;
  /** @format date-time */
  startDate?: string;
  successUrl?: string;
}

export interface GetSubscriptionParams {
  id: string;
}

export interface GetActiveSubscriptionParams {
  customerId: string;
}

export interface CancelSubscriptionParams {
  id: string;
  reason?: string;
  immediate?: boolean;
}

export interface UncancelSubscriptionParams {
  id: string;
}

export interface ReactivateSubscriptionParams {
  id: string;
}

export interface CreateSubscriptionRecoveryLinkParams {
  id: string;
}

export interface UpdatePaymentMethodParams {
  id: string;
  successUrl?: string;
}

export interface ChangePlanParams {
  id: string;
  newPlanId?: string;
  newBillingInterval?: "weekly" | "monthly" | "quarterly" | "yearly";
  successUrl?: string;
}

export interface PreviewChangePlanParams {
  id: string;
  planId: string;
  billingInterval?: BillingInterval;
}

export interface ActivateAddonParams {
  id: string;
  addonId: string;
}

export interface DeactivateAddonParams {
  id: string;
  addonId: string;
}

export interface AdjustBalanceParams {
  id: string;
  amount: number;
  reason?: string;
  type?: "credits" | "balance";
}

export interface TopupBalanceParams {
  id: string;
  amount: number;
}

export interface PurchaseCreditsParams {
  id: string;
  creditPackId: string;
}

export class SubscriptionsResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /** List all subscriptions. Filter by customer ID or status. */
  async list(
    params?: ListSubscriptionsParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Array<Subscription>>> {
    return this.httpClient.get("/subscriptions", params, options);
  }

  /** Create a subscription for a customer. Requires planId or planCode plus customerId. */
  async create(
    params: CreateSubscriptionParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Subscription>> {
    return this.httpClient.post("/subscriptions", params, options);
  }

  /** Get a subscription by its public ID, regardless of status (including pending_payment and past_due). */
  async get(
    params: GetSubscriptionParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Subscription>> {
    const { id } = params;
    return this.httpClient.get(`/subscriptions/${id}`, undefined, options);
  }

  /** Get the active subscription for a customer. Returns null if none. */
  async getActive(
    params: GetActiveSubscriptionParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Subscription | null>> {
    return this.httpClient.get("/subscriptions/active", params, options);
  }

  /** Cancel immediately or at period end. */
  async cancel(
    params: CancelSubscriptionParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<CanceledSubscription>> {
    const { id, ...rest } = params;
    return this.httpClient.post(`/subscriptions/${id}/cancel`, rest, options);
  }

  /** Revert a scheduled cancellation. Only works when canceledAt is set but status is not yet 'canceled'. */
  async uncancel(
    params: UncancelSubscriptionParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<UncanceledSubscription>> {
    const { id } = params;
    return this.httpClient.post(`/subscriptions/${id}/uncancel`, {}, options);
  }

  /** Reactivates a subscription. A past_due subscription retries its outstanding renewal charge (recovering to active on success). A canceled subscription generates a fresh invoice, charges the saved card, and resets the billing period. On a successful charge the subscription becomes active; a declined charge returns an error with a recoveryUrl in the error details that can be sent to the customer to update their card. */
  async reactivate(
    params: ReactivateSubscriptionParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<ReactivatedSubscription>> {
    const { id } = params;
    return this.httpClient.post(`/subscriptions/${id}/reactivate`, {}, options);
  }

  /** Generates a hosted, signed recovery link that lets the customer pay the outstanding renewal charge for a past_due subscription. Unlike reactivate, which charges server-to-server, this returns a link the merchant can deliver through their own email, SMS, or dashboard. The link carries a self-contained signed token and stays valid until the charge is paid or the subscription is no longer past due. */
  async createRecoveryLink(
    params: CreateSubscriptionRecoveryLinkParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<RecoveryLink>> {
    const { id } = params;
    return this.httpClient.post(
      `/subscriptions/${id}/recovery-link`,
      {},
      options,
    );
  }

  /** Creates a hosted checkout session for the customer to update the subscription's default payment method. */
  async updatePaymentMethod(
    params: UpdatePaymentMethodParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<PaymentMethodUpdateCheckout>> {
    const { id, ...rest } = params;
    return this.httpClient.post(
      `/subscriptions/${id}/payment-method/update`,
      rest,
      options,
    );
  }

  /** Upgrade, downgrade, or change billing interval. */
  async changePlan(
    params: ChangePlanParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<PlanChange>> {
    const { id, ...rest } = params;
    return this.httpClient.post(
      `/subscriptions/${id}/change-plan`,
      rest,
      options,
    );
  }

  /** Preview proration details for an immediate plan change (an upgrade or a longer interval) without applying it. Returns credit, charge, and net amount. The target plan must belong to the same plan group as the current plan, otherwise a 400 with code `plans_not_in_same_group` is returned. A change between two free plans has nothing to prorate and returns a zero-amount estimate. Downgrades — a cheaper plan in the same group, or a shorter interval — are scheduled for the end of the current period instead of being prorated, so they return a 400 with code `plan_change_scheduled`; apply those via the change-plan endpoint. */
  async previewChange(
    params: PreviewChangePlanParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<PreviewChange>> {
    const { id, ...rest } = params;
    return this.httpClient.post(
      `/subscriptions/${id}/preview-change`,
      rest,
      options,
    );
  }

  /** Activate an add-on on a subscription. Charges a prorated amount for the current billing period. */
  async activateAddon(
    params: ActivateAddonParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<SubscriptionAddon>> {
    const { id, ...rest } = params;
    return this.httpClient.post(`/subscriptions/${id}/addons`, rest, options);
  }

  /** Deactivate an add-on from a subscription. */
  async deactivateAddon(
    params: DeactivateAddonParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<DeletedSubscriptionAddon>> {
    const { id, addonId } = params;
    return this.httpClient.delete(
      `/subscriptions/${id}/addons/${addonId}`,
      undefined,
      options,
    );
  }

  /** Adjust a subscription's balance or credits by a signed amount. Positive adds, negative subtracts. */
  async adjustBalance(
    params: AdjustBalanceParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<BalanceAdjustment>> {
    const { id, ...rest } = params;
    return this.httpClient.post(
      `/subscriptions/${id}/balance/adjust`,
      rest,
      options,
    );
  }

  /** Top up a subscription's balance. Charges the customer's payment method for the specified amount. */
  async topupBalance(
    params: TopupBalanceParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<BalanceTopup>> {
    const { id, ...rest } = params;
    return this.httpClient.post(
      `/subscriptions/${id}/balance/topup`,
      rest,
      options,
    );
  }

  /** Purchase a credit pack for a subscription. Charges the customer and adds credits to their balance. */
  async purchaseCredits(
    params: PurchaseCreditsParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<CreditGrant>> {
    const { id, ...rest } = params;
    return this.httpClient.post(`/subscriptions/${id}/credits`, rest, options);
  }
}
