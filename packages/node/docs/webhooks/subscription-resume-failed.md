---
lastModified: 2026-08-27
title: "subscription.resume_failed"
description: "A period-end resume charge failed."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `subscriptionId` (string) — The paused subscription ID.
- `customerId` (string) — The customer ID for the paused subscription.
- `status` ("paused") — The unchanged subscription status.
- `invoiceId` (string) — The outstanding resume invoice ID.
- `failedAt` (string) — When the resume charge failed.

```json
{
  "event": "subscription.resume_failed",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-08-27",
  "data": {
    "subscriptionId": "sub_1a2b3c4d",
    "customerId": "user_123",
    "status": "paused",
    "invoiceId": "inv_q7r8s9",
    "failedAt": "2026-09-15T12:30:00.000Z"
  }
}
```

The subscription remains paused and without access.
