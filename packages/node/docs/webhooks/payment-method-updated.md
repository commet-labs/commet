---
lastModified: 2026-09-24
title: "payment_method.updated"
description: "A customer's default payment method was replaced."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `customerId` (string) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `paymentMethod` (PaymentMethod | null) — The payment method: card, oxxo, or mercado\_pago. Null when unknown.
- `card` (WebhookCardInfo | null) — Card display metadata for the new method: brand, last4, expMonth, expYear. Null when the method is not a card or its details cannot be retrieved.

```json
{
  "event": "payment_method.updated",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-10-04",
  "data": {
    "customerId": "user_123",
    "paymentMethod": "mercado_pago",
    "card": null
  }
}
```

## When this fires

Fired when a customer replaces their default payment method through the customer portal. The new method applies to all of the customer's subscriptions.

The `card` object carries display metadata only — brand, last 4 digits, and expiration. Full card numbers never leave the payment provider. When the new method is not a card or its details cannot be retrieved, `card` is `null`.

`paymentMethod` identifies the newly saved instrument (`card` or `mercado_pago`; OXXO never leaves a saved instrument). It does not describe which method paid an earlier transaction.

Use it to refresh the card shown in your billing UI. A payment method update is also a strong recovery signal for past-due subscriptions — the customer typically updates their card to fix a failed payment.
