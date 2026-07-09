---
"@commet/node": minor
---

Expose the payment provider on transactions and payment webhooks. `Transaction` now carries a `provider` field (`PaymentProvider`: `stripe` | `commet` | `dlocal`), and the `payment.received`, `payment.refunded`, `payment.disputed`, and `payment.dispute_resolved` webhook events include which provider routed the charge — useful for revenue attribution.
