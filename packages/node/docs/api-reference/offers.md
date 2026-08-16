# Offers

API version: `2026-07-31`

## get

`commet.offers.get(params)`

`GET /offers/{id}` · operation `get-offer`

Retrieve reusable offer terms by public ID.

### Parameters

- `id` (`string`, required)

### Returns

`Offer`

## update

`commet.offers.update(params, options?)`

`PATCH /offers/{id}` · operation `update-offer`

Replace reusable offer terms. Existing applications keep their immutable accepted terms.

### Parameters

- `id` (`string`, required)
- `name` (`string`, required)
- `phases` (`Array<object | object | object | object>`, required)
- `metadata` (`Record<string, unknown>`, optional)
- `startsAt` (`string | null`, optional)
- `endsAt` (`string | null`, optional)
- `active` (`boolean`, optional)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`Offer`

## delete

`commet.offers.delete(params, options?)`

`DELETE /offers/{id}` · operation `delete-offer`

Soft-delete an Offer. Existing applications and their accepted terms remain available for billing and audit.

### Parameters

- `id` (`string`, required)

### Returns

`DeletedOffer`

## list

`commet.offers.list(params?)`

`GET /offers` · operation `list-offers`

List reusable offer terms. Offers are independent from plans, prices, eligibility, and distribution channels.

### Parameters

- `cursor` (`string`, optional)
- `limit` (`number`, optional)
- `active` (`boolean`, optional)

### Returns

`object`

## create

`commet.offers.create(params, options?)`

`POST /offers` · operation `create-offer`

Create reusable offer terms without assigning a plan, price, eligibility rule, or distribution channel.

### Parameters

- `name` (`string`, required)
- `phases` (`Array<object | object | object | object>`, required)
- `metadata` (`Record<string, unknown>`, optional)
- `startsAt` (`string | null`, optional)
- `endsAt` (`string | null`, optional)
- `active` (`boolean`, optional)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`Offer`
