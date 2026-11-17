---
"@commet/node": minor
"commet": minor
---

Sync the Node SDK and the CLI with the current API `2026-08-27` contract:

- Plans can give unlimited plan credits or plan balance. `plans.create` and `plans.update` accept `unlimitedPlanCredits` and `unlimitedPlanBalance`, draft rules accept them too, and plans return them. Subscriptions, usage checks, usage events and feature access return `unlimited`, and omit the plan and total amounts when it is true.
- Credit purchases, balance top-ups and add-on activations return a `status`: `processing` when the payment method confirms later, and the credits, balance or add-on arrive once it is confirmed.
- Transactions return `amountRefunded`, and `transactions.refund` accepts `amount` for a partial refund.
- A version move can charge a subscriber in USD: `subscriptions.changeVersion`, `plans.createMove`, `plans.publishDraft` and `plans.archiveExperiment` accept `currency`, and the scheduled version change returns it. New errors `currency_held_by_payment_method`, `currency_held_by_customer_credit`, `currency_held_by_balance_plan`, `currency_held_by_fixed_amount_discount`, `currency_held_by_prepaid_period` and `currency_held_by_scheduled_pause`.
- `customers.createBatch` accepts `businessTaxId` for each customer.
- `invoices.updateStatus` is deprecated and no longer takes a status: the API no longer changes the invoice, which is paid when its charge settles.

The CLI adds the matching flags, such as `--unlimited-plan-credits`, `--unlimited-plan-balance` and `--amount` on `commet transactions refund`. The bundled documentation matches the current contract.
