# Features

API version: `2026-07-31`

## get

`commet.features.get(params)`

`GET /features/{code}` · operation `get-feature`

Get a single feature definition by code from the organization's feature catalog.

### Parameters

- `code` (`string`, required)

### Returns

`Feature`

## update

`commet.features.update(params, options?)`

`PATCH /features/{code}` · operation `update-feature`

Update a feature's name, description, or unit name. At least one field must be provided.

### Parameters

- `code` (`string`, required)
- `name` (`string`, optional)
- `description` (`string | null`, optional)
- `unitName` (`string | null`, optional)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`Feature`

## delete

`commet.features.delete(params, options?)`

`DELETE /features/{code}` · operation `delete-feature`

Delete a feature. Fails if the feature is attached to active plans or has an active add-on.

### Parameters

- `code` (`string`, required)

### Returns

`DeletedObject`

## list

`commet.features.list()`

`GET /features` · operation `list-features`

List every feature defined in the organization. This is the organization's feature catalog (definitions), not a customer's feature access.

### Returns

`object`

## create

`commet.features.create(params, options?)`

`POST /features` · operation `create-feature`

Create a new feature. Code must be lowercase alphanumeric with underscores.

### Parameters

- `name` (`string`, required)
- `code` (`string`, required)
- `type` (`"boolean" | "usage" | "seats" | "quota"`, required)
- `description` (`string`, optional)
- `unitName` (`string`, optional)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`Feature`
