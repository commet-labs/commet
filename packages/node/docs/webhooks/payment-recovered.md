---
lastModified: 2026-06-12
title: "payment.recovered"
description: "A previously failed payment was recovered."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `invoiceId` (string) — The recovered invoice ID.
- `invoiceNumber` (string) — The human-readable invoice number.
- `invoiceTotal` (number) — Invoice total in cents (100 = $1.00).
- `customerId` (string) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `subscriptionId` (string | null) — The subscription ID, if the invoice is linked to a subscription.
- `provider` ("stripe" | "commet" | "dlocal" | null) — The payment provider that recovered the payment, or null when the invoice was recovered without a processor charge.

```json
{
  "event": "payment.recovered",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-07-31",
  "data": {
    "invoiceId": "inv_n4o5p6",
    "invoiceNumber": "INV-0043",
    "invoiceTotal": 9900,
    "customerId": "user_123",
    "subscriptionId": "sub_1a2b3c4d",
    "provider": "stripe"
  }
}
```

## When this fires

After a payment failure put a subscription in `past_due`, a successful retry of the outstanding invoice fires this event — whether the charge succeeded automatically or the customer paid through the portal after updating their card.

The subscription returns to `active` at the same time, so `customer.state_changed` also fires. Restore access on either event; use this one specifically to close dunning flows you opened on `payment.failed`.
