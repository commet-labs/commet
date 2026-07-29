import type { RequestOptions } from "../types/common";
import type { SubscriptionStatus } from "../types/enums";
import type {
  BalanceAdjustment,
  BalanceTopup,
  CreatedSubscription,
  CreditGrant,
  DeletedSubscriptionAddon,
  PaymentMethodUpdateCheckout,
  PlanChange,
  PreviewChange,
  ReactivatedSubscription,
  RecoveryLink,
  Subscription,
  SubscriptionAddon,
  SubscriptionSummary,
} from "../types/models";
import type { CommetHTTPClient } from "../utils/http";

export interface DeactivateAddonParams {
  id: string;
  addonId: string;
}

export interface ActivateAddonParams {
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

export interface CancelSubscriptionParams {
  id: string;
  reason?: string;
  immediate?: boolean;
}

export interface ChangePlanParams {
  id: string;
  newPlanId?: string;
  newBillingInterval?: "weekly" | "monthly" | "quarterly" | "yearly";
  successUrl?: string;
  offerId?: string;
}

export interface PurchaseCreditsParams {
  id: string;
  creditPackId: string;
}

export interface UpdatePaymentMethodParams {
  id: string;
  successUrl?: string;
}

export interface PreviewChangePlanParams {
  id: string;
  planId: string;
  billingInterval?: "weekly" | "monthly" | "quarterly" | "yearly" | "one_time";
  offerId?: string;
}

export interface ReactivateSubscriptionParams {
  id: string;
  offerId?: string;
}

export interface CreateSubscriptionRecoveryLinkParams {
  id: string;
}

export interface GetSubscriptionParams {
  id: string;
}

export interface UncancelSubscriptionParams {
  id: string;
}

export interface GetActiveSubscriptionParams {
  customerId: string;
}

export interface ListSubscriptionsParams {
  customerId?: string;
  status?: SubscriptionStatus;
}

export type CreateSubscriptionParams =
  | {
      customerId: string;
      billingInterval?:
        | "weekly"
        | "monthly"
        | "quarterly"
        | "yearly"
        | "one_time"
        | null;
      /** Public price ID. When omitted, Commet selects the default price for the billing interval and still applies its market pricing. */
      priceId?: string;
      initialSeats?: Record<string, number>;
      /** Payment provider for the initial checkout. Overrides country routing when present. */
      provider?: "stripe" | "commet" | "dlocal";
      name?: string;
      /** @format date-time */
      startDate?: string;
      successUrl?: string;
      offerId?: never;
      promoCode?: string;
      customTrialDays?: number;
      skipTrial?: boolean;
      planId: string;
    }
  | {
      customerId: string;
      billingInterval?:
        | "weekly"
        | "monthly"
        | "quarterly"
        | "yearly"
        | "one_time"
        | null;
      /** Public price ID. When omitted, Commet selects the default price for the billing interval and still applies its market pricing. */
      priceId?: string;
      initialSeats?: Record<string, number>;
      /** Payment provider for the initial checkout. Overrides country routing when present. */
      provider?: "stripe" | "commet" | "dlocal";
      name?: string;
      /** @format date-time */
      startDate?: string;
      successUrl?: string;
      offerId?: never;
      promoCode?: string;
      customTrialDays?: number;
      skipTrial?: boolean;
      planCode: string;
    }
  | {
      customerId: string;
      billingInterval?:
        | "weekly"
        | "monthly"
        | "quarterly"
        | "yearly"
        | "one_time"
        | null;
      /** Public price ID. When omitted, Commet selects the default price for the billing interval and still applies its market pricing. */
      priceId?: string;
      initialSeats?: Record<string, number>;
      /** Payment provider for the initial checkout. Overrides country routing when present. */
      provider?: "stripe" | "commet" | "dlocal";
      name?: string;
      /** @format date-time */
      startDate?: string;
      successUrl?: string;
      offerId: string;
      promoCode?: never;
      customTrialDays?: never;
      skipTrial?: false;
      planId: string;
    }
  | {
      customerId: string;
      billingInterval?:
        | "weekly"
        | "monthly"
        | "quarterly"
        | "yearly"
        | "one_time"
        | null;
      /** Public price ID. When omitted, Commet selects the default price for the billing interval and still applies its market pricing. */
      priceId?: string;
      initialSeats?: Record<string, number>;
      /** Payment provider for the initial checkout. Overrides country routing when present. */
      provider?: "stripe" | "commet" | "dlocal";
      name?: string;
      /** @format date-time */
      startDate?: string;
      successUrl?: string;
      offerId: string;
      promoCode?: never;
      customTrialDays?: never;
      skipTrial?: false;
      planCode: string;
    };

export class SubscriptionsResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /** Deactivate an add-on from a subscription. */
  async deactivateAddon(
    params: DeactivateAddonParams,
    options?: RequestOptions,
  ): Promise<DeletedSubscriptionAddon> {
    const { id, addonId } = params;
    return this.httpClient.delete(
      `/subscriptions/${id}/addons/${addonId}`,
      undefined,
      options,
    );
  }

  /** Activate an add-on on a subscription. Charges a prorated amount for the current billing period. */
  async activateAddon(
    params: ActivateAddonParams,
    options?: RequestOptions,
  ): Promise<SubscriptionAddon> {
    const { id, ...rest } = params;
    return this.httpClient.post(`/subscriptions/${id}/addons`, rest, options);
  }

