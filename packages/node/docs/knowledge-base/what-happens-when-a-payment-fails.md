---
lastModified: 2026-07-28
title: Payment Failures
description: What happens when your customer's payment fails
---

When a payment fails, your customer's usage and seats keep working while Commet retries the charge — but new purchases are blocked. If all retries fail, their subscription is canceled.

## What Your Customer Experiences

```
Payment fails
  → Usage and seats keep working (grace period begins)
  → New purchases are blocked
  → Commet retries the charge automatically

All retries fail
  → Their subscription is canceled
  → Access is revoked
```

| Stage                 | Access                           | What's happening                                                                   |
| --------------------- | -------------------------------- | ---------------------------------------------------------------------------------- |
| Payment fails         | **Usage and seats keep working** | Subscription moves to `past_due`, invoice becomes `outstanding`, retries scheduled |
| During grace period   | **Usage and seats keep working** | Automatic retries on day 1, day 3, day 5, and day 7; usage keeps accruing as debt  |
| All retries exhausted | Revoked                          | Subscription canceled, invoice marked `uncollectible`                              |

> **Warning**
>
> **Purchases are blocked while `past_due`.** Plan changes, add-ons, credit packs, and balance top-ups are rejected until the outstanding invoice is paid. Usage and seat tracking keep working so your customer can pay and continue without interruption.

## First Charge After a Trial

A retryable provider decline on the first paid invoice follows the same `past_due` dunning schedule. If the charge cannot start because the payment method is missing or the customer must take an action, the subscription remains `pending_payment` and checkout is used to complete payment instead of starting dunning.

## Related

- [Invoices](/docs/what-invoices-do-customers-receive-and-when) — What invoices your customers receive
- [Trials](/docs/how-do-trial-periods-work) — What happens if the first charge after a trial fails
- [Plan Changes](/docs/what-happens-when-a-customer-changes-plans) — How a canceled customer can come back
