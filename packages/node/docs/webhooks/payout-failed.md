---
lastModified: 2026-06-12
title: "payout.failed"
description: "A payout to your bank account failed."
full: true
---

All webhook payloads follow a consistent top-level structure with event-specific data nested within the `data` object.

- `payoutId` (string) — The payout ID.
- `amount` (number) — Gross payout amount in cents (100 = $1.00).
- `fee` (number) — Provider transfer fee in cents.
- `netAmount` (number) — What would have reached your bank in cents.
- `currency` (string) — The payout currency. Always "usd".
- `status` (string) — Always "failed" for this event.
- `destinationBank` (WebhookBankRef | null) — Destination bank display metadata: bankName and last4.
- `failedAt` (string | null) — ISO 8601 datetime when the failure was recorded.
- `failureCode` (string | null) — The provider's failure code, when available.
- `failureMessage` (string | null) — A human-readable failure message, when available.

```json
{
  "event": "payout.failed",
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
    "status": "failed",
    "destinationBank": {
      "bankName": "CHASE",
      "last4": "6789"
    },
    "failedAt": "2026-06-14T09:00:00.000Z",
    "failureCode": "account_closed",
    "failureMessage": "The bank account has been closed"
  }
}
```

## When this fires

When the provider reports that a payout could not be completed — at either leg of the lifecycle, most commonly when the bank rejects the deposit (closed account, invalid details). The funds return to your available balance.

`failureCode` and `failureMessage` carry the provider's reason when available.

Use it to alert your finance contact and to fix the bank account before requesting the payout again.
