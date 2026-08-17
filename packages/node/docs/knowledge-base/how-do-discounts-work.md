---
lastModified: 2026-07-31
title: Discounts
description: How Offers, introductory placement, direct assignment, and Promo Codes work together
---

Commet stores discount terms in independent Offers. Introductory, Promotional, and Promo Code describe **how one Offer is selected**, not different discount entities.

## Selection channels

| Channel      | Configuration                                    | Selection                            | Typical use                                  |
| ------------ | ------------------------------------------------ | ------------------------------------ | -------------------------------------------- |
| Introductory | Attach a compatible Offer to one base plan price | Automatic for an eligible customer   | Acquisition and onboarding                   |
| Promotional  | Keep the Offer independent                       | Your integration passes `offerId`    | Campaigns, retention, and experiments        |
| Promo Code   | Reference a compatible Offer from a code         | Customer enters the code at checkout | Public distribution with redemption controls |

A direct Offer does not need a prior association with the selected plan or price.

## Eligibility and exclusivity

Automatic introductory selection currently excludes customers with an `active` or `past_due` subscription in the organization. Other historical statuses do not create a lifetime ban.

An explicit `offerId` overrides automatic introductory selection. A Promo Code is rejected with `intro_offer_active` while an eligible introductory placement applies. `offerId`, `promoCode`, `customTrialDays`, and `skipTrial: true` are mutually exclusive selection controls.

## Duration and phases

An Offer may combine a free trial with ordered discount or fixed-price phases. A finite `durationCycles` counts billing periods, not calendar months. A yearly Offer phase with `durationCycles: 2` lasts two yearly billing cycles.

```
Pro costs $99/month with 50% off for 3 cycles:

Cycle 1: $49.50
Cycle 2: $49.50
Cycle 3: $49.50
Cycle 4: $99.00
```

The final discount phase may use `durationCycles: null` to remain active until the accepted application ends. Promo Codes are intentionally narrower: they can reference only one `percentage` or `amount_off` phase.

## Plan changes

The Offer Application belongs to the price target accepted by the subscription. An immediate plan change ends that application. The change may pass a new `offerId`; otherwise the new plan begins at its normal price. Scheduled plan changes do not accept an Offer.

## What gets discounted

Current subscription Offer channels apply to the plan base price. Overage, add-on, credit-pack, and seat-overage charges remain at their normal prices.

```
Plan base:  $100.00
20% Offer: −$20.00
Overage:     $50.00
Total:      $130.00
```

> **Note**
>
> Accepted phases are stored in an immutable Offer Application. Editing, deactivating, or archiving the catalog Offer changes future applications only.

## Related

- [Offers](/docs/offers)
- [Introductory Offers](/docs/introductory-offers)
- [Promotional Offers](/docs/promotional-offers)
- [Promo Codes](/docs/promo-codes)
- [Plan Changes](/docs/what-happens-when-a-customer-changes-plans)
