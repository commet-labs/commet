---
lastModified: 2026-06-12
title: "customer.updated"
description: "Fired when a customer's details change. Carries the full current customer resource."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `id` (string) — The Commet customer ID (cus\_...).
- `externalId` (string | null) — Your own identifier for this customer, if you provided one.
- `fullName` (string | null) — The customer's full name.
- `email` (string) — The customer's email.
- `taxDocument` (string | null) — The customer's tax identification number, if provided.
- `documentType` (string | null) — The local tax document type label inferred from the customer's country (e.g. CUIT, RFC, RUT), or null when no tax document was provided.
- `timezone` (string | null) — The customer's timezone.
- `metadata` (object | null) — Custom key-value metadata you attached to the customer.
- `createdAt` (string) — ISO 8601 datetime when the customer was created.
- `updatedAt` (string) — ISO 8601 datetime of this update.

```json
{
  "event": "customer.updated",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-07-31",
  "data": {
    "id": "cus_1a2b3c4d",
    "externalId": "user_123",
    "fullName": "Ada Lovelace",
    "email": "ada.lovelace@acme.com",
    "taxDocument": "20-12345678-9",
    "documentType": "CUIT",
    "timezone": "Europe/London",
    "metadata": {
      "plan_intent": "pro"
    },
    "createdAt": "2026-03-25T14:29:00.000Z",
    "updatedAt": "2026-04-02T09:10:00.000Z"
  }
}
```

## What counts as an update

The event fires when a customer field changes: `email`, `fullName`, `timezone`, `externalId`, or `metadata`. It carries the complete current resource, not a diff — replace your local copy with the payload.

Every distinct update delivers its own event, even several in quick succession. Like `customer.created`, the resource shape follows your endpoint's pinned API version.
