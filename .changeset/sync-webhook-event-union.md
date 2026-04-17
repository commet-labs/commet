---
"@commet/node": patch
"@commet/better-auth": patch
---

Sync webhook event types with the platform.

- `@commet/node`: expand `WebhookEvent` union to include all 8 events emitted by the platform (`subscription.plan_changed`, `payment.received`, `payment.failed`, `invoice.created`). Type `WebhookData.status` as `SubscriptionStatus` so consumers get autocomplete and exhaustiveness on status switches. Grant access only when status is `"active"` or `"trialing"`; `"pending_payment"` means the first charge has not been confirmed yet — wait for `subscription.activated`.
- `@commet/better-auth`: relax the internal `EVENT_HANDLER_MAP` to `Partial<Record<WebhookEvent, ...>>` since the plugin only exposes handlers for `subscription.*` events; other events fall through to `onPayload`.