  /** Adjust a subscription's balance or credits by a signed amount. Positive adds, negative subtracts. */
  async adjustBalance(
    params: AdjustBalanceParams,
    options?: RequestOptions,
  ): Promise<BalanceAdjustment> {
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
  ): Promise<BalanceTopup> {
    const { id, ...rest } = params;
    return this.httpClient.post(
      `/subscriptions/${id}/balance/topup`,
      rest,
      options,
    );
  }

  /** Cancel immediately or at period end and return the updated subscription. */
  async cancel(
    params: CancelSubscriptionParams,
    options?: RequestOptions,
  ): Promise<Subscription> {
    const { id, ...rest } = params;
    return this.httpClient.post(`/subscriptions/${id}/cancel`, rest, options);
  }

  /** Upgrade or change billing interval immediately, optionally applying a quoted Promotional Offer. Scheduled changes do not accept offers. */
  async changePlan(
    params: ChangePlanParams,
    options?: RequestOptions,
  ): Promise<PlanChange> {
    const { id, ...rest } = params;
    return this.httpClient.post(
      `/subscriptions/${id}/change-plan`,
      rest,
      options,
    );
  }

  /** Purchase a credit pack for a subscription. Charges the customer and adds credits to their balance. */
  async purchaseCredits(
    params: PurchaseCreditsParams,
    options?: RequestOptions,
  ): Promise<CreditGrant> {
    const { id, ...rest } = params;
    return this.httpClient.post(`/subscriptions/${id}/credits`, rest, options);
  }

  /** Creates a hosted checkout session for the customer to update the subscription's default payment method. */
  async updatePaymentMethod(
    params: UpdatePaymentMethodParams,
    options?: RequestOptions,
  ): Promise<PaymentMethodUpdateCheckout> {
    const { id, ...rest } = params;
    return this.httpClient.post(
      `/subscriptions/${id}/payment-method/update`,
      rest,
      options,
    );
  }

  /** Preview proration details for an immediate plan change (a higher-sort-order plan or a longer interval) without applying it. Returns credit, charge, and net amount. The target plan must belong to the same plan group as the current plan, otherwise a 400 with code `plans_not_in_same_group` is returned. A change between two free plans has nothing to prorate and returns a zero-amount estimate. Downgrades — a lower-sort-order plan in the same group, or a shorter interval — are scheduled for the end of the current period instead of being prorated, so they return a 400 with code `plan_change_scheduled`; apply those via the change-plan endpoint. Pass offerId to quote the destination plan with a Promotional Offer. */
  async previewChange(
    params: PreviewChangePlanParams,
    options?: RequestOptions,
  ): Promise<PreviewChange> {
    const { id, ...rest } = params;
    return this.httpClient.post(
      `/subscriptions/${id}/preview-change`,
      rest,
      options,
    );
  }

  /** Reactivates a subscription. A past_due subscription retries its outstanding renewal charge (recovering to active on success). A canceled subscription generates a fresh invoice, charges the saved card, and resets the billing period. On a successful charge the subscription becomes active; a declined charge returns an error with a recoveryUrl in the error details that can be sent to the customer to update their card. A canceled subscription may apply a Promotional Offer by offerId; past-due recovery cannot. */
  async reactivate(
    params: ReactivateSubscriptionParams,
    options?: RequestOptions,
  ): Promise<ReactivatedSubscription> {
    const { id, ...rest } = params;
    return this.httpClient.post(
      `/subscriptions/${id}/reactivate`,
      rest,
      options,
    );
  }

  /** Generates a hosted, signed recovery link that lets the customer pay the outstanding renewal charge for a past_due subscription. Unlike reactivate, which charges server-to-server, this returns a link the merchant can deliver through their own email, SMS, or dashboard. The link carries a self-contained signed token and stays valid until the charge is paid or the subscription is no longer past due. */
  async createRecoveryLink(
    params: CreateSubscriptionRecoveryLinkParams,
    options?: RequestOptions,
  ): Promise<RecoveryLink> {
    const { id } = params;
    return this.httpClient.post(
      `/subscriptions/${id}/recovery-links`,
      {},
      options,
    );
  }

  /** Get a subscription by its public ID, regardless of status (including pending_payment and past_due). */
  async get(
    params: GetSubscriptionParams,
    options?: RequestOptions,
  ): Promise<Subscription> {
    const { id } = params;
    return this.httpClient.get(`/subscriptions/${id}`, undefined, options);
  }

  /** Revert a scheduled cancellation and return the updated subscription. Only works before cancellation takes effect. */
  async uncancel(
    params: UncancelSubscriptionParams,
    options?: RequestOptions,
  ): Promise<Subscription> {
    const { id } = params;
    return this.httpClient.post(`/subscriptions/${id}/uncancel`, {}, options);
  }

  /** Get the active subscription for a customer. Returns null if none. */
  async getActive(
    params: GetActiveSubscriptionParams,
    options?: RequestOptions,
  ): Promise<Subscription | null> {
    return this.httpClient.get("/subscriptions/active", params, options);
  }

  /** List all subscriptions. Filter by customer ID or status. */
  async list(
    params?: ListSubscriptionsParams,
    options?: RequestOptions,
  ): Promise<{
    object: "list";
    data: Array<SubscriptionSummary>;
    hasMore: boolean;
    nextCursor?: string;
  }> {
    return this.httpClient.get("/subscriptions", params, options);
  }

  /** Create a subscription for a customer. Commet selects the default price when priceId is omitted and resolves its market from the customer's billing country. Without an offer override, Commet applies the price's automatic introductory offer. Pass one Promotional Offer through offerId to override it. Experiment assignment remains external. */
  async create(
    params: CreateSubscriptionParams,
    options?: RequestOptions,
  ): Promise<CreatedSubscription> {
    return this.httpClient.post("/subscriptions", params, options);
  }
}
