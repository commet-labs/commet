---
"@commet/node": minor
---

Add a typed catalog of all 56 subscribable webhook events. `webhooks.on(event, handler)` and `webhooks.process()` now deliver fully typed, per-event payload data (including nested fields), and every event name and `*Data` type is exported. `verifyAndParse()` keeps returning the wide `WebhookPayload` (no breaking change) — narrow it yourself, or use `on()` for automatic typing (Stripe-style).
