---
lastModified: 2026-08-27
title: "subscription.resumed"
description: "A paused subscription restored access."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `subscriptionId` (string) — The paused subscription ID.
- `customerId` (string) — The customer ID for the paused subscription.
- `status` ("active" | "trialing") — The restored subscription status.
- `mode` ("immediate" | "period\_end") — The completed pause mode.
- `resumedAt` (string) — When access was restored.
- `invoiceId` (string | null) — The resume invoice ID, or null when no charge was required.

```json
{
  "event": "subscription.resumed",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-10-04",
  "data": {
    "subscriptionId": "sub_1a2b3c4d",
    "customerId": "user_123",
    "status": "active",
    "mode": "period_end",
    "resumedAt": "2026-09-15T12:30:00.000Z",
    "invoiceId": "inv_q7r8s9"
  }
}
```

Restore access only after this event.
