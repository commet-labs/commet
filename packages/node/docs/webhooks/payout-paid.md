---
lastModified: 2026-06-12
title: "payout.paid"
description: "A payout landed in your bank account."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `payoutId` (string) — The payout ID.
- `amount` (number) — Gross payout amount in cents (100 = $1.00).
- `fee` (number) — Provider transfer fee in cents.
- `netAmount` (number) — What reached your bank in cents (amount minus fee).
- `currency` (string) — The payout currency. Always "usd".
- `status` (string) — Always "paid" for this event.
- `destinationBank` (WebhookBankRef | null) — Destination bank display metadata: bankName and last4.
- `paidAt` (string | null) — ISO 8601 datetime when the provider confirmed the deposit arrived.

```json
{
  "event": "payout.paid",
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
    "status": "paid",
    "destinationBank": {
      "bankName": "CHASE",
      "last4": "6789"
    },
    "paidAt": "2026-06-14T09:00:00.000Z"
  }
}
```

## When this fires

When the bank settlement of a payout completes — the moment the money actually reaches your bank account, confirmed by the payment provider. This is the terminal success state of the payout lifecycle started by `payout.created`.

`paidAt` is the provider-confirmed arrival time. Fires exactly once per payout.

Use it to reconcile bank deposits against the payouts that produced them.
