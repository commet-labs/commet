---
"@commet/node": minor
---

Add `consumptionModel`, `credits`, and `balance` fields to `ActiveSubscription` response from `subscriptions.get()`. Clients can now read credits or balance state for credits/balance plans instead of inferring it. `consumptionModel` is `"metered" | "credits" | "balance"` and indicates which summary (if any) is populated.
