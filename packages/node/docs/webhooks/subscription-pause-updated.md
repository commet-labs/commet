---
lastModified: 2026-08-27
title: "subscription.pause_updated"
description: "A scheduled or active pause duration changed."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `subscriptionId` (string) — The paused subscription ID.
- `customerId` (string) — The customer ID for the paused subscription.
- `status` ("active" | "trialing" | "paused") — Current subscription status.
- `effectiveAt` (string) — When the pause becomes or became effective.
- `resumeAt` (string | null) — When automatic resume is scheduled, or null when indefinite.

```json
{
  "event": "subscription.pause_updated",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-10-04",
  "data": {
    "subscriptionId": "sub_1a2b3c4d",
    "customerId": "user_123",
    "status": "active",
    "effectiveAt": "2026-09-01T00:00:00.000Z",
    "resumeAt": null
  }
}
```
