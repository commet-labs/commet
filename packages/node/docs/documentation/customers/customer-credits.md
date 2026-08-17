---
lastModified: 2026-08-16
title: Customer Credits
description: Grant monetary invoice credit to a customer, inspect its remaining balance, and revoke unused credit.
---

Customer credits are monetary adjustments for a specific customer and currency. Commet applies them FIFO before tax to eligible recurring invoices.

Use customer credits for service recovery, a negotiated commercial credit, or an account adjustment. They are not plan credits and cannot be consumed by usage events.

## Grant credit

Open a customer in **Customers** to review their billing context. Grant credit through the API when the adjustment originates in your application or support workflow:

```typescript
const credit = await commet.customers.createCredit(
  {
    id: 'cus_01J...',
    amount: 2500,
    currency: 'usd',
    reason: 'Service recovery credit',
  },
  { idempotencyKey: 'credit-acme-2026-08-16' },
)
```

`amount` uses the currency's smallest unit. A USD amount of `2500` is USD 25.00. Always send a reason; it becomes part of the credit's audit trail.

## Inspect remaining credit

```typescript
const credits = await commet.customers.listCredits({ id: 'cus_01J...' })
```

Credits only apply to invoices in the same currency. If a customer has USD and BRL subscriptions over time, each currency keeps an independent balance.

## Revoke unused credit

```typescript
const revocation = await commet.customers.revokeCredit(
  { id: 'cus_01J...', creditId: 'crd_01J...' },
  { idempotencyKey: 'revoke-credit-acme-2026-08-16' },
)
```

Revocation removes only the unallocated remainder. It does not rewrite invoices that already consumed part of the grant.

For product allowances, use [Credits and Credit Packs](/docs/credit-packs). For access without billing, use [Plan Grants](/docs/plan-grants).
