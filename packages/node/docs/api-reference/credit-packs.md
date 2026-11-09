# Credit Packs

API version: `2026-08-27`

## update

`commet.creditPacks.update(params, options?)`

`PATCH /credit-packs/{id}` · operation `update-credit-pack`

Update a credit pack's name, description, credits, price, active status, or the plans that sell it.

### Parameters

- `id` (`string`, required)
- `name` (`string`, optional)
- `description` (`string`, optional)
- `credits` (`number`, optional)
- `price` (`number`, optional)
- `isActive` (`boolean`, optional)
- `planIds` (`Array<string>`, optional) — Plans that sell the credit pack, replacing the current ones. Empty means every plan; omitted keeps them.

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`CreditPack`

## delete

`commet.creditPacks.delete(params, options?)`

`DELETE /credit-packs/{id}` · operation `delete-credit-pack`

Soft-delete a credit pack.

### Parameters

- `id` (`string`, required)

### Returns

`DeletedObject`

## list

`commet.creditPacks.list()`

`GET /credit-packs` · operation `list-credit-packs`

List all active credit packs.

### Returns

`{ object: "list"; data: Array<CreditPackListItem>; hasMore: boolean; nextCursor?: string }`

## create

`commet.creditPacks.create(params, options?)`

`POST /credit-packs` · operation `create-credit-pack`

Create a new credit pack.

### Parameters

- `name` (`string`, required)
- `description` (`string`, optional)
- `credits` (`number`, required)
- `price` (`number`, required)
- `isActive` (`boolean`, optional)
- `planIds` (`Array<string>`, optional) — Plans that sell the credit pack. Omitted or empty, every plan sells it. Plans created later sell it too.

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`CreditPack`
