---
lastModified: 2026-06-12
title: "seats.updated"
description: "A customer's seat count changed."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `customerId` (string) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `subscriptionId` (string | null) — The live subscription ID, or null when the customer has no live subscription.
- `featureCode` (string) — The seats feature code.
- `previousSeats` (number) — The seat count before the change.
- `currentSeats` (number) — The seat count after the change.

```json
{
  "event": "seats.updated",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-07-31",
  "data": {
    "customerId": "user_123",
    "subscriptionId": "sub_1a2b3c4d",
    "featureCode": "editors",
    "previousSeats": 3,
    "currentSeats": 5
  }
}
```

## When this fires

Every seat mutation fires it: the SDK seat endpoints (add, set, remove, bulk) and manual seat events created from the dashboard. The payload carries the previous and the new absolute count for the feature.

`customer.state_changed` fires alongside it with trigger `seats_updated`, carrying the full entitlement state including the seats summary.

Use it to keep your own member-management UI in sync with billed seats.
