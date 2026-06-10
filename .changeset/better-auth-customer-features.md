---
"@commet/better-auth": patch
---

The Commet feature endpoints now read the signed-in user's access through the new `featureAccess` resource:

- `GET /commet/features` uses `featureAccess.list({ customerId })`.
- `GET /commet/features/:code` uses `featureAccess.get({ customerId, code })`.
- `GET /commet/features/:code/check` and `GET /commet/features/:code/can-use` use `featureAccess.canUse({ customerId, code })`.

Behavior is unchanged: each endpoint still returns the user's feature access for their active subscription.
