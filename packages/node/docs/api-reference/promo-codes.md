# Promo Codes

API version: `2026-07-31`

## get

`commet.promoCodes.get(params)`

`GET /promo-codes/{id}` · operation `get-promo-code`

Retrieve a promo code by its public ID.

### Parameters

- `id` (`string`, required)

### Returns

`PromoCode`

## update

`commet.promoCodes.update(params, options?)`

`PATCH /promo-codes/{id}` · operation `update-promo-code`

Update a promo code's billing interval, redemption limits, expiration, active status, or plan restrictions.

### Parameters

- `id` (`string`, required)
- `billingInterval` (`"weekly" | "monthly" | "quarterly" | "yearly" | "one_time" | null`, optional)
- `maxRedemptions` (`number | null`, optional)
- `expiresAt` (`string | null`, optional)
- `active` (`boolean`, optional)
- `planIds` (`Array<string>`, optional)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`PromoCode`

## list

`commet.promoCodes.list(params?)`

`GET /promo-codes` · operation `list-promo-codes`

List promo codes with cursor-based pagination.

### Parameters

- `cursor` (`string`, optional)
- `limit` (`number`, optional)

### Returns

`object`

## create

`commet.promoCodes.create(params, options?)`

`POST /promo-codes` · operation `create-promo-code`

Create a distribution code for an existing Offer. The referenced Offer owns the benefit and duration; the promo code owns redemption restrictions.

### Parameters

- `code` (`string`, required)
- `offerId` (`string`, required)
- `billingInterval` (`"weekly" | "monthly" | "quarterly" | "yearly" | "one_time" | null`, optional)
- `maxRedemptions` (`number`, optional)
- `expiresAt` (`string`, optional)
- `planIds` (`Array<string>`, optional)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`PromoCode`
