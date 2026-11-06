---
title: Seats
description: How included and extra seats are charged, when changes to seats or seat prices take effect, and how upgrades treat seats.
---

Plans can include a number of seats at no extra cost. When your customer uses more seats than included, they're charged per extra seat.

## How It Works

```
Plan Pro: 5 included seats, $25/extra seat
Your customer has 8 seats

Included: 5 seats (no charge)
Extra:    3 seats × $25 = $75/mo
```

## What Happens When You Change Included Seats or Seat Prices

Changing included seats or the extra-seat price publishes a new [plan version](/docs/plan-versions). New customers get it at once. Existing customers keep the included seats and seat price of their version, in both directions, until you move them.

```
You increase Plan Pro from 10 to 15 included seats.
Your customer has 12 seats (paying for 2 extra at $50/mo).

Without a move:      still 10 included + 2 extra = $50/mo
After you move them: all 12 seats within the 15 included, $0 extra
```

```
You decrease Plan Pro from 15 to 10 included seats.
Your customer has 12 seats (all included, $0 extra).

Without a move:      still 15 included, $0 extra
After you move them: 10 included + 2 extra = $50/mo
```

| Change                        | New customers      | Existing customers                      |
| ----------------------------- | ------------------ | --------------------------------------- |
| Raise or lower included seats | Get the new amount | Keep their version's amount until moved |
| Raise or lower the seat price | Pay the new price  | Pay their version's price until moved   |

A move made now changes included seats today and the price from the next renewal; a move at renewal changes both then. A customer with more seats than the new version allows can't move until their seats fit; a plan move can lower them at renewal with `seatLimit`. See [Move subscribers](/docs/plan-versions#move-subscribers).

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
