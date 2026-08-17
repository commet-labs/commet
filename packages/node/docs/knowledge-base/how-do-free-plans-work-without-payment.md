---
lastModified: 2026-07-10
title: Free Plans
description: How free plans work for your customers
---

A free plan has no price and no checkout. When you assign a customer to a free plan, they're activated immediately. Their usage resets every month, just like a paid plan.

## How Free Plans Differ from Paid Plans

|                | Paid plan                     | Free plan                                                  |
| -------------- | ----------------------------- | ---------------------------------------------------------- |
| Price          | Has a price                   | $0                                                         |
| Billing        | Monthly, quarterly, or yearly | No charges — usage resets monthly                          |
| How they start | Checkout + payment            | **Activated immediately**                                  |
| Invoices       | Yes                           | Only for purchases (credits, balance, add-ons)             |
| Overage        | Configurable per feature      | **Never allowed** — usage is blocked at the included limit |
| Usage resets   | Every month                   | Every month                                                |

## Monthly Usage Resets

Even though there's no billing cycle, your customer's usage resets **every month** — the same cadence as a paid monthly plan. If you give a free plan 1,000 API calls or $50 in balance, that allowance refreshes on their billing day each month.

When a customer hits their included limit, they're blocked until the next reset. Overage is never charged on a free plan.

### Example

```
Your free plan includes $100 in balance.
Your customer uses $100 by day 15.

→ They're blocked for the rest of the month.
→ On their billing day, balance resets to $100.
```

## What Your Customer Sees in the Portal

The Customer Portal adapts when someone is on a free plan:

| Section                 | Paid plan                                         | Free plan                                    |
| ----------------------- | ------------------------------------------------- | -------------------------------------------- |
| Subscription            | Shows plan, price, and next billing date          | Shows plan and status only — no billing date |
| Invoices                | Visible                                           | Visible only if they've made purchases       |
| Payment method          | Visible                                           | Visible only if they've added one            |
| MRR                     | Shows amount                                      | Shows $0.00/mo                               |
| Usage (balance/credits) | Visible, with "Add Funds" or "Buy Credits" button | Visible, with purchase buttons               |

## Purchasing on a Free Plan

Free plan customers can purchase add-ons, credit packs, and balance top-ups — the same one-off purchases available on paid plans. Since they didn't go through checkout, they don't have a card on file. The first purchase prompts them to enter a payment method, which is saved for future purchases.

> **Note**
>
> The plan itself is free. Purchases are optional extras that customers choose to buy.

## Changing a Free Plan's Included Balance or Credits

If you change the included balance or credits on a free plan, the change applies at **each customer's next monthly reset**. Balances already granted for the current month don't change.

### Example

```
You increase the free plan's included balance from $100 to $150.

A customer whose billing day is the 20th keeps their current balance until the 20th.
On the 20th, their monthly reset grants $150.
```

## When Your Customer Upgrades to a Paid Plan

The upgrade is always **immediate**. Since the free plan costs $0, there's no credit to give — your customer simply pays the full price of the new plan from that day.

### Example

```
Your customer is on a Free plan with $100 included balance.
They upgrade to Pro at $99/mo.

Credit from free plan: $0 (it's free)
They pay: $99 (full month)
Invoices, payment method, and billing info appear in their portal.
```

## Related

- [Plan Changes](/docs/what-happens-when-a-customer-changes-plans) — Upgrades, downgrades, and switching
- [Trials](/docs/how-do-trial-periods-work) — Another way to let customers try before paying
- [Invoices](/docs/what-invoices-do-customers-receive-and-when) — What invoices your customers receive
