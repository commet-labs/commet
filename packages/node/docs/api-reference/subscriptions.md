# Subscriptions

API version: `2026-07-31`

## deactivateAddon

`commet.subscriptions.deactivateAddon(params, options?)`

`DELETE /subscriptions/{id}/addons/{addonId}` · operation `deactivate-addon`

Deactivate an add-on from a subscription.

### Parameters

- `id` (`string`, required)
- `addonId` (`string`, required)

### Returns

`DeletedSubscriptionAddon`

## activateAddon

`commet.subscriptions.activateAddon(params, options?)`

`POST /subscriptions/{id}/addons` · operation `activate-addon`

Activate an add-on on a subscription. Charges a prorated amount for the current billing period.

### Parameters

- `id` (`string`, required)
- `addonId` (`string`, required)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`SubscriptionAddon`

## adjustBalance

`commet.subscriptions.adjustBalance(params, options?)`

`POST /subscriptions/{id}/balance/adjust` · operation `adjust-balance`

Adjust a subscription's balance or credits by a signed amount. Positive adds, negative subtracts.

### Parameters

- `id` (`string`, required)
- `amount` (`number`, required)
- `reason` (`string`, optional)
- `type` (`"credits" | "balance"`, optional)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`BalanceAdjustment`

## topupBalance

`commet.subscriptions.topupBalance(params, options?)`

`POST /subscriptions/{id}/balance/topup` · operation `topup-balance`

Top up a subscription's balance. Charges the customer's payment method for the specified amount.

### Parameters

- `id` (`string`, required)
- `amount` (`number`, required)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`BalanceTopup`

## cancel

`commet.subscriptions.cancel(params, options?)`

`POST /subscriptions/{id}/cancel` · operation `cancel-subscription`

Cancel immediately or at period end and return the updated subscription.

### Parameters

- `id` (`string`, required)
- `reason` (`string`, optional)
- `immediate` (`boolean`, optional)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`Subscription`

## changePlan

`commet.subscriptions.changePlan(params, options?)`

`POST /subscriptions/{id}/change-plan` · operation `change-plan`

Upgrade or change billing interval immediately, optionally applying an Offer. Scheduled changes do not accept offers.

### Parameters

- `id` (`string`, required)
- `newPlanId` (`string`, optional)
- `newBillingInterval` (`"weekly" | "monthly" | "quarterly" | "yearly"`, optional)
- `successUrl` (`string`, optional)
- `offerId` (`string`, optional)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`PlanChange`

## purchaseCredits

`commet.subscriptions.purchaseCredits(params, options?)`

`POST /subscriptions/{id}/credits` · operation `purchase-credits`

Purchase a credit pack for a subscription. Charges the customer and adds credits to their balance.

### Parameters

- `id` (`string`, required)
- `creditPackId` (`string`, required)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`CreditGrant`

## applyOffer

`commet.subscriptions.applyOffer(params, options?)`

`PUT /subscriptions/{id}/offer` · operation `apply-subscription-offer`

Apply or replace a direct Offer on a subscription's pending payment checkout. The existing checkout URL remains unchanged. Offers whose first phase is a free trial cannot be applied after checkout creation.

### Parameters

- `id` (`string`, required)
- `offerId` (`string`, required)
- `expiresAt` (`string`, optional)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`Subscription`

## removeOffer

`commet.subscriptions.removeOffer(params, options?)`

`DELETE /subscriptions/{id}/offer` · operation `remove-subscription-offer`

Remove the quoted direct Offer from a subscription's pending payment checkout. The existing checkout URL remains unchanged and returns to its undiscounted price.

### Parameters

- `id` (`string`, required)

### Returns

`Subscription`

## updatePaymentMethod

`commet.subscriptions.updatePaymentMethod(params, options?)`

`POST /subscriptions/{id}/payment-method/update` · operation `update-payment-method`

Creates a hosted checkout session for the customer to update the subscription's default payment method.

### Parameters

- `id` (`string`, required)
- `successUrl` (`string`, optional)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`PaymentMethodUpdateCheckout`

## previewChange

`commet.subscriptions.previewChange(params, options?)`

`POST /subscriptions/{id}/preview-change` · operation `preview-change-plan`

Preview proration details for an immediate plan change without applying it. Free-to-paid changes are never scheduled and the change-plan endpoint always returns hosted checkout for them. For paid plans, interval direction takes precedence: a longer interval is immediate and a shorter interval is scheduled. When the interval is unchanged, a higher-sort-order plan is immediate and a lower-sort-order plan is scheduled. A paid-to-free change is always scheduled. Returns credit, charge, and net amount. The target plan must belong to the same plan group as the current plan, otherwise a 400 with code `plans_not_in_same_group` is returned. A change between two free plans has nothing to prorate and returns a zero-amount estimate. Scheduled changes return a 400 with code `plan_change_scheduled`; apply those via the change-plan endpoint. Pass offerId to quote the destination plan with an Offer.

