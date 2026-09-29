---
"@commet/node": minor
"@commet/next": minor
"commet": minor
---

Update the Node SDK and CLI to API `2026-08-27`, preserving existing methods and request parameters while adding:

- `subscriptions.pause`, `updatePause`, `revokePause`, and `resume`, with pause summaries and typed lifecycle webhooks.
- `paymentContext` on payments, transactions, and applicable webhooks, including the charge reason, payment link, and recovery context.
- Nullable `paymentMethod` and `subPaymentMethod` on transactions and applicable webhooks.
- Restricted API key authentication (`rk_`) and typed permission grants when creating keys.
- Current installed API, webhook, error, and product documentation.

The default API pin now exposes `paused` subscription status and `resume` invoice type. Integrations that exhaustively handle these values should include the new cases. Existing explicit API overrides and webhook endpoint pins are preserved.

The Next.js webhook handler now routes the six pause/resume events to their named callbacks.
