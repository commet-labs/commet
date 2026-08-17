---
lastModified: 2026-07-31
title: Introductory Offers
description: Apply an existing Offer automatically to eligible new subscriptions.
---

An Introductory Offer is not a separate Offer type. It is an existing Offer attached to one base plan price with introductory placement.

That placement adds two behaviors:

- Commet selects the Offer automatically when no explicit override is supplied.
- Commet checks introductory eligibility before applying it.

Selectable price variants inherit the introductory placement from their base price.

## Compatible phases

An Offer used as introductory may contain:

1. One optional `free_trial` phase at the beginning.
2. At most one finite `percentage` or `amount_off` phase.

It cannot use `fixed_price`, multiple discount phases, or an open-ended discount.

```typescript
const onboarding = await commet.offers.create({
  name: 'Starter onboarding',
  phases: [
    { type: 'free_trial', durationDays: 14 },
    { type: 'percentage', durationCycles: 3, percentage: 3000 },
  ],
})
```

In the Dashboard, open the plan price and choose **Add intro offer** to attach the existing Offer. A base price can have only one introductory placement at a time.

## Eligibility

Current automatic eligibility excludes a customer who already has an `active` or `past_due` subscription in the organization. Other historical statuses do not create a lifetime ban.

## Selection at subscription creation

```typescript
await commet.subscriptions.create({
  customerId: 'user_123',
  planCode: 'starter',
})
```

When `offerId` is omitted, Commet resolves the selected price and applies its introductory Offer if the customer is eligible.

An explicit `offerId` applies that Offer directly instead. It cannot be combined with `promoCode`, `customTrialDays`, or `skipTrial: true`.

## Trials and compatibility fields

`trialDays`, `customTrialDays`, and `skipTrial` remain supported API shortcuts. Internally, an accepted trial is recorded as a `free_trial` phase in the Offer Application. Prefer catalog Offers when the same terms should be named, reused, inspected, or distributed consistently.

## Related

- [Offers](/docs/offers)
- [Promotional Offers](/docs/promotional-offers)
- [Promo Codes](/docs/promo-codes)
- [Trial Periods](/docs/trial-periods)
- [Manage Subscriptions](/docs/manage-subscriptions)
