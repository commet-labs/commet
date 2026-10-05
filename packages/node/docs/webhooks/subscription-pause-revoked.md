---
lastModified: 2026-08-27
title: "subscription.pause_revoked"
description: "A scheduled pause was revoked before taking effect."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `subscriptionId` (string) — The paused subscription ID.
- `customerId` (string) — The customer ID for the paused subscription.
- `status` ("active" | "trialing") — Current subscription status.

```json
{
  "event": "subscription.pause_revoked",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-10-04",
  "data": {
    "subscriptionId": "sub_1a2b3c4d",
    "customerId": "user_123",
    "status": "active"
  }
}
```
