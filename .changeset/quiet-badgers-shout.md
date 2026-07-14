---
"@commet/node": minor
---

Pin the SDK to API version 2026-07-11.

- `subscriptions.create` accepts `customTrialDays` to override the plan's trial length per subscription.
- `Transaction.grossAmount` and `Transaction.subtotal` are now nullable: a failed non-USD charge never settled in USD, so no USD figure exists for it.
- `Transaction.presentmentAmount` exposes the amount in the charge currency as presented to the customer, set for non-USD charges.
