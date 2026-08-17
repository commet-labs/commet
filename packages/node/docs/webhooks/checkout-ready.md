---
lastModified: 2026-06-12
title: "checkout.ready"
description: "A checkout link is ready to share with the customer."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `subscriptionId` (string) — The subscription ID.
- `customerId` (string) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `invoiceId` (string) — The invoice this checkout collects.
- `invoiceNumber` (string) — The human-readable invoice number.
- `invoiceTotal` (number) — Invoice total in cents (100 = $1.00).
- `invoiceCurrency` (string) — The invoice currency code.
- `checkoutUrl` (string) — The hosted checkout URL to share with the customer.

```json
{
  "event": "checkout.ready",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-07-31",
  "data": {
    "subscriptionId": "sub_1a2b3c4d",
    "customerId": "user_123",
    "invoiceId": "inv_k1l2m3",
    "invoiceNumber": "INV-0042",
    "invoiceTotal": 9900,
    "invoiceCurrency": "usd",
    "checkoutUrl": "https://pay.commet.co/checkout/tok_9f8e7d6c"
  }
}
```

## When this fires

When a subscription is created without a payment method on file, Commet generates a hosted checkout link for the first invoice and fires this event as soon as the link is ready. Commet also emails the link to the customer — this webhook lets you deliver it through your own channels (in-app banner, chat, SMS) instead of relying on email alone.

The link stays valid until the invoice is paid or voided. Trials with their own checkout flow fire `trial.checkout_ready` instead.

Use the `checkoutUrl` to put the payment link in front of the customer wherever they already are.
