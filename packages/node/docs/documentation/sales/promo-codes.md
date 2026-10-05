---
lastModified: 2026-09-23
title: Promo Codes
description: Distribute an existing Offer through a customer-entered checkout code.
---

A Promo Code is a distribution channel. The referenced Offer owns the economic terms; the code owns who can redeem them and when.

## Create a compatible Offer

A Promo Code can reference an Offer with ordered `percentage`, `amount_off`, or `fixed_price` phases. It can start with one `free_trial` phase when a discount follows it. Each discount phase before the last must have a finite duration.

```typescript
const launchOffer = await commet.offers.create({
  name: 'Launch discount',
  phases: [
    { type: 'percentage', durationCycles: 2, percentage: 5000 },
    { type: 'percentage', durationCycles: 3, percentage: 2000 },
  ],
})
```

For a trial followed by a discount, put the trial first:

```typescript
const trialOffer = await commet.offers.create({
  name: 'Early access',
  phases: [
    { type: 'free_trial', durationDays: 14 },
    { type: 'percentage', durationCycles: 3, percentage: 2000 },
  ],
})
```

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

Updating the Offer changes future redemptions of codes that reference it. Each completed checkout counts one redemption and keeps an immutable Offer Application with the phases accepted at that checkout. Editing the Offer does not change earlier redemptions or their renewals.

Clients pinned before `2026-07-24` receive only the first phase in the legacy Promo Code discount fields when that phase is `percentage` or `amount_off`. Codes starting with `free_trial` or `fixed_price` cannot be represented and are absent from those older Promo Code endpoints. Use the current Offer API to inspect the complete sequence.

## Checkout behavior

The customer enters the code during checkout. Commet validates the code, resolves the referenced Offer in the checkout currency, and records an Offer Application with source `promo_code`.

When the Offer starts with a trial, a new subscription checkout collects a payment method without charging. Applying that code to a pending first-payment checkout replaces it with a trial setup checkout. Trial codes cannot start a trial on an existing subscription's plan change. One redemption is recorded when setup completes; the first paid invoice follows the trial and uses the next phase. Renewals do not count as new redemptions.

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