### Parameters

- `id` (`string`, required)
- `planId` (`string`, required)
- `billingInterval` (`"weekly" | "monthly" | "quarterly" | "yearly" | "one_time"`, optional)
- `offerId` (`string`, optional)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`PreviewChange`

## reactivate

`commet.subscriptions.reactivate(params, options?)`

`POST /subscriptions/{id}/reactivate` · operation `reactivate-subscription`

Reactivates a subscription. A past_due subscription retries its outstanding renewal charge (recovering to active on success). A canceled subscription generates a fresh invoice, charges the saved card, and resets the billing period. On a successful charge the subscription becomes active; a declined charge returns an error with a recoveryUrl in the error details that can be sent to the customer to update their card. A canceled subscription may apply an Offer by offerId; past-due recovery cannot.

### Parameters

- `id` (`string`, required)
- `offerId` (`string`, optional)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`ReactivatedSubscription`

## createRecoveryLink

`commet.subscriptions.createRecoveryLink(params, options?)`

`POST /subscriptions/{id}/recovery-links` · operation `create-subscription-recovery-link`

Generates a hosted, signed recovery link that lets the customer pay the outstanding renewal charge for a past_due subscription. Unlike reactivate, which charges server-to-server, this returns a link the merchant can deliver through their own email, SMS, or dashboard. The link carries a self-contained signed token and stays valid until the charge is paid or the subscription is no longer past due.

### Parameters

- `id` (`string`, required)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`RecoveryLink`

## get

`commet.subscriptions.get(params)`

`GET /subscriptions/{id}` · operation `get-subscription`

Get a subscription by its public ID, regardless of status (including pending_payment and past_due).

### Parameters

- `id` (`string`, required)

### Returns

`Subscription`

## uncancel

`commet.subscriptions.uncancel(params, options?)`

`POST /subscriptions/{id}/uncancel` · operation `uncancel-subscription`

Revert a scheduled cancellation and return the updated subscription. Only works before cancellation takes effect.

### Parameters

- `id` (`string`, required)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`Subscription`

## getActive

`commet.subscriptions.getActive(params)`

`GET /subscriptions/active` · operation `get-active-subscription`

Get the active subscription for a customer. Returns null if none.

### Parameters

- `customerId` (`string`, required)

### Returns

`Subscription | null`

## list

`commet.subscriptions.list(params?)`

`GET /subscriptions` · operation `list-subscriptions`

List all subscriptions. Filter by customer ID or status.

### Parameters

- `customerId` (`string`, optional)
- `status` (`SubscriptionStatus`, optional)

### Returns

`object`

## create

`commet.subscriptions.create(params, options?)`

`POST /subscriptions` · operation `create-subscription`

Create a subscription for a customer. Commet selects the default price when priceId is omitted and resolves its market from the customer's billing country. Without an offer override, Commet applies the price's automatic introductory Offer. Pass offerId to apply an active compatible Offer directly, or cardPromotionId to preselect a card-eligible Promotional Offer for the initial checkout when card promotions are enabled for the organization. For the initial checkout, provider accepts either a processor name or an exact payment connection ID.

### Parameters

- `customerId` (`string`, required)
- `billingInterval` (`"weekly" | "monthly" | "quarterly" | "yearly" | "one_time" | null`, optional)
- `priceId` (`string`, optional) — Public price ID. When omitted, Commet selects the default price for the billing interval and still applies its market pricing.
- `initialSeats` (`Record<string, number>`, optional)
- `provider` (`"stripe" | "commet" | "dlocal" | string`, optional) — Payment provider name or exact public payment connection ID for the initial checkout. Overrides country routing when present.
- `name` (`string`, optional)
- `startDate` (`string`, optional)
- `successUrl` (`string`, optional)
- `offerId` (`string`, optional)
- `promoCode` (`string`, optional)
- `customTrialDays` (`number`, optional)
- `skipTrial` (`boolean`, optional)
- `planId` (`string`, optional)
- `planCode` (`string`, optional)
- `cardPromotionId` (`string`, optional) — Public card promotion ID. The offer is shown immediately and remains conditional on card eligibility until checkout confirmation.

### Valid parameter combinations

- `customerId` + `planId`
- `customerId` + `planCode`
- `customerId` + `offerId` + `planId`
- `customerId` + `offerId` + `planCode`
- `customerId` + `cardPromotionId` + `planId`
- `customerId` + `cardPromotionId` + `planCode`

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`CreatedSubscription`
