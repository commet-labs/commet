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
  PrepaidPeriodsCheckout,
  PreviewChange,
  ReactivatedSubscription,
  RecoveryLink,
  Subscription,
  SubscriptionAddon,
  SubscriptionAutoTopUp,
  SubscriptionResume,
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

export interface GetSubscriptionAutoTopUpParams {
  id: string;
}

export interface UpdateSubscriptionAutoTopUpParams {
  id: string;
  enabled?: boolean;
  threshold?: number;
  /** Credits each top-up buys. Credits plans only. */
  quantity?: number;
  /** Minor units of the subscription currency each top-up adds. Balance plans only. */
  amount?: number;
  maxPerPeriod?: number;
}

export interface AdjustBalanceParams {
  id: string;
  amount: number;
  reason?: string;
  type?: "credits" | "balance";
}

export interface TopupBalanceParams {
  id: string;
  /** The amount to add, in minor units of the subscription currency (cents; whole units for zero-decimal currencies). */
  amount: number;
}

export interface CancelSubscriptionParams {
  id: string;
  reason?: string;
  immediate?: boolean;
}

export type ChangePlanParams =
  | {
      id: string;
      newPlanId?: string;
      newBillingInterval?:
        | "weekly"
        | "monthly"
        | "quarterly"
        | "semiannual"
        | "yearly";
      successUrl?: string;
      offerId?: string;
      promoCode?: never;
    }
  | {
      id: string;
      newPlanId?: string;
      newBillingInterval?:
        | "weekly"
        | "monthly"
        | "quarterly"
        | "semiannual"
        | "yearly";
      successUrl?: string;
      offerId?: never;
      /** Promo code whose Offer prices the change, validated with the checkout's rules: a code the checkout would refuse returns 400 validation_error with the checkout's reason in details.reason. Cannot be combined with offerId. */
      promoCode: string;
    };

export type PurchaseCreditsParams =
  | {
      id: string;
      creditPackId: string;
      quantity?: never;
    }
  | {
      id: string;
      quantity: number;
    };

export interface ApplySubscriptionOfferParams {
  id: string;
  offerId: string;
  /** @format date-time */
  expiresAt?: string;
}

export interface RemoveSubscriptionOfferParams {
  id: string;
}

export interface PauseSubscriptionParams {
  id: string;
  mode: "immediate" | "period_end";
  durationDays: number | null;
}

export interface UpdateSubscriptionPauseParams {
  id: string;
  durationDays: number | null;
}

export interface RevokeSubscriptionPauseParams {
  id: string;
}

export interface UpdatePaymentMethodParams {
  id: string;
  successUrl?: string;
}

export interface CreatePrepaidPeriodsCheckoutParams {
  id: string;
  /** Active subscriptions: billing periods to add after the last paid period. Pending-payment subscriptions: total billing periods the first payment covers, including the current one. */
  periods: number;
  /** Offer applied from the first added period for its full configured duration. Active subscriptions only; assign an Offer to a pending-payment subscription with PUT /subscriptions/{id}/offer. */
  offerId?: string;
  successUrl?: string;
}

export type PreviewChangePlanParams =
  | {
      id: string;
      planId: string;
      billingInterval?:
        | "weekly"
        | "monthly"
        | "quarterly"
        | "semiannual"
        | "yearly"
        | "one_time";
      offerId?: string;
      promoCode?: never;
    }
  | {
      id: string;
      planId: string;
      billingInterval?:
        | "weekly"
        | "monthly"
        | "quarterly"
        | "semiannual"
        | "yearly"
        | "one_time";
      offerId?: never;
      /** Promo code whose Offer prices the change, validated with the checkout's rules: a code the checkout would refuse returns 400 validation_error with the checkout's reason in details.reason. Cannot be combined with offerId. */
      promoCode: string;
    };

export interface ReactivateSubscriptionParams {
  id: string;
  offerId?: string;
}

export interface CreateSubscriptionRecoveryLinkParams {
  id: string;
}

export interface ResumeSubscriptionParams {
  id: string;
}

export interface GetSubscriptionParams {
  id: string;
}

