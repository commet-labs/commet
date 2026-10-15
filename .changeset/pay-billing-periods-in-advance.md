---
"@commet/node": minor
"commet": minor
---

Support paying billing periods in advance: `subscriptions.createPrepaidPeriodsCheckout`, the `prepaidPeriods` and `cancelAtPeriodEnd` parameters of `subscriptions.create`, and the `prepayment`, `prepaid_period`, `google_pay` and `smartpix` enum values. The CLI adds `subscriptions create-prepaid-periods-checkout` and the `--prepaid-periods` and `--cancel-at-period-end` flags, and the bundled documentation includes Pay in Advance.
