---
lastModified: 2026-09-22
title: Refunds and Retries
description: Understand how refunds and renewal retries affect transactions, invoices, and product access.
---

A refund and a retry create different payment outcomes. Neither should be inferred from a browser redirect.

## Refund

A full refund is requested against a successful transaction. Commet returns the provider-neutral refund with its actual status and emits `payment.refunded` when confirmed.

Commet leaves the subscription, access, and future renewals unchanged. If the customer should stop receiving the plan, cancel the subscription separately. Handle `payment.refunded` idempotently for any additional refund policy in your own product.

## Retry

A retry applies to a failed subscription renewal. The failed transaction remains unchanged for audit and the retry creates a new attempt against the connection already bound to the subscription.

If the retry succeeds, the outstanding invoice is settled and the subscription can return to `active`. If customer action or a new card is required, use a recovery link or payment-method update instead.

See [Transactions, Refunds, and Retries](/docs/transactions-refunds-and-retries) and [Handle Failed Payments](/docs/handle-failed-payments).
