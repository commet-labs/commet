# Plans

API version: `2026-07-31`

## updateFeature

`commet.plans.updateFeature(params, options?)`

`PATCH /plans/{id}/features/{featureId}` · operation `update-plan-feature`

Update limits, overage, or enabled status of a feature on a plan.

### Parameters

- `id` (`string`, required)
- `featureId` (`string`, required)
- `enabled` (`boolean`, optional)
- `includedAmount` (`number`, optional)
- `unlimited` (`boolean`, optional)
- `overage` (`{ enabled?: boolean; unitPrice?: number }`, optional)
- `creditsPerUnit` (`number | null`, optional)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`PlanFeature`

## removeFeature

`commet.plans.removeFeature(params, options?)`

`DELETE /plans/{id}/features/{featureId}` · operation `remove-plan-feature`

Detach a feature from a plan.

### Parameters

- `id` (`string`, required)
- `featureId` (`string`, required)

### Returns

`RemovedPlanFeature`

## addFeature

`commet.plans.addFeature(params, options?)`

`POST /plans/{id}/features` · operation `add-plan-feature`

Attach a feature to a plan with limits, overage, and credits configuration.

### Parameters

- `id` (`string`, required)
- `featureId` (`string`, required)
- `enabled` (`boolean`, optional)
- `includedAmount` (`number`, optional)
- `unlimited` (`boolean`, optional)
- `overage` (`{ enabled?: boolean; unitPrice?: number }`, optional)
- `creditsPerUnit` (`number | null`, optional)
- `pricingMode` (`"fixed" | "ai_model"`, optional)
- `margin` (`number | null`, optional)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`PlanFeature`

## setDefaultPrice

`commet.plans.setDefaultPrice(params, options?)`

`PUT /plans/{id}/prices/{priceId}/default` · operation `set-default-plan-price`

Set a specific price as the default and return the updated plan price.

### Parameters

- `id` (`string`, required)
- `priceId` (`string`, required)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`PlanPrice`

## setRegionalPrices

`commet.plans.setRegionalPrices(params, options?)`

`PUT /plans/{id}/prices/{priceId}/regional` · operation `upsert-regional-prices`

Create or update regional currency price overrides for a plan price.

### Parameters

- `id` (`string`, required)
- `priceId` (`string`, required)
- `overrides` (`Array<{ currency: string; price: number; includedBalance?: number }>`, required)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`PlanRegionalPricing`

## deleteRegionalPrices

`commet.plans.deleteRegionalPrices(params, options?)`

`DELETE /plans/{id}/prices/{priceId}/regional` · operation `delete-regional-prices`

Remove all regional currency overrides for a plan price. The request is rejected while billable subscriptions depend on an override.

### Parameters

- `id` (`string`, required)
- `priceId` (`string`, required)

### Returns

`DeletedPlanRegionalPricing`

## updatePrice

`commet.plans.updatePrice(params, options?)`

`PATCH /plans/{id}/prices/{priceId}` · operation `update-plan-price`

Update a base price or market price variant. Removing a base market override is rejected while a variant depends on it. Offer terms are managed through Offers.

### Parameters

- `id` (`string`, required)
- `priceId` (`string`, required)
- `price` (`number`, optional)
- `isDefault` (`boolean`, optional)
- `trialDays` (`number`, optional)
- `includedBalance` (`number | null`, optional)
- `includedCredits` (`number | null`, optional)
- `metadata` (`Record<string, unknown>`, optional) — Metadata keys to merge into the existing price metadata.
- `marketPrices` (`Array<{ marketGroupId: string; currency: "usd" | "ars" | "brl" | "clp" | "cop" | "pen" | "uyu" | "pyg" | "bob" | "mxn" | "cad" | "eur" | "gbp" | "jpy" | "cny" | "krw" | "hkd" | "sgd" | "twd" | "inr" | "thb"; price: number }>`, optional)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`PlanPrice`

## deletePrice

`commet.plans.deletePrice(params, options?)`

`DELETE /plans/{id}/prices/{priceId}` · operation `delete-plan-price`

Archive a price for new subscriptions. Existing subscriptions that selected it continue using its current catalog value.

### Parameters

- `id` (`string`, required)
- `priceId` (`string`, required)

### Returns

