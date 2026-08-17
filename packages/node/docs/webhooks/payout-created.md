---
lastModified: 2026-06-12
title: "payout.created"
description: "A payout to your bank account was initiated."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `payoutId` (string) — The payout ID.
- `amount` (number) — Gross payout amount in cents (100 = $1.00).
- `fee` (number) — Provider transfer fee in cents.
- `netAmount` (number) — What reaches your bank in cents (amount minus fee).
- `currency` (string) — The payout currency. Always "usd".
- `status` (string) — The payout status. "pending" at creation.
- `destinationBank` (WebhookBankRef | null) — Destination bank display metadata: bankName and last4. Full account numbers never appear in webhook payloads.
- `createdAt` (string) — ISO 8601 datetime when the payout was created.

```json
{
  "event": "payout.created",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-07-31",
  "data": {
    "payoutId": "8b6f2a1c-4d3e-4f5a-9b8c-7d6e5f4a3b2c",
    "amount": 20000,
    "fee": 0,
    "netAmount": 20000,
    "currency": "usd",
    "status": "pending",
    "destinationBank": {
      "bankName": "CHASE",
      "last4": "6789"
    },
    "createdAt": "2026-06-12T10:00:00.000Z"
  }
}
```

## When this fires

When a payout of your available balance is requested and the transfer toward your bank is initiated. The payout starts in `pending` and moves through the transfer and bank settlement legs from there.

`destinationBank` carries display metadata only (bank name and last4); full account numbers never appear in webhook payloads.

The lifecycle continues with `payout.paid` when the money lands, or `payout.failed` if the bank rejects it.
