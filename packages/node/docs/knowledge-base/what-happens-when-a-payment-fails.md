---
title: Payment Failures
description: Usage and seats keep working while Commet retries a failed charge on days 1, 3, 5 and 7; if all fail, the subscription ends or moves to the default plan.
---

When a payment fails, your customer's usage and seats keep working while Commet retries the charge — but new purchases are blocked. If all retries fail, their subscription is canceled, or moves to the plan group's [default plan](/docs/plan-groups#default-plan-and-signup-trial).

## What Your Customer Experiences

```
Payment fails
  → Usage and seats keep working (grace period begins)
  → New purchases are blocked
  → Commet retries the charge automatically

All retries fail
  → Their subscription is canceled, or moves to the default plan
  → Paid access is revoked
```

| Stage                 | Access                                  | What's happening                                                                   |
| --------------------- | --------------------------------------- | ---------------------------------------------------------------------------------- |
| Payment fails         | **Usage and seats keep working**        | Subscription moves to `past_due`, invoice becomes `outstanding`, retries scheduled |
| During grace period   | **Usage and seats keep working**        | Automatic retries on day 1, day 3, day 5, and day 7; usage keeps accruing as debt  |
| All retries exhausted | Revoked, or limited to the default plan | Subscription canceled or moved to the default plan, invoice marked `uncollectible` |

> **Warning**
>
> **Purchases are blocked while `past_due`.** Plan changes, add-ons, credit packs, and balance top-ups are rejected until the outstanding invoice is paid. Usage and seat tracking keep working so your customer can pay and continue without interruption.

## First Charge After a Trial

A retryable provider decline on the first paid invoice follows the same `past_due` dunning schedule. If the charge cannot start because the payment method is missing or the customer must take an action, the subscription remains `pending_payment` and checkout is used to complete payment instead of starting dunning.

A [trial without a payment method](/docs/trial-periods#start-a-trial-without-a-payment-method) that ends without a card is not charged. It moves to the default plan or is canceled, with no invoice.
