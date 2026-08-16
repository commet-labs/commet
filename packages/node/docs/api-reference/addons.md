# Addons

API version: `2026-07-31`

## listActive

`commet.addons.listActive(params)`

`GET /active-addons` · operation `list-active-addons`

List all active add-ons for a customer's subscription.

### Parameters

- `customerId` (`string`, required)

### Returns

`object`

## get

`commet.addons.get(params)`

`GET /addons/{id}` · operation `get-addon`

Retrieve an add-on by its public ID or slug.

### Parameters

- `id` (`string`, required)

### Returns

`Addon`

## update

`commet.addons.update(params, options?)`

`PATCH /addons/{id}` · operation `update-addon`

Update an add-on's name, description, or pricing.

### Parameters

- `id` (`string`, required)
- `name` (`string`, optional)
- `description` (`string`, optional)
- `basePrice` (`number`, optional)
- `includedUnits` (`number`, optional)
- `overageRate` (`number`, optional)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`Addon`

## delete

`commet.addons.delete(params, options?)`

`DELETE /addons/{id}` · operation `delete-addon`

Soft-delete an add-on. Fails if the add-on has active subscriptions.

### Parameters

- `id` (`string`, required)

### Returns

`DeletedObject`

## list

`commet.addons.list(params?)`

`GET /addons` · operation `list-addons`

List all add-ons with cursor-based pagination.

### Parameters

- `cursor` (`string`, optional)
- `limit` (`number`, optional)

### Returns

`object`

## create

`commet.addons.create(params, options?)`

`POST /addons` · operation `create-addon`

Create a new add-on linked to a feature. Each feature can only be assigned to one add-on.

### Parameters

- `name` (`string`, required)
- `description` (`string`, optional)
- `basePrice` (`number`, required)
- `featureId` (`string`, required)
- `consumptionModel` (`"boolean" | "metered" | "credits" | "balance"`, required)
- `includedUnits` (`number`, optional)
- `overageRate` (`number`, optional)
- `creditCost` (`number`, optional)

### Valid parameter combinations

- `name` + `basePrice` + `featureId` + `consumptionModel`
- `name` + `basePrice` + `featureId` + `consumptionModel` + `includedUnits` + `overageRate`
- `name` + `basePrice` + `featureId` + `consumptionModel` + `creditCost`
- `name` + `basePrice` + `featureId` + `consumptionModel` + `overageRate`

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`Addon`
