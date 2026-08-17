---
"@commet/node": patch
"commet": patch
---

Align the Plan Grant contract with temporary Feature Access overlays.

A Plan Grant now expands an explicit active subscription's feature access using a higher plan in the same plan group. It never changes the base plan, price, currency, billing interval, billing anchor, invoices, payment state, usage, or seats.

- `customers.createPlanGrant` requires `subscriptionId` and no longer accepts `billingInterval`.
- The `PlanGrant` model exposes `basePlanId` and `planReleaseId` instead of `planPriceId` and `billingInterval`.
- The invoice line type `plan_grant` is gone, because a grant produces no invoice line.
- The CLI command `commet customers create-plan-grant` replaces `--billing-interval` with `--subscription-id`.

This intentionally breaks the previous Plan Grant contract. It ships without adapters, route variants, or deprecated shims because there are no persisted Plan Grants and no SDK consumers of the previous operation.

Also relaxes `portal.getUrl` and `testClock.advance` to accept no arguments, matching the current API contract where both request bodies are optional.
