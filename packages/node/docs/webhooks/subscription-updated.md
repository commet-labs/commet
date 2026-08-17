---
lastModified: 2026-05-12
title: "subscription.updated"
description: "Fired when subscription details change, including when a cancellation is scheduled."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `subscriptionId` (string) — The subscription ID.
- `customerId` (string) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `status` (string) — Current status. When cancellation is scheduled, this is still "active" — the subscription remains usable until endDate.
- `canceledAt` (string, optional) — ISO 8601 datetime when cancellation was requested. Present when cancellation is scheduled, null otherwise.
- `cancelReason` (string | null) — The reason for cancellation, if provided.
- `endDate` (string, optional) — ISO 8601 datetime when the subscription will end. Present when cancellation is scheduled — this is the date access should be revoked (via subscription.canceled).

```json
{
  "event": "subscription.updated",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-07-31",
  "data": {
    "subscriptionId": "sub_1a2b3c4d",
    "customerId": "user_123",
    "status": "active",
    "canceledAt": "2026-04-20T10:15:00.000Z",
    "cancelReason": "Too expensive",
    "endDate": "2026-04-25T00:00:00.000Z"
  }
}
```

## Detecting scheduled cancellation

When a customer cancels, `subscription.updated` fires with `status: "active"` but `canceledAt` and `endDate` set. This tells you the subscription is still usable but ending soon. Show a notice like "your subscription will end on {endDate}" in your UI.

Access should only be revoked when you receive `subscription.canceled` (status: `"canceled"`).
