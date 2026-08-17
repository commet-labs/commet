---
lastModified: 2026-07-10
title: "payment_link.canceled"
description: "A payment link was canceled before being paid."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `paymentId` (string) — The payment link ID.
- `status` (string) — The link status. Always "canceled" for this event.
- `amount` (number) — The total amount of the canceled link in cents (100 = $1.00).
- `currency` (string) — The payment currency code.
- `description` (string) — The payment description shown to the customer.
- `customerId` (string | null) — The customer ID, or null when the link is not tied to a customer. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.

```json
{
  "event": "payment_link.canceled",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-07-31",
  "data": {
    "paymentId": "pay_l1m2n3",
    "status": "canceled",
    "amount": 5000,
    "currency": "usd",
    "description": "One-time onboarding fee",
    "customerId": "user_123"
  }
}
```

## When this fires

When a pending [payment link](/docs/accept-one-time-payments) is canceled before the customer pays it. A canceled link can no longer be paid.

Payment links never expire on their own — there is no expiry event. A link stays payable until it is paid or explicitly canceled.

The event fires the same way regardless of which payment provider processes the charge.
