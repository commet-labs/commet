---
lastModified: 2026-08-17
title: Upgrade and Downgrade Plans
description: How customers change plans through the Customer Portal and dashboard.
---

Customers change plans through the [Customer Portal](/docs/customer-portal) or from the dashboard. Commet handles proration, feature transitions, and billing adjustments automatically.

## Plan change behavior

| Change                     | Behavior                                  | Example                   |
| -------------------------- | ----------------------------------------- | ------------------------- |
| **Upgrade**                | Applied immediately with prorated billing | Starter ($29) → Pro ($99) |
| **Downgrade**              | Takes effect at next renewal              | Pro ($99) → Starter ($29) |
| **Interval change (up)**   | Applied immediately                       | Monthly → Yearly          |
| **Interval change (down)** | Takes effect at next renewal              | Yearly → Monthly          |

Both plans must be in the same [Plan Group](/docs/plan-groups) for customers to change plans themselves through the portal. Free-to-paid changes require a new checkout — the customer is redirected to complete payment.

An immediate upgrade is rejected with a seat-limit error when the customer's current seats exceed the target plan's included seats for a seat feature that is not unlimited and has overage disabled. Reduce seats first, or pick a plan with enough included seats. Interval-only changes and scheduled downgrades are not affected.

If you need to expand features or limits temporarily without changing the subscription's plan, price, or billing cycle, use a [Plan Grant](/docs/plan-grants) instead.

## Dashboard

From a customer's subscription detail page, click **Change Plan** and select the new plan. The same upgrade/downgrade rules apply.

## Learn more

- [What Happens When a Customer Changes Plans](/docs/what-happens-when-a-customer-changes-plans)
- [How Is Proration Calculated](/docs/how-is-proration-calculated-when-changing-plans)

## Related

- [Manage Subscriptions](/docs/manage-subscriptions) — Create, get, and cancel subscriptions
- [Plan Groups](/docs/plan-groups) — Group plans together for self-service upgrades
- [Customer Portal](/docs/customer-portal) — Self-service billing portal for customers