`DeletedObject`

## addPrice

`commet.plans.addPrice(params, options?)`

`POST /plans/{id}/prices` · operation `add-plan-price`

Add a base price or a selectable market price variant. Variants inherit their base price outside the markets they override. Configure introductory and promotional benefits through Offers.

### Parameters

- `id` (`string`, required)
- `billingInterval` (`"weekly" | "monthly" | "quarterly" | "yearly" | "one_time"`, required)
- `metadata` (`Record<string, unknown>`, optional)
- `price` (`number`, optional)
- `trialDays` (`number`, optional)
- `isDefault` (`boolean`, optional)
- `includedBalance` (`number | null`, optional)
- `includedCredits` (`number | null`, optional)
- `marketPrices` (`Array<{ marketGroupId: string; currency: "usd" | "ars" | "brl" | "clp" | "cop" | "pen" | "uyu" | "pyg" | "bob" | "mxn" | "cad" | "eur" | "gbp" | "jpy" | "cny" | "krw" | "hkd" | "sgd" | "twd" | "inr" | "thb"; price: number }>`, optional)
- `inheritsFromPriceId` (`string`, optional)

### Valid parameter combinations

- `billingInterval` + `price`
- `billingInterval` + `inheritsFromPriceId` + `marketPrices`

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`PlanPrice`

## setRegionalPricing

`commet.plans.setRegionalPricing(params, options?)`

`PUT /plans/{id}/regional` · operation `set-plan-regional-pricing`

Configure regional prices and feature overage values for one currency. Currency-specific offer terms are managed through Offers.

### Parameters

- `id` (`string`, required)
- `currency` (`"usd" | "ars" | "brl" | "clp" | "cop" | "pen" | "uyu" | "pyg" | "bob" | "mxn" | "cad" | "eur" | "gbp" | "jpy" | "cny" | "krw" | "hkd" | "sgd" | "twd" | "inr" | "thb"`, required)
- `exchangeRate` (`number`, required)
- `prices` (`Array<{ priceId: string; price: number; includedBalance?: number }>`, optional)
- `features` (`Array<{ featureId: string; overageUnitPrice: number }>`, optional)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`PlanRegionalPricingResult`

## get

`commet.plans.get(params)`

`GET /plans/{id}` · operation `get-plan`

Get a plan with public price IDs and their automatic introductory offer IDs.

### Parameters

- `id` (`string`, required)

### Returns

`Plan`

## update

`commet.plans.update(params, options?)`

`PATCH /plans/{id}` · operation `update-plan`

Update a plan's name, description, visibility, or metadata.

### Parameters

- `id` (`string`, required)
- `name` (`string`, optional)
- `description` (`string | null`, optional)
- `metadata` (`Record<string, unknown>`, optional)
- `isPublic` (`boolean`, optional)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`Plan`

## delete

`commet.plans.delete(params, options?)`

`DELETE /plans/{id}` · operation `delete-plan`

Soft-delete a plan.

### Parameters

- `id` (`string`, required)

### Returns

`DeletedObject`

## setVisibility

`commet.plans.setVisibility(params, options?)`

`PUT /plans/{id}/visibility` · operation `set-plan-visibility`

Set a plan's public visibility and return the updated plan.

### Parameters

- `id` (`string`, required)
- `isPublic` (`boolean`, required)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`Plan`

## list

`commet.plans.list(params?)`

`GET /plans` · operation `list-plans`

List plans with public price IDs and their automatic introductory offer IDs.

### Parameters

- `includePrivate` (`boolean`, optional)

### Returns

`{ object: "list"; data: Array<Plan>; hasMore: boolean; nextCursor?: string }`

## create

`commet.plans.create(params, options?)`

`POST /plans` · operation `create-plan`

Create a new plan with optional consumption model, visibility, and plan group assignment.

### Parameters

- `name` (`string`, required)
- `code` (`string`, required)
- `description` (`string`, optional)
- `consumptionModel` (`"metered" | "credits" | "balance"`, optional)
- `isPublic` (`boolean`, optional)
- `isFree` (`boolean`, optional)
- `blockOnExhaustion` (`boolean`, optional)
- `planGroupId` (`string`, optional)
- `metadata` (`Record<string, unknown>`, optional)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`Plan`
