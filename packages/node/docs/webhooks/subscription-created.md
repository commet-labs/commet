---
lastModified: 2026-03-28
title: "subscription.created"
description: "Fired when a new subscription is created"
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `subscriptionId` (string) — The subscription ID.
- `customerId` (string) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `planId` (string) — The plan ID.
- `planName` (string) — The plan name.
- `status` (string) — Current status. One of: draft, pending\_payment, trialing, active, past\_due, canceled. Access is granted while trialing, active, or past\_due — past\_due is a permissive grace window during dunning, where you decide whether to keep serving the customer or block them.
- `startDate` (string) — ISO 8601 datetime when the subscription starts.
- `name` (string | null) — Optional custom name for the subscription.

```json
{
  "event": "subscription.created",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-07-31",
  "data": {
    "subscriptionId": "sub_1a2b3c4d",
    "customerId": "user_123",
    "planId": "pln_pro_monthly",
    "planName": "Pro",
    "status": "pending_payment",
    "startDate": "2026-03-25T14:30:00.000Z",
    "name": "Acme Corp"
  }
}
```
