---
title: Markets and Regional Pricing
description: Set plan prices per currency or per country, group countries into reusable Markets, and offer selectable price variants.
---

Commet has these complementary pricing layers:

| Layer                | Use it for                                                                          |
| -------------------- | ----------------------------------------------------------------------------------- |
| **Currency Pricing** | Define plan, balance, and overage values in one presentment currency                |
| **Country prices**   | Give a country its own currency and prices in a [plan version](/docs/plan-versions) |
| **Markets**          | Group countries that should resolve explicit price and currency overrides           |

Currency Pricing remains the fallback. Add Markets when country segmentation or selectable variants require it.

## Set currency pricing

```typescript
await commet.plans.setRegionalPricing({
  id: 'pln_pro',
  currency: 'gbp',
  exchangeRate: 0.79,
})
```

With only `currency` and `exchangeRate`, Commet derives every price, included balance, and overage from the USD values. Send `prices` or `features` to set exact amounts instead. Each change publishes a new [plan version](/docs/plan-versions); existing subscribers keep theirs until you move them.

Supported currencies: USD, ARS, BOB, BRL, CAD, CLP, CNY, COP, EUR, GBP, HKD, INR, JPY, KRW, MXN, PEN, PYG, SGD, THB, TWD, and UYU.

A currency applies to the countries that use it. Buyers in the United Kingdom pay in GBP, and EUR covers the euro countries. Buyers in a country without a configured currency pay the USD base price.

## Set prices by country

In the dashboard, the plan's **Regional prices** tab sets prices country by country in a draft:

1. Choose **Add a country** and the currency it pays in, USD included.
2. Set each price **By hand**, or follow the USD base at an exchange rate.
3. Set the country's prices for the add-ons and credit packs the plan sells, the same way.

Publishing the draft publishes every country together in one plan version. A country missing a price blocks publishing. Through the API, the `countries` block of `PATCH /plans/{id}/drafts/{draftId}` sets the same terms.

A subscriber pays the prices of its own country in its version; a buyer from a country the version doesn't list pays the USD base price. A move to another version never changes a subscription's currency, and a version that doesn't sell it can't receive the subscription. The same applies when a canceled subscription is reactivated on the latest version of what was bought: if that version doesn't sell its currency, reactivation returns `422 missing_regional_price`.

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

- A subscription stores the selected price identity and its plan version.
- Renewals use the price of the subscription's plan version. Market prices are not versioned: renewals use the Market price's current value.
- A version move keeps a subscriber's Market price, and a draft can't drop a currency that a Market price uses.
- A variant inherits every Market it does not override.
- Archiving hides a price from new selection without breaking existing subscriptions.
- A referenced Market cannot be deleted.

Accepted Offer phases are a separate immutable snapshot; the selected catalog price remains editable.

## v8 compatibility

API `2026-07-24` and SDK v8 keep `/pricing/market-groups` and `commet.pricing.*`. API `2026-07-31` and SDK v9 use the top-level Market surface.
