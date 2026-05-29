---
"@commet/node": patch
---

Align webhook types with the actual API response shape:

- `WebhookEndpoint.object` is now `"webhook"` (was incorrectly typed as `"webhook_endpoint"`, so equality checks never matched the real payload).
- `WebhookPayload` now includes `mode` (`"live" | "sandbox"`) and `apiVersion`, which Commet always sends on delivered events.
- `WebhookTestResult` now includes `deliveryId`, returned by the test endpoint so you can trace the delivery.
- Removed the phantom `WebhookData.id` field that the API never returns — use `subscriptionId` / `customerId` instead.
