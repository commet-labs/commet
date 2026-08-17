---
lastModified: 2026-07-28
title: Plan Changes
description: What happens when your customer upgrades, downgrades, or switches plans
---

Your customers can switch between plans in the same plan group through the [Customer Portal](/docs/customer-portal). The group's `sortOrder` defines upgrade and downgrade direction; Commet does not infer it from price.

## Upgrades

When the billing interval stays the same, moving to a plan with a higher `sortOrder` is an **immediate** change. The customer is charged the new plan's full price, credited for the unused days of the old effective base price, and their billing cycle restarts on the day of the change.

> **Warning**
>
> An upgrade is blocked if the customer already uses more seats than the new plan includes, when that seat feature has overage disabled. They have to remove the extra seats first, or choose a plan with enough included seats.

### Example

```
Your customer is on Starter at $29/mo, paid on January 1.
They upgrade to Pro at $99/mo on January 15 (15 days left).

Charge for Pro (full price):            $99.00
Credit for unused Starter days: $29 × (15/30) = $14.50
They pay today: $84.50

New billing cycle: January 15 – February 15
Next full invoice: $99 on February 15
```

## Downgrades

When the billing interval stays the same, moving to a plan with a lower `sortOrder` is scheduled **at renewal**. The customer keeps the current plan and features until the end of the paid period, then switches.

> **Note**
>
> Your customer already paid for this period. They keep full access until it expires — no partial refunds, no disruption.

## Free to Paid

When your customer moves from a free plan to a paid plan, the change is always **immediate**. There's no credit to issue since the free plan costs $0, so they pay the full price of the new plan.

### Example

```
Your customer is on a Free plan with $100 included balance.
They upgrade to Pro at $99/mo.

Credit from free plan: $0 (it's free)
They pay today: $99 (full month)
```

## Changing Billing Frequency

| Change                                              | What happens  |
| --------------------------------------------------- | ------------- |
| Shorter → longer interval, such as monthly → yearly | **Immediate** |
| Longer → shorter interval, such as yearly → monthly | At renewal    |

Interval direction takes precedence over `sortOrder` when both the plan and interval change. A paid-to-free change is always scheduled, even if the destination plan has a higher `sortOrder`.

## Deprecating a Plan

When you deprecate a plan, it disappears from your pricing page, dashboard, and portal — but **your existing customers keep it**. Their billing continues normally. If they cancel, they won't be able to come back to that plan.

## Deleting a Plan

Deleting a plan is a **soft delete**. The plan disappears from your pricing page and can't be assigned to new customers — but existing subscriptions are unaffected and keep billing normally.

## Reactivation

A canceled subscription can be **reactivated** — from the dashboard, the API, or the Customer Portal.

Reactivation generates a fresh invoice at the plan's current price, charges the saved card, and starts a new billing period on the reactivation date. If the charge is declined, the subscription stays canceled and your customer gets a link to update their card.

If the cancellation is only scheduled for the end of the period, your customer can undo it in the portal before it takes effect.

> **Note**
>
> If the plan is no longer available, reactivation is rejected — your customer starts a new subscription on a different plan.

## Feature Changes

Feature changes use the current-period subscription snapshot:

| What you do                                                                                        | Existing customers                      |
| -------------------------------------------------------------------------------------------------- | --------------------------------------- |
| Add a feature, enable it, increase its included amount, make it unlimited, or lower its unit price | **Applied to the current period**       |
| Remove a feature, disable it, reduce its included amount, or raise its unit price                  | Existing snapshot remains until renewal |

### Example

```
You lower Plan Pro from 10,000 API calls to 5,000.

New customers get 5,000.
Existing customers keep 10,000 until renewal, then switch to 5,000.
```

```
You raise Plan Pro from 5,000 API calls to 10,000.

All customers — new and existing — get 10,000 right away.
```

## Related

- [Proration](/docs/how-is-proration-calculated-when-changing-plans) — Exactly how mid-cycle charges are calculated
- [Pricing Changes](/docs/what-happens-when-you-change-your-prices) — What happens when you change prices without changing plans
- [Billing Intervals](/docs/how-do-monthly-quarterly-and-yearly-billing-work) — How quarterly and yearly billing works
