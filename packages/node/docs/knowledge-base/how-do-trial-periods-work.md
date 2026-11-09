---
title: Trials
description: "How a plan price trial works: checkout saves a card without charging it, or the trial starts at once without one and the first charge waits until it ends."
---

A trial is a number of free days set on a plan price. Each price chooses whether its trial requires a payment method.

## What the customer experiences

|                | Trial with a payment method                  | Trial without a payment method                                                            |
| -------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Start          | Checkout saves the payment method, no charge | Starts at once, no checkout                                                               |
| Primary action | Start free trial                             | None until the customer adds a card                                                       |
| `checkoutUrl`  | Checkout link                                | `null`                                                                                    |
| Trial ends     | First charge, subscription becomes `active`  | With a card, the same. Without one, moves to the plan group's default plan or is canceled |

The trial with a payment method starts after setup succeeds. If the card requires 3D Secure, the customer completes verification before the trial begins.

## How it works

```
1. Commet reads the trial days of the selected price.
2. With a payment method required, checkout saves it without charging.
   Without one, the subscription starts trialing at once.
3. The subscription is trialing and records trialEndsAt.
4. At the end, Commet charges the selected price of the subscription's plan version.
   Without a card, it moves to the default plan or is canceled, with no invoice.
5. A discount from an Offer starts with the first invoice after the trial.
```

> **Note**
>
> The subscription keeps its accepted trial days and its [plan version](/docs/plan-versions). A price change during the trial publishes a new version and doesn't change the first paid charge, unless you move the subscription.

## Customer-specific trials

Use `customTrialDays` to replace the price's trial days for one subscription, or `skipTrial: true` to start without a trial. Both combine with `offerId`.

A customer gets one trial per plan. A customer who already had the plan, in a trial or paying, starts with the regular checkout.

## During the trial

| Behavior                              | During trial                                                                             |
| ------------------------------------- | ---------------------------------------------------------------------------------------- |
| Plan features                         | Available                                                                                |
| Overage                               | Blocked at included limits                                                               |
| Credit, balance, and add-on purchases | Available with a saved payment method                                                    |
| Immediate plan changes                | End the trial and charge the new plan; without a payment method, `409 no_payment_method` |
| Metered usage reset                   | Monthly on the billing day for trials longer than a month                                |
| Included balance and credits          | Granted once when the trial starts                                                       |

See [Trial Periods](/docs/trial-periods) to configure trials.
