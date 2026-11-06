---
title: Offers
description: Define reusable discount phases independently from plans and distribution, then apply them automatically, directly, or through promo codes.
---

An Offer is a reusable sequence of discount phases. It defines **what changes**—a discount or a temporary fixed price—without deciding which plan uses it or how a customer receives it.

Trials are not Offers. Set trial days on the plan price; see [Trial Periods](/docs/trial-periods).

## Offer phases

An Offer contains between 1 and 10 ordered phases:

| Phase         | Effect                                                                            |
| ------------- | --------------------------------------------------------------------------------- |
| `percentage`  | Reduces the plan base price by basis points                                       |
| `amount_off`  | Subtracts an explicit amount for each configured currency                         |
| `fixed_price` | Replaces the plan base price with an explicit amount for each configured currency |

A phase has a finite `durationCycles`, or `null` when it is the final open-ended phase. A `fixed_price` phase of `0` gives free billing cycles; the dashboard calls it **Free cycles**.

```typescript
const launchOffer = await commet.offers.create({
  name: 'Launch sequence',
  phases: [
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

The channel does not create another copy of the Offer. It only decides how the reusable terms reach a customer. When the price has a trial, the discount starts with the first invoice after it.

## Accepted terms

When Commet quotes or applies an Offer, it records an immutable Offer Application. The application includes:

- the Offer and selection source;
- the target under `appliesTo`;
- the resolved currency and amounts when available;
- the exact accepted phases and dates.

Editing, deactivating, or archiving the catalog Offer affects future applications only. Existing applications remain available for billing and audit.

The v9 response is target-aware (`plan_price`, `addon`, or `credit_pack`) so new purchase surfaces do not require another breaking response change. Current public subscription, Introductory, direct, and Promo Code flows create `plan_price` applications.

## Offers managed by an integration

An Offer created by an integration, such as [Dub](/docs/connect-dub-affiliates), has `managedBy` set to that integration. Its terms change only there: editing them returns `409 managed_by_integration`. Renaming it still works.
