---
lastModified: 2026-07-06
title: "payment.retry_failed"
description: "All dunning retries were exhausted; the subscription was canceled."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `invoiceId` (string) — The invoice whose retries were exhausted.
- `invoiceNumber` (string) — The human-readable invoice number.
- `customerId` (string) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `subscriptionId` (string) — The subscription ID.
- `provider` ("stripe" | "commet" | "dlocal") — The payment provider the charge was routed to: stripe, commet, or dlocal.
- `reason` (string) — Terminal dunning reason, usually the last processor decline code or "dunning\_exhausted".

```json
{
  "event": "payment.retry_failed",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-07-31",
  "data": {
    "invoiceId": "inv_n4o5p6",
    "invoiceNumber": "INV-0043",
    "customerId": "user_123",
    "subscriptionId": "sub_1a2b3c4d",
    "provider": "stripe",
    "reason": "card_declined"
  }
}
```

## When this fires

After a payment failure puts a subscription in `past_due`, Commet retries the outstanding invoice on the dunning schedule. When the final retry fails, the invoice is marked uncollectible and the subscription is canceled — this event marks that terminal outcome.

It is the end of the dunning flow: `payment.recovered` will not follow, and `subscription.canceled` fires alongside it. Revoke access when you receive this event.
