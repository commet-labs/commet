---
lastModified: 2026-06-12
title: "seats.limit_reached"
description: "A seat change reached the plan's included seat limit."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `customerId` (string) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `subscriptionId` (string) — The subscription ID.
- `featureCode` (string) — The seats feature code.
- `currentSeats` (number) — The seat count after the change.
- `includedSeats` (number) — The included seat limit of the plan.

```json
{
  "event": "seats.limit_reached",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-07-31",
  "data": {
    "customerId": "user_123",
    "subscriptionId": "sub_1a2b3c4d",
    "featureCode": "editors",
    "currentSeats": 5,
    "includedSeats": 5
  }
}
```

## When this fires

When a seat change moves the count from below the plan's included seat limit to at or above it. It fires once per crossing — removing seats and re-adding past the limit fires it again. Plans with unlimited seats never fire it.

Seats are not blocked at the limit: counts above the included amount are allowed and billed as overage when the plan enables it.

Use it to prompt an upgrade to a higher tier before overage kicks in.
