---
lastModified: 2026-07-16
title: "subscription.canceled"
description: "Fired when a subscription is terminated, at period end or immediately. Revoke access here."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `subscriptionId` (string) — The subscription ID.
- `customerId` (string) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `status` (string) — Always "canceled" for this event. Revoke access when you receive this.
- `canceledAt` (string, optional) — ISO 8601 datetime when the cancellation was requested or triggered.
- `cancelReason` (string | null) — The reason for cancellation, if provided. Set by Commet on system-initiated terminations: "refund" (full refund of a subscription invoice) or "dunning\_exhausted" (all payment retries failed).
- `endDate` (string, optional) — ISO 8601 datetime when the subscription ended. Matches the billing period end for scheduled cancellations; for immediate terminations it is the moment of termination.

```json
{
  "event": "subscription.canceled",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-07-31",
  "data": {
    "subscriptionId": "sub_1a2b3c4d",
    "customerId": "user_123",
    "status": "canceled",
    "canceledAt": "2026-04-20T10:15:00.000Z",
    "cancelReason": "Too expensive",
    "endDate": "2026-04-25T00:00:00.000Z"
  }
}
```

## Cancellation lifecycle

A regular cancellation is scheduled for the end of the current billing period. Two events fire at different moments:

| Moment                         | Event                   | status     | What to do                                                   |
| ------------------------------ | ----------------------- | ---------- | ------------------------------------------------------------ |
| Customer requests cancellation | `subscription.updated`  | `active`   | Show "ending on {endDate}" in your UI. Do NOT revoke access. |
| Billing period ends            | `subscription.canceled` | `canceled` | Revoke access.                                               |

```
POST /subscriptions/{id}/cancel
  └→ subscription.updated  (status: "active", canceledAt: set, endDate: set)
       ... time passes until billing period ends ...
  └→ subscription.canceled (status: "canceled")
```

## Immediate terminations

Some terminations skip the schedule: `subscription.canceled` arrives right away, with no prior `subscription.updated`, and `endDate` is the moment of termination — not a billing period boundary.

- `POST /subscriptions/{id}/cancel` with `immediate: true`. Cancellations of free plans and of subscriptions in `pending_payment` or `past_due` also settle immediately — canceling inside the dunning grace window voids the unpaid renewal.
- A full refund of a subscription invoice: fires with `cancelReason: "refund"`, alongside `payment.refunded`.
- Exhausted dunning retries: fires with `cancelReason: "dunning_exhausted"`, alongside `payment.retry_failed`.
