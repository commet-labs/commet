---
lastModified: 2026-08-16
title: Card Promotions
description: Distribute a Promotional Offer to eligible card BINs and revalidate eligibility at checkout.
---

Card Promotions connect an existing Promotional Offer to one or more card BINs. The Offer owns the discount and duration; the Card Promotion controls who can receive it.

This feature appears only for organizations with Card Promotions enabled.

## Configure the promotion

1. Create a [Promotional Offer](/docs/promotional-offers) whose first phase is a discount.
2. Open **Card Promotions** and choose that Offer.
3. Add the eligible 6- or 8-digit BINs.
4. Choose whether it applies to every billing interval or one specific interval.
5. Choose automatic discovery or require your application to preselect it.
6. Activate it when the commercial campaign begins.

A BIN can belong to only one Card Promotion. Eight-digit matches take precedence over their six-digit fallback.

## Preselect it in checkout

Pass the public `cardPromotionId` when creating the subscription:

```typescript
const subscription = await commet.subscriptions.create(
  {
    customerId: 'cus_01J...',
    planId: 'pln_01J...',
    cardPromotionId: 'cpr_01J...',
  },
  { idempotencyKey: 'checkout-acme-2026-08-16' },
)
```

The checkout can show the benefit immediately, but it remains conditional. Commet reads the entered card and verifies its BIN, the configured billing interval, and the Offer's compatibility with the selected price. It removes the promotion before confirmation if those checks fail.

Do not pass the underlying `offerId` to simulate a card promotion. A direct Offer is unconditional; `cardPromotionId` preserves the eligibility check and records the application source correctly.

Use sandbox cards that match your configured BINs and verify both eligible and ineligible confirmation paths.
