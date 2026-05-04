---
"@commet/node": minor
---

`commet.subscriptions.get(...)` now exposes scheduled cancellation and discount state.

`ActiveSubscription` adds two optional nested objects:

- `cancellation: { scheduledAt, reason, effectiveAt } | null` — populated when a cancellation has been requested but the period has not yet ended. `effectiveAt` is when the subscription will actually finish (= current period end).
- `discount: { type, value, name, endsAt } | null` — populated when the subscription has an applied discount (promo code, intro offer, etc.).

Both fields are additive — existing consumers keep working untouched.

```ts
const sub = await commet.subscriptions.get("user_123");
if (sub?.cancellation) {
  // sub will end on sub.cancellation.effectiveAt
}
```
