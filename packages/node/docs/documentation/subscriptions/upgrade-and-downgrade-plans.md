---
title: Upgrade and Downgrade Plans
description: Upgrades apply immediately with proration and downgrades wait for renewal, whether customers change plans in the portal or you do it in the dashboard.
---

Customers change plans through the [Customer Portal](/docs/customer-portal) or from the dashboard. Commet handles proration, feature transitions, and billing adjustments automatically.

## Plan change behavior

| Change                     | Behavior                                  | Example                   |
| -------------------------- | ----------------------------------------- | ------------------------- |
| **Upgrade**                | Applied immediately with prorated billing | Starter ($29) → Pro ($99) |
| **Downgrade**              | Takes effect at next renewal              | Pro ($99) → Starter ($29) |
| **Interval change (up)**   | Applied immediately                       | Monthly → Yearly          |
| **Interval change (down)** | Takes effect at next renewal              | Yearly → Monthly          |

Both plans must be in the same [Plan Group](/docs/plan-groups) for customers to change plans themselves through the portal. Free-to-paid changes open a checkout for the customer to pay. When the new price has a [trial without a payment method](/docs/trial-periods#start-a-trial-without-a-payment-method) and the customer never had that plan, the trial starts at once instead.

A change to another plan lands on that plan's current [version](/docs/plan-versions). The destination must sell the customer's currency in their country: otherwise the change and its preview return `422 missing_regional_price`, and the portal doesn't offer that plan. To move a customer to a newer version of the same plan, [change its version](/docs/manage-subscriptions#change-the-plan-version) instead.

Immediate changes accept an `offerId` or a [`promoCode`](/docs/promo-codes#apply-a-code-on-a-plan-change). Scheduled changes accept neither.

An immediate upgrade is rejected with a seat-limit error when the customer's current seats exceed the target plan's included seats for a seat feature that is not unlimited and has overage disabled. Reduce seats first, or pick a plan with enough included seats. Interval-only changes and scheduled downgrades are not affected.

During a trial without a payment method, an immediate change returns `409 no_payment_method`. Scheduled changes still apply.

If you need to expand features or limits temporarily without changing the subscription's plan, price, or billing cycle, use a [Plan Grant](/docs/plan-grants) instead.

## Revoke a scheduled plan change

A scheduled downgrade or interval change can be revoked before it takes effect, so the subscription stays on its current plan:

- Customers choose **Keep current plan** in the portal.
- In the dashboard, open the subscription and choose **Revert plan change**.
- Through the API, call `DELETE /subscriptions/{id}/scheduled-plan-change`.

```typescript
await commet.subscriptions.revokeScheduledPlanChange({ id: 'sub_xxx' })
```

A subscription with nothing scheduled returns `409 no_scheduled_plan_change`. One whose payment authorization must be renewed first returns `409 no_payment_method`.

## Dashboard

From a customer's subscription detail page, click **Change plan** and select the new plan. The same upgrade/downgrade rules apply.

## Learn more

- [What Happens When a Customer Changes Plans](/docs/what-happens-when-a-customer-changes-plans)
- [How Is Proration Calculated](/docs/how-is-proration-calculated-when-changing-plans)
