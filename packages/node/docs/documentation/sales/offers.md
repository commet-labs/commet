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

The Offer does not contain `purpose`, `planPriceIds`, eligibility, or redemption rules. It can carry two optional limits: the plans and the billing interval it applies to.

## Limit an Offer to plans or a billing interval

An Offer applies to any plan and any billing interval, and it stays with the subscription when the customer changes either one. Two optional limits narrow that:

| Field             | Limit                                                                                         |
| ----------------- | --------------------------------------------------------------------------------------------- |
| `planIds`         | The Offer applies only to subscriptions on these plans. An empty list means every plan.       |
| `billingInterval` | The Offer applies only to subscriptions billed on this interval. `null` means every interval. |

In the dashboard, open **Limits (optional)** in the Offer form and choose **Subscription billing interval** and **Applicable plans**. The Offer page shows them as **Applies to** and **Billing interval**. Through the API, send `planIds` and `billingInterval` when you create or update the Offer. An update that omits a limit keeps it; `planIds: []` and `billingInterval: null` remove it.

A limit acts at two moments:

- **When the Offer is applied.** A limited Offer cannot be applied to a subscription on another plan or interval. With `offerId`, creating the subscription returns `400 validation_error` on `offerId`, an immediate plan change and `PUT /subscriptions/{id}/offer` return `400 offer_not_applicable`, and a plan-change preview returns `404 offer_not_found`. A [Promo Code](/docs/promo-codes) of the Offer is rejected with `plan_not_eligible` or `billing_interval_not_eligible`, and a [Card Promotion](/docs/card-promotions) of the Offer does not apply.
- **When the customer changes plan or billing interval.** The applied Offer ends with the change when the new plan or interval is outside the limit. Inside the limit, it continues as [any discount does](/docs/how-do-discounts-work#plan-changes).

Limits are read when the change happens. A limit you add later also reaches customers who already have the Offer, the next time they change plan or billing interval.

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

Editing, deactivating, or archiving the catalog Offer affects future applications only. Existing applications remain available for billing and audit. The plan and interval limits are the exception: they are read each time the customer changes plan or billing interval.

The v9 response is target-aware (`plan_price`, `addon`, or `credit_pack`) so new purchase surfaces do not require another breaking response change. Current public subscription, Introductory, direct, and Promo Code flows create `plan_price` applications.

## Offers managed by an integration

An Offer created by an integration, such as [Dub](/docs/connect-dub-affiliates), has `managedBy` set to that integration. Its terms change only there: editing them returns `409 managed_by_integration`. Renaming it and changing its plan and interval limits still work.
