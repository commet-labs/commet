---
lastModified: 2026-06-12
title: "invoice.upcoming"
description: "Predictive event fired once, 3 days before a subscription renews."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `subscriptionId` (string) — The subscription ID.
- `customerId` (string) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `status` (string) — Always "active" for this event.
- `planId` (string) — The plan ID.
- `planName` (string) — The plan name.
- `billingInterval` (string | null) — The billing interval (monthly, yearly).
- `currentPeriodEnd` (string) — ISO 8601 datetime when the current period ends and the renewal invoice is issued.

```json
{
  "event": "invoice.upcoming",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-07-31",
  "data": {
    "subscriptionId": "sub_1a2b3c4d",
    "customerId": "user_123",
    "status": "active",
    "planId": "pln_pro_monthly",
    "planName": "Pro",
    "billingInterval": "monthly",
    "currentPeriodEnd": "2026-04-25T00:00:00.000Z"
  }
}
```

## When this fires

A daily scan finds active subscriptions renewing within the next 3 days and emits this event once per renewal. The idempotency key is derived from the subscription and the renewal date, so re-running the scan never sends a duplicate.

Subscriptions with a scheduled cancellation are excluded — no renewal invoice will be issued for them.

Use it to notify the customer before they are charged. The payload intentionally carries no amount: usage-based charges are only final at renewal time, when `invoice.created` delivers the actual invoice.
