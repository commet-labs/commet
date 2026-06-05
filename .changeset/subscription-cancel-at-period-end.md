---
"@commet/node": minor
---

Add `cancelAtPeriodEnd` to the `ActiveSubscription` object returned by `subscriptions.getActive()`. It is `true` when a subscription is scheduled to cancel at the end of the current period (a pending cancellation), and `false` otherwise.
