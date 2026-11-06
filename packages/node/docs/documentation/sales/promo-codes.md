---
title: Promo Codes
description: Distribute an existing Offer through a customer-entered checkout code, limited to first purchases or applied on plan changes.
---

A Promo Code is a distribution channel. The referenced Offer owns the discount; the code owns who can redeem it and when.

## Create a compatible Offer

A Promo Code can reference any Offer: ordered `percentage`, `amount_off`, or `fixed_price` phases where only the last phase may be open-ended.

```typescript
const launchOffer = await commet.offers.create({
  name: 'Launch discount',
  phases: [
    { type: 'percentage', durationCycles: 2, percentage: 5000 },
    { type: 'percentage', durationCycles: 3, percentage: 2000 },
  ],
})
```

A `fixed_price` phase of `0`, **Free cycles** in the dashboard, makes a code that gives free billing cycles. Checkout saves the card and settles the invoice at $0 without a charge.

## Create the code

```typescript
const promoCode = await commet.promoCodes.create({
  code: 'LAUNCH50',
  offerId: launchOffer.id,
  billingInterval: 'monthly',
  maxRedemptions: 100,
  expiresAt: '2026-12-31T23:59:59.000Z',
  planIds: ['pln_pro'],
  firstPurchaseOnly: true,
})
```

The Promo Code owns:

- the customer-facing code;
- optional plan and billing-interval restrictions;
- the redemption limit;
- expiration and active state;
- `firstPurchaseOnly`, which limits the code to a customer's first purchase. Default `false`.

A customer qualifies for a first-purchase code while they have no paid invoice above $0 and no `active` or `past_due` subscription on a paid plan. A customer in a trial qualifies.

Updating the Offer changes future redemptions of codes that reference it. Each completed checkout counts one redemption and keeps an immutable Offer Application with the phases accepted at that checkout. Editing the Offer does not change earlier redemptions or their renewals.

Clients pinned before `2026-07-24` receive only the first phase in the legacy Promo Code discount fields when that phase is `percentage` or `amount_off`. Codes starting with `fixed_price` cannot be represented and are absent from those older Promo Code endpoints. Use the current Offer API to inspect the complete sequence.

## Checkout behavior

The customer enters the code during checkout. Commet validates the code, resolves the referenced Offer in the checkout currency, and records an Offer Application with source `promo_code`.

When the price has a [trial](/docs/trial-periods) that requires a payment method, the customer can enter the code in the trial checkout. The trial starts without a charge and the discount starts with the first invoice after it. One redemption is recorded when the checkout completes. Renewals do not count as new redemptions.

If an eligible automatic Introductory Offer applies, the code is rejected with `intro_offer_active`. A Promo Code also cannot be combined with an explicit `offerId`.

```typescript
await commet.subscriptions.create({
  customerId: 'user_123',
  planCode: 'pro',
  promoCode: 'LAUNCH50',
})
```

A trial without a payment method has no checkout, so it can't start with a promo code.

## Apply a code on a plan change

`changePlan` and `previewChange` accept `promoCode` for immediate changes. The preview quotes what the change charges.

```typescript
await commet.subscriptions.changePlan({
  id: 'sub_xxx',
  newPlanId: 'pln_pro',
  promoCode: 'LAUNCH50',
})
```

From a free plan, the code opens the checkout with the discount applied and counts its use when the checkout is paid. Scheduled changes reject a promo code with `offer_not_applicable`.

## Rejection reasons

A rejected code returns `400 validation_error` with `param: "promoCode"` and the reason in `details.reason`:

- `not_found`: no code with that text exists.
- `inactive`: the code is deactivated.
- `expired`: the expiration date passed.
- `max_redemptions_reached`: the redemption limit was reached.
- `first_purchase_only`: the customer already paid or has a paid subscription.
- `already_redeemed`: the customer already redeemed the code.
- `plan_not_eligible`: the code is restricted to other plans.
- `billing_interval_not_eligible`: the code is restricted to another billing interval.
- `intro_offer_active`: an Introductory Offer applies.

Checkout also rejects a positive total below the currency's minimum charge.

## Codes managed by an integration

Codes created by an integration, such as [Dub](/docs/connect-dub-affiliates), have `managedBy` set. Changing their restrictions returns `409 managed_by_integration`; activating and deactivating them still works.