export interface RevokeScheduledPlanChangeParams {
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
        | "semiannual"
        | "yearly"
        | "one_time"
        | null;
      /** Public price ID. When omitted, Commet selects the default price for the billing interval and still applies its market pricing. */
      priceId?: string;
      initialSeats?: Record<string, number>;
      /** Payment provider name or exact public payment connection ID for the initial checkout. Overrides country routing when present. */
      provider?: "stripe" | "commet" | "dlocal" | string;
      /** Payment methods the initial checkout may offer. Restricts what the checkout already offers for the buyer's country, currency and payment connection; it never enables a method the connection does not have and never changes routing. When none of them is available to the buyer, the checkout shows that it cannot accept payments. */
      paymentMethodTypes?: Array<
        "card" | "oxxo" | "mercado_pago" | "google_pay" | "smartpix"
      >;
      name?: string;
      /** @format date-time */
      startDate?: string;
      successUrl?: string;
      /** Billing periods of the subscription's interval paid with the first payment, including the current one. Defaults to 1. The interval does not change: each paid period renews at zero and the subscription renews normally after the last one unless `cancelAtPeriodEnd` is true. */
      prepaidPeriods?: number;
      /** Schedules the cancellation from creation so the subscription ends after its last paid period and never renews with any payment method. */
      cancelAtPeriodEnd?: boolean;
      offerId?: never;
      promoCode?: string;
      /** Trial length in days, replacing the price's trial. A customer who already had this plan, in a trial or paying, gets no trial and goes through the regular checkout. */
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
        | "semiannual"
        | "yearly"
        | "one_time"
        | null;
      /** Public price ID. When omitted, Commet selects the default price for the billing interval and still applies its market pricing. */
      priceId?: string;
      initialSeats?: Record<string, number>;
      /** Payment provider name or exact public payment connection ID for the initial checkout. Overrides country routing when present. */
      provider?: "stripe" | "commet" | "dlocal" | string;
      /** Payment methods the initial checkout may offer. Restricts what the checkout already offers for the buyer's country, currency and payment connection; it never enables a method the connection does not have and never changes routing. When none of them is available to the buyer, the checkout shows that it cannot accept payments. */
      paymentMethodTypes?: Array<
        "card" | "oxxo" | "mercado_pago" | "google_pay" | "smartpix"
      >;
      name?: string;
      /** @format date-time */
      startDate?: string;
      successUrl?: string;
      /** Billing periods of the subscription's interval paid with the first payment, including the current one. Defaults to 1. The interval does not change: each paid period renews at zero and the subscription renews normally after the last one unless `cancelAtPeriodEnd` is true. */
      prepaidPeriods?: number;
      /** Schedules the cancellation from creation so the subscription ends after its last paid period and never renews with any payment method. */
      cancelAtPeriodEnd?: boolean;
      offerId?: never;
      promoCode?: string;
      /** Trial length in days, replacing the price's trial. A customer who already had this plan, in a trial or paying, gets no trial and goes through the regular checkout. */
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
        | "semiannual"
        | "yearly"
        | "one_time"
        | null;
      /** Public price ID. When omitted, Commet selects the default price for the billing interval and still applies its market pricing. */
      priceId?: string;
      initialSeats?: Record<string, number>;
      /** Payment provider name or exact public payment connection ID for the initial checkout. Overrides country routing when present. */
      provider?: "stripe" | "commet" | "dlocal" | string;
      /** Payment methods the initial checkout may offer. Restricts what the checkout already offers for the buyer's country, currency and payment connection; it never enables a method the connection does not have and never changes routing. When none of them is available to the buyer, the checkout shows that it cannot accept payments. */
      paymentMethodTypes?: Array<
        "card" | "oxxo" | "mercado_pago" | "google_pay" | "smartpix"
      >;
      name?: string;
      /** @format date-time */
      startDate?: string;
      successUrl?: string;
      /** Billing periods of the subscription's interval paid with the first payment, including the current one. Defaults to 1. The interval does not change: each paid period renews at zero and the subscription renews normally after the last one unless `cancelAtPeriodEnd` is true. */
      prepaidPeriods?: number;
      /** Schedules the cancellation from creation so the subscription ends after its last paid period and never renews with any payment method. */
      cancelAtPeriodEnd?: boolean;
      offerId: string;
      promoCode?: never;
      /** Trial length in days, replacing the price's trial. A customer who already had this plan, in a trial or paying, gets no trial and goes through the regular checkout. */
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
        | "semiannual"
        | "yearly"
        | "one_time"
        | null;
      /** Public price ID. When omitted, Commet selects the default price for the billing interval and still applies its market pricing. */
      priceId?: string;
      initialSeats?: Record<string, number>;
      /** Payment provider name or exact public payment connection ID for the initial checkout. Overrides country routing when present. */
      provider?: "stripe" | "commet" | "dlocal" | string;
      /** Payment methods the initial checkout may offer. Restricts what the checkout already offers for the buyer's country, currency and payment connection; it never enables a method the connection does not have and never changes routing. When none of them is available to the buyer, the checkout shows that it cannot accept payments. */
      paymentMethodTypes?: Array<
        "card" | "oxxo" | "mercado_pago" | "google_pay" | "smartpix"
      >;
      name?: string;
      /** @format date-time */
      startDate?: string;
      successUrl?: string;
      /** Billing periods of the subscription's interval paid with the first payment, including the current one. Defaults to 1. The interval does not change: each paid period renews at zero and the subscription renews normally after the last one unless `cancelAtPeriodEnd` is true. */
      prepaidPeriods?: number;
      /** Schedules the cancellation from creation so the subscription ends after its last paid period and never renews with any payment method. */
      cancelAtPeriodEnd?: boolean;
      offerId: string;
      promoCode?: never;
      /** Trial length in days, replacing the price's trial. A customer who already had this plan, in a trial or paying, gets no trial and goes through the regular checkout. */
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
        | "semiannual"
        | "yearly"
        | "one_time"
        | null;
      /** Public price ID. When omitted, Commet selects the default price for the billing interval and still applies its market pricing. */
      priceId?: string;
      initialSeats?: Record<string, number>;
      /** Payment provider name or exact public payment connection ID for the initial checkout. Overrides country routing when present. */
      provider?: "stripe" | "commet" | "dlocal" | string;
      /** Payment methods the initial checkout may offer. Restricts what the checkout already offers for the buyer's country, currency and payment connection; it never enables a method the connection does not have and never changes routing. When none of them is available to the buyer, the checkout shows that it cannot accept payments. */
      paymentMethodTypes?: Array<
        "card" | "oxxo" | "mercado_pago" | "google_pay" | "smartpix"
      >;
      name?: string;
      /** @format date-time */
      startDate?: string;
      successUrl?: string;
      /** Billing periods of the subscription's interval paid with the first payment, including the current one. Defaults to 1. The interval does not change: each paid period renews at zero and the subscription renews normally after the last one unless `cancelAtPeriodEnd` is true. */
      prepaidPeriods?: number;
      /** Schedules the cancellation from creation so the subscription ends after its last paid period and never renews with any payment method. */
      cancelAtPeriodEnd?: boolean;
      offerId?: never;
      /** Public card promotion ID. The offer is shown immediately and remains conditional on card eligibility until checkout confirmation. */
      cardPromotionId: string;
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
        | "semiannual"
        | "yearly"
        | "one_time"
        | null;
      /** Public price ID. When omitted, Commet selects the default price for the billing interval and still applies its market pricing. */
      priceId?: string;
      initialSeats?: Record<string, number>;
      /** Payment provider name or exact public payment connection ID for the initial checkout. Overrides country routing when present. */
      provider?: "stripe" | "commet" | "dlocal" | string;
      /** Payment methods the initial checkout may offer. Restricts what the checkout already offers for the buyer's country, currency and payment connection; it never enables a method the connection does not have and never changes routing. When none of them is available to the buyer, the checkout shows that it cannot accept payments. */
      paymentMethodTypes?: Array<
        "card" | "oxxo" | "mercado_pago" | "google_pay" | "smartpix"
      >;
      name?: string;
      /** @format date-time */
      startDate?: string;
      successUrl?: string;
      /** Billing periods of the subscription's interval paid with the first payment, including the current one. Defaults to 1. The interval does not change: each paid period renews at zero and the subscription renews normally after the last one unless `cancelAtPeriodEnd` is true. */
      prepaidPeriods?: number;
      /** Schedules the cancellation from creation so the subscription ends after its last paid period and never renews with any payment method. */
      cancelAtPeriodEnd?: boolean;
      offerId?: never;
      /** Public card promotion ID. The offer is shown immediately and remains conditional on card eligibility until checkout confirmation. */
      cardPromotionId: string;
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

