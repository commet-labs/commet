---
lastModified: 2026-06-12
title: "payment_method.attached"
description: "A payment method was saved for a customer's subscription."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `subscriptionId` (string) — The subscription the payment method was saved for.
- `customerId` (string) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `card` (WebhookCardInfo | null) — Card display metadata: brand, last4, expMonth, expYear. Null when the method is not a card or its details cannot be retrieved.

```json
{
  "event": "payment_method.attached",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-07-31",
  "data": {
    "subscriptionId": "sub_1a2b3c4d",
    "customerId": "user_123",
    "card": {
      "brand": "visa",
      "last4": "4242",
      "expMonth": 12,
      "expYear": 2030
    }
  }
}
```

## When this fires

Fired when Commet records a payment method for a subscription: after a paid checkout, when a trial starts with a card on file, or when a zero-total checkout completes with a saved payment method.

The `card` object carries display metadata only — brand, last 4 digits, and expiration. Full card numbers never leave the payment provider. When the saved method is not a card or its details cannot be retrieved, `card` is `null`.

Use it to show the saved card in your own billing UI or confirm to the customer that their payment method is on file.
