---
"@commet/node": minor
"commet": minor
---

Refund part of a payment:

- `transactions.refund` accepts an optional `amount`, a positive integer in the payment currency's smallest unit. Without it, it refunds what remains.
- Transactions and the `payment.refunded` webhook payload return `amountRefunded`, the cumulative confirmed refunds in the payment currency's smallest unit.

`commet transactions refund` adds `--amount`.
