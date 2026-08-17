---
lastModified: 2026-08-16
title: How Billing Works
description: How your billing behaves based on what you and your customers do
---

Commet measures what a customer can consume and charges according to the plan they accepted. Your catalog defines the terms, the subscription stores the active relationship, usage records consumption, invoices calculate what is owed, and transactions record payment attempts.

Those layers change at different times. Commet separates catalog changes, subscription changes, and billing recovery. Each has an explicit rule; there is no single price-based heuristic for every operation.

| Layer        | Source of truth                                          | Typical question                                |
| ------------ | -------------------------------------------------------- | ----------------------------------------------- |
| Catalog      | Plans, prices, features, Offers, and Markets             | What can a new customer buy?                    |
| Subscription | Selected plan, price, accepted Offer, period, and status | What did this customer accept?                  |
| Consumption  | Usage, seats, quota, credits, or balance                 | What did the customer use?                      |
| Invoice      | Line items, tax, credits, and amount due                 | What does the customer owe?                     |
| Transaction  | Provider-neutral payment attempt                         | Did the charge succeed, fail, retry, or refund? |

## Quick Reference

### When You Make Changes

| What you do                                                     | What happens to existing customers                                                 |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Change the selected base or variant price                       | Current paid period stays unchanged; renewal uses that catalog row's current value |
| Lower a per-unit price (usage, seats, quota)                    | **Applies immediately** — this period is billed at the cheaper price               |
| Raise a per-unit price (usage, seats, quota)                    | New price applies starting next period                                             |
| Increase included units, enable a feature, or make it unlimited | **Updates the current-period snapshot**                                            |
| Reduce included units, disable a feature, or remove it          | Existing snapshot remains until renewal                                            |
| Hide or soft-delete a plan                                      | Existing subscriptions keep it; new selection is blocked                           |
| Archive a price                                                 | New selection is blocked; subscriptions already bound to it continue               |
| Change a free plan's included balance/credits                   | Applies at each customer's next monthly reset                                      |

### When Your Customer Makes Changes

| What they do                                                                  | What happens                                                                                         |
| ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Move to a higher-`sortOrder` plan in the same group without changing interval | **Immediate** — charged the new plan's full price minus a credit for unused days; the cycle restarts |
| Move to a lower-`sortOrder` plan in the same group without changing interval  | Keeps current plan until renewal, then switches                                                      |
| Switch from free to paid                                                      | **Immediate** — pays full price, no credit (free = $0)                                               |
| Switch from paid to free                                                      | Keeps current plan until renewal, then switches                                                      |
| Switch to a longer interval                                                   | **Immediate**                                                                                        |
| Switch to a shorter interval                                                  | Takes effect at renewal                                                                              |

### Automatic Events

| What happens                                                 | What your customer experiences                                                               |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| Trial starts                                                 | They use the product, no charge. **Overage is blocked** — usage stops at included limits     |
| Trial ends                                                   | They're charged the current price, overage activates normally                                |
| Renewal or retryable first-trial charge fails                | Subscription becomes `past_due`; usage continues while retries run and purchases are blocked |
| First-trial charge needs a payment method or customer action | Subscription remains `pending_payment` so checkout can complete                              |
| Canceled subscription                                        | Can be reactivated — fresh invoice at the current price, new billing period starts that day  |

## The Boundaries That Matter

- Interval direction determines timing first. When the interval is unchanged, the plan group's order defines upgrade and downgrade direction, not the amount. Paid-to-free changes are always scheduled.
- The subscription stores the selected price ID. Renewal reads that row's current catalog value.
- Current-period feature snapshots protect already-started periods from harmful feature changes while allowing beneficial changes immediately.
- Accepted Offer phases are immutable snapshots; base prices are not.
- Recovery retries the same outstanding invoice instead of creating a new sale.

## Explore Each Topic

- [Pricing Changes](/docs/what-happens-when-you-change-your-prices) — What happens when you change your prices
- [Plan Changes](/docs/what-happens-when-a-customer-changes-plans) — Upgrades, downgrades, and switching plans
- [Billing Intervals](/docs/how-do-monthly-quarterly-and-yearly-billing-work) — Monthly, quarterly, and yearly billing
- [Invoices](/docs/what-invoices-do-customers-receive-and-when) — What invoices your customers receive and when
- [Proration](/docs/how-is-proration-calculated-when-changing-plans) — How mid-cycle charges are calculated
- [Trials](/docs/how-do-trial-periods-work) — How trial periods work
- [Free Plans](/docs/how-do-free-plans-work-without-payment) — How free plans work
- [Payment Failures](/docs/what-happens-when-a-payment-fails) — What happens when a payment fails
- [Seats](/docs/how-does-seat-based-billing-work) — How seat-based billing works
