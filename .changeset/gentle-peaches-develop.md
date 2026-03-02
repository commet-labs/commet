---
"@commet/node": patch
---

Align subscription response types with free-plan activation flows.

- Add optional `isFreePlan` to `Subscription` responses.
- Make `checkoutUrl` nullable in `Subscription` and `ActiveSubscription`.
- Document subscription creation handling when checkout is not required.
