---
lastModified: 2026-07-10
title: "subscription.activated"
description: "Fired when a subscription becomes active after payment"
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `subscriptionId` (string) — The subscription ID.
- `customerId` (string) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `status` (string) — Current status. One of: draft, pending\_payment, trialing, active, past\_due, canceled. Access is granted while trialing, active, or past\_due — past\_due is a permissive grace window during dunning, where you decide whether to keep serving the customer or block them.
- `currentPeriodStart` (string, optional) — ISO 8601 start of the current billing period.
- `currentPeriodEnd` (string, optional) — ISO 8601 end of the current billing period.
- `name` (string | null) — Optional custom name for the subscription.
- `invoiceId` (string) — The invoice ID for this payment.
- `invoiceNumber` (string) — The human-readable invoice number.
- `invoiceTotal` (number) — Invoice total in cents (100 = $1.00).
- `invoiceCurrency` (string) — The invoice currency code.
- `provider` ("stripe" | "commet" | "dlocal" | null) — The payment provider that processed the activating charge: stripe, commet, or dlocal. Null when the subscription activated without a charge (zero-total or setup-based activation).

```json
{
  "event": "subscription.activated",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-07-31",
  "data": {
    "subscriptionId": "sub_1a2b3c4d",
    "customerId": "user_123",
    "status": "active",
    "currentPeriodStart": "2026-03-25T00:00:00.000Z",
    "currentPeriodEnd": "2026-04-25T00:00:00.000Z",
    "name": "Acme Corp",
    "invoiceId": "inv_k1l2m3",
    "invoiceNumber": "INV-0042",
    "invoiceTotal": 9900,
    "invoiceCurrency": "usd",
    "provider": "stripe"
  }
}
```
