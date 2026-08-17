# Markets

API version: `2026-07-31`

## get

`commet.markets.get(params)`

`GET /markets/{id}` · operation `get-market`

Get one reusable market.

### Parameters

- `id` (`string`, required)

### Returns

`Market`

## update

`commet.markets.update(params, options?)`

`PATCH /markets/{id}` · operation `update-market`

Replace the name, countries, and metadata of a market.

### Parameters

- `id` (`string`, required)
- `name` (`string`, required)
- `countryCodes` (`Array<string>`, required)
- `metadata` (`Record<string, unknown>`, optional)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`Market`

## delete

`commet.markets.delete(params, options?)`

`DELETE /markets/{id}` · operation `delete-market`

Delete an unused market. Markets referenced by prices or subscriptions cannot be deleted.

### Parameters

- `id` (`string`, required)

### Returns

`DeletedObject`

## list

`commet.markets.list()`

`GET /markets` · operation `list-markets`

List reusable country groups that resolve market-specific prices independently from currency.

### Returns

`{ object: "list"; data: Array<Market>; hasMore: boolean; nextCursor?: string }`

## create

`commet.markets.create(params, options?)`

`POST /markets` · operation `create-market`

Create a reusable market without attaching it to a plan or price. Countries can belong to only one active market.

### Parameters

- `name` (`string`, required)
- `countryCodes` (`Array<string>`, required)
- `metadata` (`Record<string, unknown>`, optional)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`Market`
