---
lastModified: 2026-08-16
title: Refunds and Retries
description: Understand how refunds and renewal retries affect transactions, invoices, and product access.
---

A refund and a retry create different payment outcomes. Neither should be inferred from a browser redirect.

## Refund

A full refund is requested against a successful transaction. Commet returns the provider-neutral refund with its actual status and emits `payment.refunded` when confirmed.

The refund does not automatically invent your product's access policy. Decide whether a refunded purchase revokes access, restores balance, or requires manual review, then apply that rule idempotently from the webhook.

## Retry

A retry applies to a failed subscription renewal. The failed transaction remains unchanged for audit and the retry creates a new attempt against the connection already bound to the subscription.

If the retry succeeds, the outstanding invoice is settled and the subscription can return to `active`. If customer action or a new card is required, use a recovery link or payment-method update instead.

See [Transactions, Refunds, and Retries](/docs/transactions-refunds-and-retries) and [Handle Failed Payments](/docs/handle-failed-payments).
