# Plans

API version: `2026-10-04`

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

## promoteVersion

`commet.plans.promoteVersion(params, options?)`

`POST /plans/{id}/versions/{versionId}/promote` · operation `promote-plan-version`

Choose a sellable publication as the default for new subscriptions. Existing subscriptions are not moved.

### Parameters

- `id` (`string`, required)
- `versionId` (`string`, required)
- `expectedMainVersionId` (`string`, required)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`PlanVersion`

## publishVersion

`commet.plans.publishVersion(params, options?)`

`POST /plans/{id}/versions/{versionId}/publish` · operation `publish-plan-version`

Validate all commercial terms and publish as the main version or a parallel test. Existing subscriptions are not moved.

### Parameters

- `id` (`string`, required)
- `versionId` (`string`, required)
- `expectedRevision` (`number`, required)
- `target` (`"main" | "test"`, required)
- `expectedMainVersionId` (`string`, required)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`PlanVersion`

## retireVersion

`commet.plans.retireVersion(params, options?)`

`POST /plans/{id}/versions/{versionId}/retire` · operation `retire-plan-version`

Stop selling this version while preserving existing subscriptions. Replace the main version before retiring it.

### Parameters

- `id` (`string`, required)
- `versionId` (`string`, required)
- `expectedMainVersionId` (`string`, required)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`PlanVersion`

## getVersion

`commet.plans.getVersion(params)`

`GET /plans/{id}/versions/{versionId}` · operation `get-plan-version`

Read the complete commercial terms of a draft or published version.

### Parameters

- `id` (`string`, required)
- `versionId` (`string`, required)

### Returns

`PlanVersion`

## updateVersion

`commet.plans.updateVersion(params, options?)`

`PATCH /plans/{id}/versions/{versionId}` · operation `update-plan-version`

Update an unpublished draft using its current revision. Each supplied array replaces that collection. Free/paid status and the consumption model are fixed at plan creation. Publishing separately validates completeness.

### Parameters

- `id` (`string`, required)
- `versionId` (`string`, required)
- `blockOnExhaustion` (`boolean`, optional)
- `freeIncludedCredits` (`number | null`, optional)
- `freeIncludedBalance` (`number | null`, optional)
- `prices` (`Array<{ id?: string; billingInterval: "weekly" | "monthly" | "quarterly" | "yearly" | "one_time"; price: number; isDefault: boolean; includedBalance: number | null; includedCredits: number | null; inheritsFromPriceId: string | null; offerId: string | null; countries: Array<{ countryCode: string; price: number; includedBalance: number | null; autoSynced: boolean }> }>`, optional)
- `features` (`Array<{ featureId: string; enabled: boolean; includedAmount: number | null; unlimited: boolean; overageEnabled: boolean; overageUnitPrice: number | null; overageModel: "per_unit" | null; creditsPerUnit: number | null; pricingMode: "fixed" | "ai_model"; margin: number | null; discountType: "percentage" | "amount" | null; discountValue: number | null; countries: Array<{ countryCode: string; overageUnitPrice: number; autoSynced: boolean }> }>`, optional)
- `countries` (`Array<{ countryCode: string; currency: string; exchangeRateCents: number | null }>`, optional)
- `addons` (`Array<{ id?: string; featureId: string; name: string; consumptionModel: "boolean" | "metered" | "credits" | "balance"; includedUnits: number | null; creditCost: number | null; prices: Array<{ currency: string; price: number; overageRate: number | null }> }>`, optional)
- `creditPacks` (`Array<{ id?: string; name: string; credits: number; prices: Array<{ currency: string; price: number }> }>`, optional)
- `expectedRevision` (`number`, required)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`PlanVersion`

## discardVersion

`commet.plans.discardVersion(params, options?)`

`DELETE /plans/{id}/versions/{versionId}` · operation `discard-plan-version`

Delete an unpublished draft. Published versions must be retired instead.

### Parameters

- `id` (`string`, required)
- `versionId` (`string`, required)
- `expectedRevision` (`number`, required)

### Returns

`DeletedObject`

## listVersions

`commet.plans.listVersions(params)`

`GET /plans/{id}/versions` · operation `list-plan-versions`

List complete publications and drafts. Existing subscribers retain their accepted version.

### Parameters

- `id` (`string`, required)

### Returns

`{ object: "list"; data: Array<PlanVersion>; hasMore: boolean; nextCursor?: string }`

## createVersion

`commet.plans.createVersion(params, options?)`

`POST /plans/{id}/versions` · operation `create-plan-version`

Copy a published version into an editable draft. Omit sourceVersionId to copy the main version. This does not change availability or any subscription.

### Parameters

- `id` (`string`, required)
- `sourceVersionId` (`string`, optional)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`PlanVersion`

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
