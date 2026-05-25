---
"@commet/node": minor
"@commet/next": minor
---

feat: add missing SDK methods and webhook handlers

@commet/node:
- Add `subscriptions.changePlan()` for upgrading/downgrading plans
- Add `usage.check()` for verifying quota before consuming
- Add `addons.getActive()` for fetching active addons
- Export `ChangePlanParams`, `ChangePlanResult`, `UncancelParams`, `CheckUsageParams`, `UsageCheckResult`, `ActiveAddon`, `GetActiveAddonsParams` types

@commet/next:
- Add `onSubscriptionPlanChanged` webhook handler
- Add `onPaymentReceived` webhook handler
- Add `onPaymentFailed` webhook handler
- Add `onInvoiceCreated` webhook handler
