---
lastModified: 2026-07-28
title: Pricing Changes
description: What happens to your customers when you change your prices
---

When you change a price, **new customers pay the new price immediately**. For existing customers, the rule is asymmetric: **decreases apply immediately, increases apply at renewal**.

The exception is a plan's selected base price or variant, which changes at renewal in both directions.

## Base and Variant Prices

The subscription keeps the selected price ID. Changes to that catalog row take effect **at renewal**, whether you raise or lower it — the current period is already paid. If the selected row is a regional variant, its own current market price is used.

|                     | New customers | Existing customers               |
| ------------------- | ------------- | -------------------------------- |
| You raise the price | Pay new price | Keep current price until renewal |
| You lower the price | Pay new price | Keep current price until renewal |

### Example

```
You change Plan Pro from $99/mo to $129/mo.

A new customer signs up today → pays $129/mo.
An existing customer on day 15 of their month → keeps paying $99/mo.
That same customer at renewal → starts paying $129/mo.
```

> **Note**
>
> Archiving a price prevents new selection but does not break subscriptions already bound to it. Accepted Offer phases remain snapshotted separately.

## Usage-Based Pricing (Overage)

Per-unit price changes are asymmetric: a **decrease applies immediately** to the current period, an **increase applies at renewal**.

### Example

```
You raise the overage price from $0.002/call to $0.005/call.
Your customer has already used 5,000 extra calls this month.

This month's invoice → still charged at $0.002
Next month's invoice → charged at $0.005

You lower the overage price from $0.005/call to $0.002/call.

This month's invoice → charged at $0.002 — the cheaper price applies immediately
```

## Seat Pricing

Per-seat prices follow the same asymmetry: cheaper applies now, more expensive applies at renewal.

### Example

```
You raise the extra seat price from $25/seat to $35/seat.
Your customer has 3 extra seats.

This month → 3 × $25 = $75
Next month → 3 × $35 = $105

You lower it from $35/seat to $25/seat.

This month → 3 × $25 = $75 — applied immediately
```

## Related

- [Plan Changes](/docs/what-happens-when-a-customer-changes-plans) — What happens when your customer upgrades or downgrades
- [Proration](/docs/how-is-proration-calculated-when-changing-plans) — How mid-cycle charges are calculated
- [Seats](/docs/how-does-seat-based-billing-work) — How seat-based billing works
