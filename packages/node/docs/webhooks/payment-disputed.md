---
lastModified: 2026-07-10
title: "payment.disputed"
description: "A customer opened a dispute against a payment."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `paymentTransactionId` (string) — The disputed payment transaction ID.
- `provider` ("stripe" | "commet" | "dlocal") — The payment provider the charge was routed to: stripe, commet, or dlocal.
- `paymentLinkId` (string | null) — The payment link the payment originated from, or null when the payment did not come from a payment link.
- `invoiceId` (string | null) — The invoice the payment collected, or null for payments without an invoice.
- `invoiceNumber` (string | null) — The human-readable invoice number, if available.
- `customerId` (string | null) — The customer ID, when the payment is linked to an invoice. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `subscriptionId` (string | null) — The subscription ID, if the invoice is linked to a subscription.
- `disputeAmount` (number) — The contested amount in cents (100 = $1.00).
- `currency` (string) — The dispute currency code.
- `disputeReason` (string | null) — The provider's reason code (e.g. fraudulent, product\_not\_received), or null when none is given.

```json
{
  "event": "payment.disputed",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-07-31",
  "data": {
    "paymentTransactionId": "txn_q7r8s9",
    "provider": "stripe",
    "paymentLinkId": null,
    "invoiceId": "inv_n4o5p6",
    "invoiceNumber": "INV-0043",
    "customerId": "user_123",
    "subscriptionId": "sub_1a2b3c4d",
    "disputeAmount": 9900,
    "currency": "usd",
    "disputeReason": "fraudulent"
  }
}
```

## When this fires

When the cardholder's bank notifies the payment provider that a charge is being disputed (a chargeback). The disputed amount is frozen from your payout balance while the dispute is open. As the Merchant of Record, Commet handles the evidence and resolution process with the provider.

`disputeAmount` is the contested amount in cents; `disputeReason` is the provider's reason code (for example `fraudulent` or `product_not_received`), or `null` when the provider gives none.

The resolution fires `payment.dispute_resolved` with the outcome. Use this event to flag the account internally — repeated disputes are a strong fraud signal.
