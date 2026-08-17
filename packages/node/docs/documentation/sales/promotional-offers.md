---
lastModified: 2026-07-31
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

## Direct application or Promo Code?

Use direct `offerId` when your application decides who receives the terms. Use a Promo Code when the customer should enter a code and the campaign needs redemption restrictions.

A Promo Code can reference only an Offer with one `percentage` or `amount_off` phase. Multi-phase, trial, and `fixed_price` Offers remain available for direct application.

## Related

- [Offers](/docs/offers)
- [Introductory Offers](/docs/introductory-offers)
- [Promo Codes](/docs/promo-codes)
- [Manage Subscriptions](/docs/manage-subscriptions)
