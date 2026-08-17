---
lastModified: 2026-06-12
title: "subscription.cancellation_scheduled"
description: "Fired when a cancellation is scheduled for the end of the billing period. Do NOT revoke access yet."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `subscriptionId` (string) — The subscription ID.
- `customerId` (string) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `status` (string) — Still "active" — the subscription remains usable until effectiveAt.
- `canceledAt` (string, optional) — ISO 8601 datetime when the cancellation was requested.
- `cancelReason` (string | null) — The reason for cancellation, if provided.
- `effectiveAt` (string) — ISO 8601 datetime when the cancellation will execute (the billing period end). subscription.canceled fires at this moment.

```json
{
  "event": "subscription.cancellation_scheduled",
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
    "effectiveAt": "2026-04-25T00:00:00.000Z"
  }
}
```

## Cancellation lifecycle

This event marks the start of the cancellation lifecycle. The subscription stays fully usable until `effectiveAt`:

| Moment                            | Event                                 | status     | What to do                                                       |
| --------------------------------- | ------------------------------------- | ---------- | ---------------------------------------------------------------- |
| Customer requests cancellation    | `subscription.cancellation_scheduled` | `active`   | Show "ending on {effectiveAt}" in your UI. Do NOT revoke access. |
| Customer reverts the cancellation | `subscription.cancellation_revoked`   | `active`   | Remove the "ending on" notice.                                   |
| Billing period ends               | `subscription.canceled`               | `canceled` | Revoke access.                                                   |

`subscription.updated` also fires at the scheduling moment for backward compatibility — if you already handle the scheduled-cancel state through `subscription.updated`, you can keep doing so. This event carries the same intent with an explicit name and the exact `effectiveAt`.
