---
"@commet/node": minor
"commet": minor
---

Sync the Node SDK and the CLI with the current API `2026-08-27` contract:

- `subscriptions.purchaseCredits`, `subscriptions.topupBalance` and `subscriptions.activateAddon` accept `successUrl`. When the subscription has no saved payment method, they return the status `requires_checkout` with a `checkoutUrl` where the customer pays and saves the method in one step.
- `subscriptions.changePlan` can return the outcome `processing` while its charge is being confirmed.
- Payment methods include `apple_pay` and `link`.

The CLI adds the matching `--success-url` flags. The bundled documentation matches the current contract.
