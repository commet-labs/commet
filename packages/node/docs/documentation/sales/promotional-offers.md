---
lastModified: 2026-08-21
title: Promotional Offers
description: Apply any compatible Offer directly for campaigns, retention, and experiments.
---

A Promotional Offer is an Offer applied directly with `offerId`. Promotional describes the application channel, not a different catalog resource or `purpose`.

The Offer stays independent from plans and prices until your integration selects it.

## Create the terms

Direct Offers may combine a free trial with ordered discount or fixed-price phases:

```typescript
const retentionOffer = await commet.offers.create({
  name: 'Return to Pro',
  phases: [
    { type: 'free_trial', durationDays: 7 },
    { type: 'fixed_price', durationCycles: 2, prices: [
      { currency: 'usd', amount: 2900 },
      { currency: 'ars', amount: 3990000 },
    ] },
    { type: 'percentage', durationCycles: null, percentage: 2000 },
  ],
})
```

Currency-specific phases require an explicit value for the checkout currency. Commet does not reuse a USD amount silently in another currency.

## Apply it directly

```typescript
await commet.subscriptions.create({
  customerId: 'user_123',
  planCode: 'pro',
  offerId: retentionOffer.id,
})
```

The Offer must be active, inside its availability window, and resolvable in the selected currency. It does not need a prior association with the plan or price.

An explicit `offerId` overrides automatic introductory selection. It cannot be combined with `promoCode`, `customTrialDays`, or `skipTrial: true`.

Immediate plan changes, plan-change previews, and supported reactivation flows also accept `offerId`. Scheduled plan changes do not accept an Offer.

## Apply it to an active subscription

For retention, apply an Offer to a subscription that is already active. The discount phases start at the next billing cycle, so the current period stays untouched and the next invoice carries the discount:

```typescript
await commet.subscriptions.applyOffer({
  id: 'sub_123',
  offerId: retentionOffer.id,
})
```

Only one Offer applies at a time: while an accepted Offer still has active or upcoming discount phases, a new application is rejected. Once its phases are exhausted, the subscription accepts a new Offer. Offers with a free trial phase cannot be applied to an active subscription, and the discount applies to the plan base price only.

The applied Offer belongs to that subscription and plan: it ends with a cancellation and a plan change removes it.

The same operation on a subscription with a pending payment checkout quotes or replaces the checkout discount instead; there it accepts an optional `expiresAt` for the quote.

## Direct application or Promo Code?

Use direct `offerId` when your application decides who receives the terms. Use a Promo Code when the customer should enter a code and the campaign needs redemption restrictions.

A Promo Code can reference only an Offer with one `percentage` or `amount_off` phase. Multi-phase, trial, and `fixed_price` Offers remain available for direct application.

## Related

- [Offers](/docs/offers)
- [Introductory Offers](/docs/introductory-offers)
- [Promo Codes](/docs/promo-codes)
- [Manage Subscriptions](/docs/manage-subscriptions)
