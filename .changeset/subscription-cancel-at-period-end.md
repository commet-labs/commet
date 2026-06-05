---
"@commet/node": minor
---

Add `cancelAtPeriodEnd` to the subscription object returned by `subscriptions.retrieve()` and `subscriptions.active()`. It is `true` when a subscription is scheduled to cancel at the end of the current period (a pending cancellation), and `false` otherwise.
