---
lastModified: 2026-06-12
title: "customer.created"
description: "Fired when a customer is created. The payload mirrors the customer resource from GET /customers."
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
- `updatedAt` (string) — ISO 8601 datetime of the last update.

```json
{
  "event": "customer.created",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-07-31",
  "data": {
    "id": "cus_1a2b3c4d",
    "externalId": "user_123",
    "fullName": "Ada Lovelace",
    "email": "ada@acme.com",
    "taxDocument": "20-12345678-9",
    "documentType": "CUIT",
    "timezone": "UTC",
    "metadata": {
      "plan_intent": "pro"
    },
    "createdAt": "2026-03-25T14:29:00.000Z",
    "updatedAt": "2026-03-25T14:29:00.000Z"
  }
}
```

## Resource shape and version pinning

The payload is the customer resource exactly as the REST API returns it for your pinned API version. If your endpoint is pinned to a version before `2026-06-07`, the `email` field arrives as `billingEmail` — the same downgrade applied to `GET /customers` responses.

The event fires for every creation path: `POST /customers`, batch create, the SDKs, and the dashboard. Creating a customer with an `externalId` that already exists returns the existing customer and does NOT fire this event again.
