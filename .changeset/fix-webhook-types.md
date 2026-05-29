---
"@commet/node": minor
---

Webhook types and per-endpoint API versioning:

- `WebhookEndpoint.object` is now `"webhook"` (was incorrectly typed as `"webhook_endpoint"`, so equality checks never matched the real payload).
- `WebhookPayload` now includes `mode` (`"live" | "sandbox"`) and `apiVersion`, which Commet always sends on delivered events.
- `WebhookTestResult` now includes `deliveryId`, returned by the test endpoint so you can trace the delivery.
- Removed the phantom `WebhookData.id` field that the API never returns — use `subscriptionId` / `customerId` instead.
- `webhooks.create` accepts an optional `apiVersion` to pin the endpoint to a specific API version. When omitted, the endpoint inherits the version of the request that creates it (i.e. the SDK's version), so the payloads you receive match the types you parse with.
- `WebhookEndpoint` now exposes `apiVersion` (the version the endpoint is pinned to).
- Added `webhooks.update(...)` for the new `PUT /webhooks/{id}` endpoint.