  /** Read whether the subscription tops up automatically with its saved payment method when its available credits or balance reach a threshold, with the top-ups used this period and the last failure. */
  async getAutoTopUp(
    params: GetSubscriptionAutoTopUpParams,
    options?: RequestOptions,
  ): Promise<SubscriptionAutoTopUp> {
    const { id } = params;
    return this.httpClient.get(
      `/subscriptions/${id}/auto-top-up`,
      undefined,
      options,
    );
  }

  /** Turn automatic top-ups on or off and set the threshold, the size of each top-up and the maximum top-ups per period. Send only the fields that change. On a credits plan each top-up buys `quantity` credits; on a balance plan it adds `amount` in minor units of the subscription currency, plus tax, and `threshold` is in the same minor units. Enabling requires a plan that sells credits or has balance top-ups on. The size must be at least the plan's minimum when auto top-up is enabled or when the size changes, so turning it off keeps working after the minimum rises. Saving it enabled resumes a paused auto top-up. */
  async updateAutoTopUp(
    params: UpdateSubscriptionAutoTopUpParams,
    options?: RequestOptions,
  ): Promise<SubscriptionAutoTopUp> {
    const { id, ...rest } = params;
    return this.httpClient.patch(
      `/subscriptions/${id}/auto-top-up`,
      rest,
      options,
    );
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

  /** Top up a balance subscription. Charges the customer's payment method for the amount plus tax, adds it to the subscription's purchased balance (after paying back any overage owed on the plan balance), creates its invoice and emits `balance.topped_up`. Purchased balance is spent after the plan balance and is kept until the subscription ends. Rejected with 400 when the subscription is not on a balance plan, its plan has top-ups turned off, or the amount is below the effective minimum: the plan's minimum top-up in the subscription currency, raised to the currency's minimum charge. */
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

  /** Upgrade or change billing interval immediately, optionally applying an Offer by offerId or the Offer of a promoCode. Scheduled changes accept neither offerId nor promoCode. From a free plan, a promoCode opens the checkout with the code applied and counts its use when the checkout is paid; without offerId or promoCode, a destination price whose free trial requires no payment method starts that trial right away without checkout. During a trial without a payment method, an immediate change returns 409 no_payment_method; scheduled changes still apply. */
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

  /** Purchase a fixed credit pack or choose a whole credit quantity at the subscription plan price and minimum. Charges the saved payment method and adds purchased credits. */
  async purchaseCredits(
    params: PurchaseCreditsParams,
    options?: RequestOptions,
  ): Promise<CreditGrant> {
    const { id, ...rest } = params;
    return this.httpClient.post(`/subscriptions/${id}/credits`, rest, options);
  }

  /** Apply a direct Offer to a subscription. On a pending checkout it quotes or replaces the checkout discount, which starts after the plan price trial when there is one, and the existing checkout URL remains unchanged. On an active subscription it applies the Offer immediately with its discount phases starting at the next billing cycle; the call is rejected while another applied Offer still has active or upcoming discount phases. */
  async applyOffer(
    params: ApplySubscriptionOfferParams,
    options?: RequestOptions,
  ): Promise<Subscription> {
    const { id, ...rest } = params;
    return this.httpClient.put(`/subscriptions/${id}/offer`, rest, options);
  }

  /** Remove the quoted direct Offer from a subscription's pending payment checkout. The existing checkout URL remains unchanged and returns to its undiscounted price. */
  async removeOffer(
    params: RemoveSubscriptionOfferParams,
    options?: RequestOptions,
  ): Promise<Subscription> {
    const { id } = params;
    return this.httpClient.delete(
      `/subscriptions/${id}/offer`,
      undefined,
      options,
    );
  }

  /** Pause immediately or schedule a pause for the end of the current billing or trial period. Set durationDays to null for an indefinite pause. */
  async pause(
    params: PauseSubscriptionParams,
    options?: RequestOptions,
  ): Promise<Subscription> {
    const { id, ...rest } = params;
    return this.httpClient.post(`/subscriptions/${id}/pause`, rest, options);
  }

  /** Change the duration of a scheduled or active pause. Set durationDays to null to make it indefinite. */
  async updatePause(
    params: UpdateSubscriptionPauseParams,
    options?: RequestOptions,
  ): Promise<Subscription> {
    const { id, ...rest } = params;
    return this.httpClient.patch(`/subscriptions/${id}/pause`, rest, options);
  }

  /** Revoke a pause before it becomes effective. Active pauses must be resumed instead. */
  async revokePause(
    params: RevokeSubscriptionPauseParams,
    options?: RequestOptions,
  ): Promise<Subscription> {
    const { id } = params;
    return this.httpClient.delete(
      `/subscriptions/${id}/pause`,
      undefined,
      options,
    );
  }

  /** Creates a hosted checkout to update the payment method of an active, trialing or past_due subscription. Pending-payment subscriptions must use their payment checkout. */
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

  /** Creates a hosted checkout to pay billing periods of a recurring subscription in advance with any payment method. On an active subscription the paid periods start after the last paid period and replace any open prepaid-periods checkout. On a pending-payment subscription the first payment covers the requested periods and replaces its pending checkout. The billing interval does not change. */
  async createPrepaidPeriodsCheckout(
    params: CreatePrepaidPeriodsCheckoutParams,
    options?: RequestOptions,
  ): Promise<PrepaidPeriodsCheckout> {
    const { id, ...rest } = params;
    return this.httpClient.post(
      `/subscriptions/${id}/prepaid-periods`,
      rest,
      options,
    );
  }

  /** Preview proration details for an immediate plan change without applying it. Free-to-paid changes are never scheduled and the change-plan endpoint returns hosted checkout for them, except a change without offerId or promoCode to a price whose free trial needs no payment method, for a customer who never had that plan: it starts the trial at once, so the preview reports nothing due today. For paid plans, interval direction takes precedence: a longer interval is immediate and a shorter interval is scheduled. When the interval is unchanged, a higher-sort-order plan is immediate and a lower-sort-order plan is scheduled. A paid-to-free change is always scheduled. Returns credit, charge, and net amount. The target plan must belong to the same plan group as the current plan, otherwise a 400 with code `plans_not_in_same_group` is returned. A change between two free plans has nothing to prorate and returns a zero-amount estimate. Scheduled changes return a 400 with code `plan_change_scheduled`; apply those via the change-plan endpoint. Pass offerId to quote the destination plan with an Offer, or promoCode to quote it with the Offer of a promo code validated with the checkout's rules. */
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

  /** Reactivates a subscription. A past_due subscription retries its outstanding renewal charge (recovering to active on success). A canceled subscription generates a fresh invoice, charges the saved card, and resets the billing period. On a successful charge the subscription becomes active; a declined charge returns an error with a recoveryUrl in the error details that can be sent to the customer to update their card. A canceled subscription may apply an Offer by offerId; past-due recovery cannot. */
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

  /** Resume a paused subscription. Immediate pauses continue the preserved period without a charge. Period-end pauses charge a new period before access is restored. */
  async resume(
    params: ResumeSubscriptionParams,
    options?: RequestOptions,
  ): Promise<SubscriptionResume> {
    const { id } = params;
    return this.httpClient.post(`/subscriptions/${id}/resume`, {}, options);
  }

  /** Get a subscription by its public ID, regardless of status (including pending_payment and past_due). */
  async get(
    params: GetSubscriptionParams,
    options?: RequestOptions,
  ): Promise<Subscription> {
    const { id } = params;
    return this.httpClient.get(`/subscriptions/${id}`, undefined, options);
  }

  /** Revoke the plan or interval change scheduled for the end of the period, so the subscription stays on its current plan. Returns the updated subscription. */
  async revokeScheduledPlanChange(
    params: RevokeScheduledPlanChangeParams,
    options?: RequestOptions,
  ): Promise<Subscription> {
    const { id } = params;
    return this.httpClient.delete(
      `/subscriptions/${id}/scheduled-plan-change`,
      undefined,
      options,
    );
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

  /** Create a subscription for a customer. Commet selects the default price when priceId is omitted. The subscription starts at the base USD price; market and currency are resolved from the buyer's request country when the checkout opens. Without an offer override, Commet applies the price's automatic introductory Offer. Pass offerId to apply an active compatible Offer directly, or cardPromotionId to preselect a card-eligible Promotional Offer for the initial checkout when card promotions are enabled for the organization. For the initial checkout, provider accepts either a processor name or an exact payment connection ID. When the price's free trial requires no payment method, the subscription starts trialing right away with no checkout (checkoutUrl null, hasPaymentMethod false); it cannot be combined with offerId, promoCode, cardPromotionId or provider, and an organization that cannot charge yet receives 403. */
  async create(
    params: CreateSubscriptionParams,
    options?: RequestOptions,
  ): Promise<CreatedSubscription> {
    return this.httpClient.post("/subscriptions", params, options);
  }
}
