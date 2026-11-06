---
title: Trial Periods
description: Set free trial days on a plan price, with or without a payment method, and override them per subscription with customTrialDays or skipTrial.
---

A trial is a number of free days set on a plan price. [Offers](/docs/offers) hold discounts only; a discount starts after the trial.

## Set trial days on a price

In the dashboard, open **Plans**, select the plan, and open the price. Enter the **Free trial** days, choose whether to **Require a payment method**, and choose **Save to draft**. The trial applies to new subscriptions once you [publish the draft](/docs/plan-versions#edit-in-the-dashboard).

```typescript
await commet.plans.updatePrice({
  id: 'pln_xxx',
  priceId: 'pp_xxx',
  trialDays: 14,
})
```

| Parameter                    | Type      | Description                                                                     |
| ---------------------------- | --------- | ------------------------------------------------------------------------------- |
| `trialDays`                  | `integer` | Free days before the first charge. `0` to `730`; `0` removes the trial          |
| `trialRequiresPaymentMethod` | `boolean` | Default `true`. `false` starts the trial without checkout. Requires `trialDays` |

Price variants inherit the trial of their base price. One-time prices can't have a trial.

A subscription keeps the trial days it accepted. Changing `trialDays` publishes a new plan version and affects only new subscriptions.

## Start a trial with a payment method

```typescript
const { checkoutUrl } = await commet.subscriptions.create({
  customerId: 'user_123',
  planCode: 'pro',
})
```

Redirect the customer to `checkoutUrl`. Checkout saves the payment method without charging it, and the subscription becomes `trialing` with `trialEndsAt` set.

When the trial ends, Commet charges the selected price of the subscription's plan version and the subscription becomes `active`. A promo code typed in the trial checkout discounts the first invoice after the trial.

## Start a trial without a payment method

> **Warning**
>
> A price with `trialRequiresPaymentMethod: false` rejects `offerId`, `promoCode`, `cardPromotionId` and `provider` at creation with `400`. An organization that can't charge yet receives `403`.

```typescript
const subscription = await commet.subscriptions.create({
  customerId: 'user_123',
  planCode: 'pro',
})
// subscription.status === 'trialing'
// subscription.checkoutUrl === null
// subscription.hasPaymentMethod === false
```

The trial starts immediately, with no checkout and no charge. The customer adds a card from the [Customer Portal](/docs/customer-portal) (**Add card**) or through a link from `subscriptions.updatePaymentMethod`.

When the trial ends without a card:

- The subscription moves to the [plan group's default plan](/docs/plan-groups#default-plan-and-signup-trial) and `subscription.plan_changed` fires.
- Without a default plan, the subscription is canceled with `cancelReason: "trial_ended_without_payment_method"`.
- No invoice is created. `trial.expired` fires in both cases.

With a card added, the trial ends like a trial that started with one.

During the trial, an immediate plan change returns `409 no_payment_method`. Scheduled changes still apply.

## Override the trial per subscription

| Field             | Effect                                                |
| ----------------- | ----------------------------------------------------- |
| `customTrialDays` | Replaces the price's trial days for this subscription |
| `skipTrial: true` | Starts without a trial                                |

Both combine with `offerId`. The Offer's discount starts after the trial.

```typescript
await commet.subscriptions.create({
  customerId: 'user_123',
  planCode: 'pro',
  offerId: 'ofr_xxx',
  customTrialDays: 21,
})
```

## Eligibility

A customer gets one trial per plan. A customer who already had the plan, in a trial or paying, gets no trial and goes through the regular checkout, including with `customTrialDays`.

`prepaidPeriods` above `1` and `cancelAtPeriodEnd: true` skip the price's trial; with `customTrialDays` above `0` they return `400`. `cardPromotionId` skips a trial that requires a payment method.

## Trial webhooks

- [`trial.checkout_ready`](/docs/webhooks/trial-checkout-ready): the trial checkout link is ready.
- [`trial.started`](/docs/webhooks/trial-started): the trial began. Grant access.
- [`trial.will_end`](/docs/webhooks/trial-will-end): the trial ends within 3 days.
- [`trial.converted`](/docs/webhooks/trial-converted): the customer changed plan before the trial ended.
- [`trial.expired`](/docs/webhooks/trial-expired): the trial ran out.

## Limitations

- `trialDays` accepts `0` to `730`. The dashboard accepts whole days from `1` to `730`; leave it empty for no trial.
- One trial per customer per plan.
- Trials don't combine with `prepaidPeriods` above `1` or `cancelAtPeriodEnd: true`.
- A trial without a payment method can't start with an Offer, promo code, card promotion or provider override.
