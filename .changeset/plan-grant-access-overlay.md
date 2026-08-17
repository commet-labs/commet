---
"@commet/node": patch
"commet": patch
---

Align the Plan Grant contract with temporary Feature Access overlays.

A Plan Grant expands an active subscription's feature access using a higher plan in the same plan group. It does not change the base plan, price, billing interval, invoices, or seats.

- `customers.createPlanGrant` takes `subscriptionId` instead of `billingInterval`.
- `PlanGrant` exposes `basePlanId` and `planReleaseId` instead of `planPriceId` and `billingInterval`.
- The `plan_grant` invoice line type is removed.
- CLI: `commet customers create-plan-grant` takes `--subscription-id` instead of `--billing-interval`.
