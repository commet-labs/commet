---
lastModified: 2026-07-10
title: "payment.failed"
description: "Fired when a recurring charge fails"
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `invoiceId` (string) — The invoice ID, if available.
- `invoiceNumber` (string) — The human-readable invoice number, if available.
- `customerId` (string) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `subscriptionId` (string | null) — The subscription ID, if the invoice is linked to a subscription.
- `provider` ("stripe" | "commet" | "dlocal") — The payment provider the charge was routed to: stripe, commet, or dlocal.
- `failureCode` (string) — The failure code from the payment processor.
- `failureMessage` (string) — A human-readable failure message.
- `recoveryUrl` (string | null) — A ready-to-use link the customer can follow to retry this payment, or null when no recovery path applies. For a first failed charge (pending\_payment) it is the checkout URL; for a failed renewal (past\_due) it is a signed recovery link — no separate createRecoveryLink call needed.

```json
{
  "event": "payment.failed",
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
    "failureCode": "card_declined",
    "failureMessage": "Your card was declined.",
    "recoveryUrl": "https://pay.commet.co/recover/tok_9f8e7d6c"
  }
}
```
