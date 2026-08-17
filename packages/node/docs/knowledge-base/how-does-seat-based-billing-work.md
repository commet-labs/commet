---
lastModified: 2026-07-28
title: Seats
description: How seat-based billing works for your customers
---

Plans can include a number of seats at no extra cost. When your customer uses more seats than included, they're charged per extra seat.

## How It Works

```
Plan Pro: 5 included seats, $25/extra seat
Your customer has 8 seats

Included: 5 seats (no charge)
Extra:    3 seats × $25 = $75/mo
```

## What Happens When You Change Included Seats

### Adding more included seats

More included seats **benefits your customers**, so it applies right away.

```
You increase Plan Pro from 10 to 15 included seats.
Your customer has 12 seats (was paying for 2 extra at $50/mo).

After the change:
  → All 12 seats are now within the 15 included
  → Extra seat charges drop to $0
  → Your customer sees the change immediately
```

### Reducing included seats

Fewer included seats harms your customers, so it applies **at renewal**.

```
You decrease Plan Pro from 15 to 10 included seats.
Your customer has 12 seats (all included, $0 extra).

This period:  Still 12 included, $0 extra
At renewal:   10 included + 2 extra = $50/mo
```

## What Happens When You Change Seat Prices

Seat unit prices use current-period snapshots: a lower price applies immediately, while a higher price starts next period.

| Change          | What your customer pays                      |
| --------------- | -------------------------------------------- |
| Lower the price | New lower price in the current period        |
| Raise the price | Old price this period; new price next period |

## Seats and Upgrades

On an upgrade, your customer is charged the new plan's **full price** and credited for the unused days of the old plan's **base price**. Extra-seat charges already paid are not credited; extra seats on the new plan are billed for the full new period in advance.

### Example

```
Your customer is on Pro ($99/mo, 5 included seats, $25/extra seat).
They have 8 seats — paying $174/mo total (5 included + 3 extra).

They upgrade to Business ($299/mo, 10 included seats, $20/extra seat).
On day 15 of their cycle.

Charge:
  New plan: $299 (full price — the billing cycle restarts today)
  Extra seats: $0 — their 8 seats are within the 10 included

Credit:
  Plan base: $99 × (15/30) = $49.50
  Extra seats: $0 — extra-seat charges already paid are not credited

They pay today: $249.50
```

> **Note**
>
> Your customer's 8 seats are now covered by the Business plan's 10 included seats. If they had 12 seats, the 2 above the included 10 would be billed for the full new period in advance: 2 × $20 = $40.

## Related

- [Proration](/docs/how-is-proration-calculated-when-changing-plans) — How mid-cycle charges are calculated
- [Pricing Changes](/docs/what-happens-when-you-change-your-prices) — How price changes apply to existing customers
- [Billing Intervals](/docs/how-do-monthly-quarterly-and-yearly-billing-work) — When seats are charged on quarterly and yearly plans
