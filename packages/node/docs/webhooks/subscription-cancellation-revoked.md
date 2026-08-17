---
lastModified: 2026-06-12
title: "subscription.cancellation_revoked"
description: "Fired when a scheduled cancellation is reverted before it executes. The subscription continues normally."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `subscriptionId` (string) — The subscription ID.
- `customerId` (string) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `status` (string) — Current status — typically "active". The scheduled cancellation no longer applies.
- `currentPeriodEnd` (string, optional) — ISO 8601 end of the current billing period, which continues normally.

```json
{
  "event": "subscription.cancellation_revoked",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-07-31",
  "data": {
    "subscriptionId": "sub_1a2b3c4d",
    "customerId": "user_123",
    "status": "active",
    "currentPeriodEnd": "2026-04-25T00:00:00.000Z"
  }
}
```

## When this fires

A customer (or your team, from the dashboard) reverts a cancellation that was scheduled for the end of the billing period. The scheduled cancel is removed and the subscription renews normally at `currentPeriodEnd`.

If your UI shows an "ending on" notice from `subscription.cancellation_scheduled`, remove it when you receive this event. `subscription.updated` also fires at this moment for backward compatibility.

This event never fires after `subscription.canceled` — once a cancellation has executed it cannot be reverted.
