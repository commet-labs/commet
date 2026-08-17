---
lastModified: 2026-07-28
title: Quota
description: How quota-based billing works for your customers
---

Plans can include a quota of a durable resource at no extra cost — tasks, WhatsApp numbers, parallel automations. When your customer goes over the included amount, they're charged per extra unit. Unlike a usage meter that only counts up, a quota balance rises and falls as customers create and delete.

## How it works

Units above the included amount at the start of a period are billed for the **full period in advance**.

```
Plan Pro: 15 included tasks, $0.75/extra task
Your customer starts the period holding 25 tasks

Included: 15 tasks (no charge)
Extra:    10 tasks × $0.75 = $7.50 — billed in advance for the full period
```

## Quota rises and falls

The balance moves during the period, but billing follows the **high-water mark** — the highest quota held during the period. Each increase above the mark is billed from the day of the increase to the **end of the period**; deleting units never reduces the charge.

```
Your customer starts the month at 15 tasks.
They create 10 more on day 15 (25 total), then delete them on day 20.

Extra: 10 tasks billed from day 15 to the end of the period
       10 × $0.75 × (15/30) = $3.75
```

The charge is the same whether they keep the 10 tasks until the end of the period or delete them on day 20. Re-creating units below the high-water mark costs nothing — they're already billed.

These charges land on the next renewal invoice.

## What happens when you change the included amount

### Adding more included units

More included units **benefits your customers**, so it applies right away.

```
You increase Plan Pro from 15 to 30 included tasks.
Your customer has 25 tasks (was paying for 10 extra at $7.50/mo).

After the change:
  → All 25 tasks are now within the 30 included
  → Extra charges drop to $0
  → Your customer sees the change immediately
```

### Reducing included units

Fewer included units harms your customers, so it applies **at renewal**.

```
You decrease Plan Pro from 30 to 15 included tasks.
Your customer has 25 tasks (all included, $0 extra).

This period:  Still 25 within the included amount, $0 extra
At renewal:   15 included + 10 extra = $7.50/mo
```

## What happens when you change the price

Quota unit prices use current-period snapshots: a lower price applies immediately, while a higher price starts next period.

| Change          | What your customer pays                      |
| --------------- | -------------------------------------------- |
| Lower the price | New lower price in the current period        |
| Raise the price | Old price this period; new price next period |

## Quota and upgrades

On an upgrade, your customer is charged the new plan's **full price** and credited for the unused days of the old plan's **base price**. Extra-unit charges already paid are not credited.

### Example

```
Your customer is on Pro ($29/mo, 15 included tasks, $0.75/extra task).
They have 25 tasks — paying $36.50/mo total (15 included + 10 extra).

They upgrade to Scale ($79/mo, 50 included tasks, $0.50/extra task).
On day 15 of their cycle.

Charge:
  New plan: $79 (full price — the billing cycle restarts today)
  Extra tasks: $0 — their 25 tasks are within the 50 included

Credit:
  Plan base: $29 × (15/30) = $14.50
  Extra tasks: $0 — extra-unit charges already paid are not credited

They pay today: $64.50
```

> **Note**
>
> Your customer's 25 tasks are now covered by the Scale plan's 50 included tasks. They stop paying for extra tasks entirely.

## Related

- [Proration](/docs/how-is-proration-calculated-when-changing-plans) — How mid-cycle charges are calculated
- [Pricing Changes](/docs/what-happens-when-you-change-your-prices) — How price changes apply to existing customers
- [Billing Intervals](/docs/how-do-monthly-quarterly-and-yearly-billing-work) — When quota is charged on quarterly and yearly plans
