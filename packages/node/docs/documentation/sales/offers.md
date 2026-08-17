---
lastModified: 2026-07-31
title: Offers
description: Define reusable trials and temporary pricing terms independently from plans and distribution.
---

An Offer is a reusable sequence of benefits. It defines **what changes**—a trial, a discount, or a temporary fixed price—without deciding which plan uses it or how a customer receives it.

## Offer phases

An Offer contains between 1 and 10 ordered phases:

| Phase         | Effect                                                                            |
| ------------- | --------------------------------------------------------------------------------- |
| `free_trial`  | Delays the first charge for a fixed number of days                                |
| `percentage`  | Reduces the plan base price by basis points                                       |
| `amount_off`  | Subtracts an explicit amount for each configured currency                         |
| `fixed_price` | Replaces the plan base price with an explicit amount for each configured currency |

A free trial can appear only as the first phase. A discount phase may have a finite `durationCycles`, or `null` when it is the final open-ended phase.

```typescript
const launchOffer = await commet.offers.create({
  name: 'Launch sequence',
  phases: [
    { type: 'free_trial', durationDays: 14 },
    { type: 'percentage', durationCycles: 3, percentage: 5000 },
    { type: 'percentage', durationCycles: null, percentage: 2000 },
  ],
  metadata: { campaign: 'launch-2026' },
})
```

The Offer does not contain `purpose`, `planPriceIds`, eligibility, or redemption rules.

## Apply the same Offer in different ways

| Channel          | How the Offer is selected         | What the channel adds                                  |
| ---------------- | --------------------------------- | ------------------------------------------------------ |
| **Introductory** | Attached to one base plan price   | Automatic selection and new-customer eligibility       |
| **Promotional**  | Your integration passes `offerId` | Explicit campaign, retention, or experiment assignment |
| **Promo Code**   | The customer enters a code        | Redemption limits, plan restrictions, and expiration   |

The channel does not create another copy of the Offer. It only decides how the reusable terms reach a customer.

## Accepted terms

When Commet quotes or applies an Offer, it records an immutable Offer Application. The application includes:

- the Offer and selection source;
- the target under `appliesTo`;
- the resolved currency and amounts when available;
- the exact accepted phases and dates.

Editing, deactivating, or archiving the catalog Offer affects future applications only. Existing applications remain available for billing and audit.

The v9 response is target-aware (`plan_price`, `addon`, or `credit_pack`) so new purchase surfaces do not require another breaking response change. Current public subscription, Introductory, direct, and Promo Code flows create `plan_price` applications.

## Related

- [Introductory Offers](/docs/introductory-offers)
- [Promotional Offers](/docs/promotional-offers)
- [Promo Codes](/docs/promo-codes)
- [Trial Periods](/docs/trial-periods)
- [Offers API reference](/docs/api-reference/offers/list-offers)
