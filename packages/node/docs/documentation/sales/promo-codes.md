---
lastModified: 2026-07-31
title: Promo Codes
description: Distribute an existing Offer through a customer-entered checkout code.
---

A Promo Code is a distribution channel. The referenced Offer owns the economic terms; the code owns who can redeem them and when.

## Create a compatible Offer

A Promo Code can reference an Offer with exactly one `percentage` or `amount_off` phase.

```typescript
const launchOffer = await commet.offers.create({
  name: 'Launch 50',
  phases: [
    { type: 'percentage', durationCycles: 2, percentage: 5000 },
  ],
})
```

Trial, multi-phase, and `fixed_price` Offers can still be applied directly with `offerId`, but cannot be distributed through a Promo Code.

## Create the code

```typescript
const promoCode = await commet.promoCodes.create({
  code: 'LAUNCH50',
  offerId: launchOffer.id,
  billingInterval: 'monthly',
  maxRedemptions: 100,
  expiresAt: '2026-12-31T23:59:59.000Z',
  planIds: ['pln_pro'],
})
```

The Promo Code owns:

- the customer-facing code;
- optional plan and billing-interval restrictions;
- the redemption limit;
- expiration and active state.

Updating the Offer changes future redemptions. Existing Offer Applications keep their accepted terms.

## Checkout behavior

The customer enters the code during checkout. Commet validates the code, resolves the referenced Offer in the checkout currency, and records an Offer Application with source `promo_code`.

If an eligible automatic Introductory Offer applies, the code is rejected with `intro_offer_active`. A Promo Code also cannot be combined with an explicit `offerId`.

```typescript
await commet.subscriptions.create({
  customerId: 'user_123',
  planCode: 'pro',
  promoCode: 'LAUNCH50',
})
```

## Related

- [Offers](/docs/offers)
- [Promotional Offers](/docs/promotional-offers)
- [Introductory Offers](/docs/introductory-offers)
- [Manage Subscriptions](/docs/manage-subscriptions)
