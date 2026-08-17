---
lastModified: 2026-07-31
title: Markets and Regional Pricing
description: Combine currency pricing, reusable country Markets, and selectable price variants.
---

Commet has two complementary pricing layers:

| Layer                | Use it for                                                                |
| -------------------- | ------------------------------------------------------------------------- |
| **Currency Pricing** | Define plan, balance, and overage values in one presentment currency      |
| **Markets**          | Group countries that should resolve explicit price and currency overrides |

Currency Pricing remains the fallback. Add Markets when country segmentation or selectable variants require it.

## Create a Market

A Market is a top-level Sales resource. It does not require a plan or price.

```typescript
const argentina = await commet.markets.create({
  name: 'Argentina',
  countryCodes: ['AR'],
})

const southernCone = await commet.markets.create({
  name: 'Southern Cone',
  countryCodes: ['BO', 'PY', 'UY'],
})
```

Countries can belong to only one active Market. The v9 REST paths are `/markets` and `/markets/{id}`.

## Add Market prices

The base amount remains the fallback for every country without a Market override.

```typescript
const basePrice = await commet.plans.addPrice({
  id: 'pln_pro',
  billingInterval: 'monthly',
  price: 4900,
  isDefault: true,
  marketPrices: [
    { marketGroupId: argentina.id, currency: 'ars', price: 6490000 },
    { marketGroupId: southernCone.id, currency: 'usd', price: 3900 },
  ],
})
```

At checkout, Commet resolves the Market from the request country. Sandbox checkout lets you change **Country** to test another Market; live checkout ignores that override.

## Selectable variants

A variant inherits one base price and overrides only Markets already configured on that base:

```typescript
const foundingCustomers = await commet.plans.addPrice({
  id: 'pln_pro',
  billingInterval: 'monthly',
  inheritsFromPriceId: basePrice.id,
  metadata: { name: 'Founding customers' },
  marketPrices: [
    { marketGroupId: argentina.id, currency: 'ars', price: 3990000 },
  ],
})
```

Pass `priceId` only when the customer deliberately selects that variant:

```typescript
await commet.subscriptions.create({
  customerId: 'user_123',
  planCode: 'pro',
  priceId: foundingCustomers.id,
})
```

Omitting `priceId` keeps normal default-price and Market resolution.

## Renewal and archival

- A subscription stores the selected price identity.
- Renewals use that price row's current catalog value.
- A variant inherits every Market it does not override.
- Archiving hides a price from new selection without breaking existing subscriptions.
- A referenced Market cannot be deleted.

Accepted Offer phases are a separate immutable snapshot; the selected catalog price remains editable.

## v8 compatibility

API `2026-07-24` and SDK v8 keep `/pricing/market-groups` and `commet.pricing.*`. API `2026-07-31` and SDK v9 use the top-level Market surface.

## Related

- [Offers](/docs/offers)
- [Create Plans](/docs/create-plans)
- [Manage Subscriptions](/docs/manage-subscriptions)
- [Markets API reference](/docs/api-reference/markets/list-markets)
