---
"@commet/node": minor
---

Expose `subPaymentMethod` on transactions and payment outcome webhooks: the source of funds the provider reported for that charge (`credit_card`, `debit_card`, `prepaid_card`, `bank_transfer`, `account_money`), or `null` when unavailable. This additive field is available on the existing API version.
