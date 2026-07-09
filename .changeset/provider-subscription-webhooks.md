---
"@commet/node": minor
---

Add `provider` to the `subscription.activated` and `subscription.reactivated` webhook event payloads. `SubscriptionActivatedData.provider` is `PaymentProvider | null` (null when the subscription activated without a charge); `SubscriptionReactivatedData.provider` is always a `PaymentProvider`.
