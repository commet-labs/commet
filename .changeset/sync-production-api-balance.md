---
"@commet/node": minor
"commet": minor
"@commet/next": minor
---

Sync the Node SDK, the CLI and the Next.js webhooks with the current API `2026-08-27` contract:

- Subscriptions on a balance plan split their balance in two parts: `balance.plan` (spent first, replaced or rolled over at each reset) and `balance.purchased` (top-ups and manual adjustments, kept until the subscription ends), with `balance.total`. Credits subscriptions add `credits.plan` and `credits.total`. `remaining` keeps its meaning.
- `plans.create` and `plans.update` accept `unusedPlanBalance` (expire or roll over up to `maxPlanBalance`) and `planBalanceLimit` (the most plan balance spent per day or week), and `plans.update` accepts `blockOnExhaustion` to turn overage on or off. Plan responses include both settings.
- `subscriptions.updateAutoTopUp` accepts `amount` for balance plans, and `subscriptions.getAutoTopUp` returns it, so balance subscriptions top up automatically; the `amount_below_minimum` failure reason is new.
- Usage checks, usage events and `customer.state_changed` add the plan balance limit window and the `planBalance`, `purchasedBalance` and `totalBalance` parts.
- New webhook events `balance.granted`, `balance.expired` and `payment_method.detached`.
- `customers.create` and `customers.update` accept `businessTaxId`, and customers return it.
- `subscriptions.create` accepts `paymentMethodTypes` to limit the payment methods its initial checkout offers.

The CLI adds the matching flags, such as `--unused-plan-balance`, `--plan-balance-limit`, `--block-on-exhaustion`, `--amount`, `--business-tax-id` and `--payment-method-types`. `@commet/next` adds the `onBalanceGranted`, `onBalanceExpired` and `onPaymentMethodDetached` handlers. The bundled documentation and webhook descriptions match the current contract.
