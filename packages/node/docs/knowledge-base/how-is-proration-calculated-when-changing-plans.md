---
lastModified: 2026-07-28
title: Proration
description: Exactly how mid-cycle charges are calculated when your customer upgrades
---

When your customer upgrades mid-cycle, they're charged the new plan's **full price**, credited for the unused days of the old plan's base price, and their billing cycle **restarts on the day of the change**.

## The Calculation

```
Credit   = Old plan base price × (days remaining / days in cycle)
Charge   = New plan's full price
They pay = Charge - Credit

The billing cycle restarts on the day of the change.
```

The credit covers the old plan's **effective base price only**. If an Offer discount was active, Commet credits what the customer actually paid, not the undiscounted list price. Metered usage consumed since the period started is charged on the same invoice.

## Example: Simple Upgrade

```
Your customer is on Starter at $29/mo, paid on January 1.
They upgrade to Pro at $99/mo on January 15 (15 days remaining).

Charge for Pro (full price):            $99.00
Credit for unused Starter days: $29 × (15/30) = $14.50
They pay today: $84.50

New billing cycle: January 15 – February 15
Next full invoice: $99 on February 15
```

## Example: Upgrade with Extra Seats

Extra seats are **not credited** on a plan change. Extra seats on the new plan are billed for the full new period in advance.

```
Current plan: Pro $99/mo, 5 included seats, $25/extra seat
Your customer has 8 seats (5 included + 3 extra = $174/mo total)

They upgrade to: Business $299/mo, 10 included seats, $20/extra seat
On January 15 (15 days remaining)
```

|                            | Calculation                                           |
| -------------------------- | ----------------------------------------------------- |
| Charge for new plan base   | $299 (full price)                                     |
| Charge for new extra seats | $0 — their 8 seats are within the 10 included         |
| Credit for old plan base   | $99 × (15/30) = $49.50                                |
| Credit for extra seats     | $0 — extra-seat charges already paid are not credited |
| **They pay today**         | **$249.50**                                           |

> **Note**
>
> Your customer's 8 seats are now fully covered by the Business plan's 10 included seats, so they stop paying for extra seats. If they had more seats than the new plan includes, the excess would be billed for the full new period in advance.

## Quarterly and Yearly Plans

The same calculation applies — the only difference is the cycle length.

### Example

```
Your customer is on Plan A at $300/quarter (January 1 – April 1).
They upgrade to Plan B at $600/quarter on February 15 (45 days remaining).

Charge for Plan B (full price):  $600.00
Credit: $300 × (45/90) =         $150.00
They pay today: $450.00

New billing cycle: February 15 – May 15
Next renewal: May 15
```

## Why Downgrades Aren't Prorated

Downgrades take effect **at renewal**. Your customer already paid for the current cycle and keeps their plan until it expires. Since there's no mid-cycle switch, there's nothing to prorate and no refund.

## Why Free → Paid Isn't Prorated

When your customer moves from a free plan to a paid plan, there's no credit to give — the free plan costs $0. They simply pay the full price of the new plan from that day.

## Related

- [Plan Changes](/docs/what-happens-when-a-customer-changes-plans) — When proration applies and when it doesn't
- [Seats](/docs/how-does-seat-based-billing-work) — How seat-based billing works with upgrades
- [Invoices](/docs/what-invoices-do-customers-receive-and-when) — What invoices your customers receive
