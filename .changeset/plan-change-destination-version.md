---
"@commet/node": minor
"commet": minor
---

Sync the Node SDK and the CLI with the current API `2026-08-27` contract:

- `subscriptions.changePlan` and `subscriptions.previewChange` choose the destination version: `planCode` (a plan code, or `<plan code>:<experiment code>` for a running experiment's latest version) instead of `newPlanId`/`planId`, and `planVersionId` for a published version of the destination plan.
- Offers take `planIds` and `billingInterval` to limit the plans and billing interval they apply to.
- `subscriptions.list` accepts `limit` and `cursor`.
- The `subscription.plan_changed` and `subscription.plan_change_scheduled` webhook payloads carry `cancelReason`.

The CLI adds the matching `--plan-code`, `--plan-version-id`, `--plan-ids` and `--billing-interval` flags. The bundled documentation matches the current contract.
