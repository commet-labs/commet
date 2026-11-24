---
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

Automatic introductory selection excludes customers with an `active`, `past_due`, or `paused` subscription in the organization. Other historical statuses do not create a lifetime ban.

An explicit `offerId` overrides automatic introductory selection. A Promo Code is rejected with `intro_offer_active` while an eligible introductory placement applies. `offerId`, `promoCode`, and `cardPromotionId` are mutually exclusive. `customTrialDays` and `skipTrial` combine with `offerId` and `promoCode`, not with `cardPromotionId`. A trial without a payment method starts with none of the three.

## Duration and phases

An Offer combines ordered discount or fixed-price phases. A finite `durationCycles` counts billing periods, not calendar months. A yearly Offer phase with `durationCycles: 2` lasts two yearly billing cycles.

```
Pro costs $99/month with 50% off for 3 cycles:

Cycle 1: $49.50
Cycle 2: $49.50
Cycle 3: $49.50
Cycle 4: $99.00
```

The final discount phase may use `durationCycles: null` to remain active until the accepted application ends. Promo Codes can reference the same Offers. Introductory placement is narrower: exactly one finite `percentage` or `amount_off` phase.

Trials are not Offer phases. When the price has a [trial](/docs/trial-periods), the discount starts with the first invoice after it.

## Plan changes

A discount belongs to the subscription, not to the plan. When the customer changes to another paid plan or billing interval, the same Offer Application keeps going on the new plan with the billing periods it still had to discount. The charge for the change is the next of those periods, so no cycle is added and none is lost. A discount without an end keeps applying.

```
Starter costs $20/month with 50% off for 3 cycles.
The customer pays cycle 1 and upgrades to Pro ($40/month):

Change to Pro: $20.00 (cycle 2), minus the credit for unused Starter time
Next renewal:  $20.00 (cycle 3)
Renewal after: $40.00
```

- A percentage is the same percentage of the new price. An amount off is the same amount.
- A `fixed_price` phase, free cycles included, is the price of the plan it was accepted on: it ends with the change, and the other phases of the Offer continue.
- When the billing interval changes, the discount keeps the time it had left. With two monthly cycles left, a yearly charge made within those two months is discounted in full and the next yearly renewal is not.
- A Promo Code or Card Promotion restricted to plans or to a billing interval ends with the change when the new plan or interval is outside its restriction.
- A change that passes its own `offerId` or `promoCode` applies that Offer with its full duration and ends the previous one. Scheduled plan changes accept neither.
- A move to a free plan ends the discount.

Plan-change previews and the Customer Portal quote the new plan with the discount the change will charge.

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
