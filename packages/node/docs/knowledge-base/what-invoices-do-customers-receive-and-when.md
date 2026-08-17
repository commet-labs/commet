---
lastModified: 2026-07-10
title: Invoices
description: What invoices your customers receive and when
---

Your customers receive invoices automatically based on what happens in their subscription. Here's every type of invoice they might see and when it's generated.

## Types of Invoices

| Invoice           | When your customer receives it                                               |
| ----------------- | ---------------------------------------------------------------------------- |
| Recurring         | Every billing cycle — includes plan base, extra usage, and extra seats       |
| Overage           | Between billing cycles (quarterly/yearly plans only) if they had extra usage |
| Plan change       | When they upgrade or switch plans mid-cycle                                  |
| Credit purchase   | When they buy a credit pack                                                  |
| Balance top-up    | When they add funds to their balance                                         |
| Add-on activation | When they activate an add-on mid-cycle (prorated)                            |
| One-time payment  | When they pay a payment link or a standalone charge                          |
| Reactivation      | When a canceled subscription is reactivated                                  |
| Adjustment        | When you manually issue a correction or one-off charge                       |

## Recurring

This is the standard invoice your customer receives on each billing cycle. It includes everything: plan base price, extra usage charges, and extra seat charges.

Extra seats are billed both ways on this invoice: **in advance** for the seats held going into the new period, and a **true-up** for seats added mid-cycle during the period that just ended, prorated by day. Quota works the same way.

### Example

```
Monthly invoice for a customer on Plan Pro at $99/mo:

  Plan base:                                     $99.00
  Extra usage (2,000 API calls × $0.01):         $20.00
  Extra seats — upcoming period (2 × $25):       $50.00
  Extra seats — true-up (1 × $25 × 15/30 days):  $12.50
  ─────────────────────────────────────────────
  Total:                                        $181.50
```

## Overage

For customers on quarterly or yearly plans, if they go over their included usage **between billing cycles**, they receive a smaller invoice covering just the extra usage. No plan base or seat charges — just the overage.

### Example

```
A customer on a quarterly plan used 500 extra API calls in month 2:

  Extra usage (500 × $0.01):  $5.00
  ─────────────────────────────────
  Total:                      $5.00
```

If they had no extra usage that month, they don't receive any invoice.

## Plan Change

When your customer upgrades through the portal, they receive an invoice charging the new plan's full price minus a credit for the unused days of the old plan's base price. Their billing cycle restarts on the day of the change.

### Example

```
Customer upgrades from Starter ($29/mo) to Pro ($99/mo) on day 15:

  Pro — new period (full price):    $99.00
  Credit for unused Starter days:  -$14.50
  ────────────────────────────────────────
  Total:                            $84.50
```

## Other Invoices

- **Credit purchase** — when your customer buys a credit pack through the portal or checkout.
- **Balance top-up** — when your customer adds funds to their balance.
- **Add-on activation** — when your customer activates an add-on mid-cycle; the first charge is prorated.
- **One-time payment** — when your customer pays a payment link or a standalone charge, outside any subscription.
- **Reactivation** — when a canceled subscription is reactivated; a fresh invoice at the plan's current price, starting a new billing period.
- **Adjustment** — when you manually create a correction, refund, or one-off charge from the dashboard.

## Invoice Line Types

Every invoice is built from these line types:

- `plan_base`: The plan's base price.
- `feature_overage`: Extra metered usage above the included amount.
- `feature_seats`: Extra seat charges — advance and true-up.
- `feature_quota`: Extra quota charges — advance and true-up.
- `discount`: Introductory offer discount.
- `promo_code_discount`: Promo code discount.
- `credit`: Credit applied to the invoice.
- `balance_overage`: Balance spent past zero, when the plan allows it.
- `addon_base`: Add-on charge at renewal.
- `one_time`: Standalone one-time payment.

## Related

- [Billing Intervals](/docs/how-do-monthly-quarterly-and-yearly-billing-work) — When quarterly and yearly customers get charged
- [Proration](/docs/how-is-proration-calculated-when-changing-plans) — How mid-cycle charges are calculated
- [Plan Changes](/docs/what-happens-when-a-customer-changes-plans) — When plan change invoices are created
