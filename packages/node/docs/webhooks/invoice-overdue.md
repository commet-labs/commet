---
lastModified: 2026-06-12
title: "invoice.overdue"
description: "An outstanding invoice passed its due date without payment."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `invoiceId` (string) — The invoice ID.
- `invoiceNumber` (string) — The human-readable invoice number.
- `invoiceStatus` (string) — Always "outstanding" for this event.
- `periodStart` (string) — ISO 8601 start of the billing period.
- `periodEnd` (string) — ISO 8601 end of the billing period.
- `issueDate` (string) — ISO 8601 date the invoice was issued.
- `dueDate` (string) — ISO 8601 date the invoice was due — now in the past.
- `currency` (string) — The invoice currency code.
- `subtotal` (number) — Subtotal in cents (100 = $1.00).
- `total` (number) — Total in cents (100 = $1.00).
- `customerId` (string) — The customer ID. Returns your externalId if you provided one when creating the customer, otherwise returns the Commet publicId.
- `subscriptionId` (string | null) — The subscription ID, if the invoice is linked to a subscription.

```json
{
  "event": "invoice.overdue",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-07-31",
  "data": {
    "invoiceId": "inv_n4o5p6",
    "invoiceNumber": "INV-0043",
    "invoiceStatus": "outstanding",
    "periodStart": "2026-04-25T00:00:00.000Z",
    "periodEnd": "2026-05-25T00:00:00.000Z",
    "issueDate": "2026-04-25T00:00:00.000Z",
    "dueDate": "2026-04-25T00:00:00.000Z",
    "currency": "usd",
    "subtotal": 9900,
    "total": 9900,
    "customerId": "user_123",
    "subscriptionId": "sub_1a2b3c4d"
  }
}
```

## When this fires

A daily scan finds outstanding invoices whose `dueDate` is in the past and emits this event once per invoice. The idempotency key is derived from the invoice, so re-running the scan never sends a duplicate.

The invoice keeps its `"outstanding"` status — overdue is a fact about the due date, not a new status. If the invoice is later paid or voided, `payment.received` or `invoice.voided` reflects the outcome.

Use it to start your own dunning flow: email the customer, show an in-app banner, or flag the account for follow-up.
