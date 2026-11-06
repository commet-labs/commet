---
title: Introductory Offers
description: Attach an existing Offer to a base plan price so Commet applies its discount automatically to eligible new subscriptions.
---

An Introductory Offer is not a separate Offer type. It is an existing Offer attached to one base plan price with introductory placement.

That placement adds two behaviors:

- Commet selects the Offer automatically when no explicit override is supplied.
- Commet checks introductory eligibility before applying it.

Selectable price variants inherit the introductory placement from their base price. One-time prices can't have an Introductory Offer.

## Compatible phases

An Offer used as introductory contains exactly one finite `percentage` or `amount_off` phase. It cannot use `fixed_price` or an open-ended discount.

```typescript
const onboarding = await commet.offers.create({
  name: 'Starter onboarding',
  phases: [
    { type: 'percentage', durationCycles: 3, percentage: 3000 },
  ],
})
```

In the Dashboard, open the plan price and choose **Add intro offer** to attach the existing Offer. A base price can have only one introductory placement at a time.

## Eligibility

Automatic eligibility excludes a customer who already has an `active`, `past_due`, or `paused` subscription in the organization. Other historical statuses do not create a lifetime ban.

## Selection at subscription creation

```typescript
await commet.subscriptions.create({
  customerId: 'user_123',
  planCode: 'starter',
})
```

When `offerId` is omitted, Commet resolves the selected price and applies its introductory Offer if the customer is eligible.

An explicit `offerId` applies that Offer directly instead. It cannot be combined with `promoCode` or `cardPromotionId`.

## Trials

Trial days belong to the plan price, not to the Offer. When the price has a trial, the introductory discount starts with the first invoice after it. See [Trial Periods](/docs/trial-periods).
