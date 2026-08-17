---
lastModified: 2026-07-31
title: Trials
description: How free-trial Offer phases work and what customers experience
---

A trial is a `free_trial` phase in an Offer. It delays the first charge; the Offer's application channel determines whether Commet selects it automatically or your integration assigns it directly.

## What the customer experiences

|                | Regular checkout            | Trial checkout                            |
| -------------- | --------------------------- | ----------------------------------------- |
| Payment        | Charged immediately         | Payment method saved, no immediate charge |
| Primary action | Pay                         | Start free trial                          |
| After checkout | Subscription becomes active | Subscription becomes `trialing`           |

The trial starts after payment-method setup succeeds. If the card requires 3D Secure, the customer completes verification before the trial begins.

## How it works

```
1. Commet resolves an Offer with a free_trial phase.
2. Checkout saves the payment method without charging it.
3. The subscription becomes trialing and records trialEndsAt.
4. At the end, Commet charges the selected price's current catalog value.
5. The next accepted Offer phase starts, if one exists.
```

> **Warning**
>
> The accepted Offer phases are immutable, but the selected catalog price is not. A price change during the trial changes the first paid charge.

## Reusable and customer-specific trials

Use a catalog Offer when the trial should have a reusable name and distribution strategy. It can be attached to a base price as introductory or passed directly with `offerId`.

Use `customTrialDays` for terms exclusive to one subscription. Commet records those accepted terms as a custom Offer Application. Use `skipTrial: true` to bypass automatic introductory selection.

## During the trial

| Behavior                              | During trial                                              |
| ------------------------------------- | --------------------------------------------------------- |
| Plan features                         | Available                                                 |
| Overage                               | Blocked at included limits                                |
| Credit, balance, and add-on purchases | Available after checkout captures the payment method      |
| Metered usage reset                   | Monthly on the billing day for trials longer than a month |
| Included balance and credits          | Granted once when the trial starts                        |

## Related

- [Trial Periods](/docs/trial-periods)
- [Offers](/docs/offers)
- [Free Plans](/docs/how-do-free-plans-work-without-payment)
- [Payment Failures](/docs/what-happens-when-a-payment-fails)
