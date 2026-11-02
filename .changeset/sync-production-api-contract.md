---
"@commet/node": minor
"commet": minor
---

Sync the Node SDK and CLI with the current API `2026-08-27` contract:

- `subscriptions.purchaseCredits` buys a chosen `quantity` of credits at the plan's price, besides a `creditPackId`.
- `subscriptions.getAutoTopUp` and `subscriptions.updateAutoTopUp` read and configure automatic credit purchases.
- `subscriptions.changePlan` and `subscriptions.previewChange` accept `promoCode`, as an alternative to `offerId`.
- `subscriptions.revokeScheduledPlanChange` keeps a subscription on its current plan by revoking the change scheduled for the end of the period.
- `customers.create` and `customers.createBatch` accept `planGroupId`, so a customer starts on that plan group's starting plan.
- `plans.create` and `plans.update` accept `unusedPlanCredits`, `planCreditLimit` and `isDefault`, and plan prices accept `trialRequiresPaymentMethod`.
- `promoCodes.create` and `promoCodes.update` accept `firstPurchaseOnly`.
- `subscriptions.create` accepts `customTrialDays` and `skipTrial` together with `offerId`.
- Responses add `hasPaymentMethod` on subscriptions, `managedBy` on Offers and promo codes, `firstPurchaseOnly` on promo codes, the unused plan credit and plan credit limit settings on plans, the plan credit limit window on usage checks and events, and `trialRequiresPaymentMethod` on plan prices.
- Creating or updating an Offer no longer accepts a `free_trial` phase, which the API already rejects; trials belong to plan prices.

The CLI adds `subscriptions get-auto-top-up`, `subscriptions update-auto-top-up` and `subscriptions revoke-scheduled-plan-change`, and the matching flags such as `--quantity`, `--promo-code`, `--plan-group-id`, `--first-purchase-only` and `--trial-requires-payment-method`. The bundled documentation and webhook descriptions match the current contract.
