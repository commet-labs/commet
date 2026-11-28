# Offers

API version: `2026-08-27`

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
- `phases` (`Array<{ type: "percentage"; durationCycles: number | null; durationInterval?: "weekly" | "monthly" | "quarterly" | "semiannual" | "yearly" | null; percentage: number } | { type: "amount_off"; durationCycles: number | null; durationInterval?: "weekly" | "monthly" | "quarterly" | "semiannual" | "yearly" | null; amounts: Array<{ currency: string; amount: number }> } | { type: "fixed_price"; durationCycles: number | null; durationInterval?: "weekly" | "monthly" | "quarterly" | "semiannual" | "yearly" | null; prices: Array<{ currency: string; amount: number }> }>`, required)
- `metadata` (`Record<string, unknown>`, optional)
- `startsAt` (`string | null`, optional)
- `endsAt` (`string | null`, optional)
- `active` (`boolean`, optional)
- `planIds` (`Array<string>`, optional) — Plans the offer is limited to: it cannot be applied to a subscription on another plan, and an applied offer ends when the subscriber changes to one. An empty list removes the limit. Omit to keep the current limit.
- `billingInterval` (`"weekly" | "monthly" | "quarterly" | "semiannual" | "yearly" | "one_time" | null`, optional) — Billing interval the offer is limited to: it cannot be applied to a subscription on another interval, and an applied offer ends when the subscriber changes to one. Null removes the limit. Omit to keep the current limit.

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

`{ object: "list"; data: Array<Offer>; hasMore: boolean; nextCursor?: string }`

## create

`commet.offers.create(params, options?)`

`POST /offers` · operation `create-offer`

Create reusable offer terms. An offer applies to any plan and billing interval unless `planIds` or `billingInterval` limit it.

### Parameters

- `name` (`string`, required)
- `phases` (`Array<{ type: "percentage"; durationCycles: number | null; durationInterval?: "weekly" | "monthly" | "quarterly" | "semiannual" | "yearly" | null; percentage: number } | { type: "amount_off"; durationCycles: number | null; durationInterval?: "weekly" | "monthly" | "quarterly" | "semiannual" | "yearly" | null; amounts: Array<{ currency: string; amount: number }> } | { type: "fixed_price"; durationCycles: number | null; durationInterval?: "weekly" | "monthly" | "quarterly" | "semiannual" | "yearly" | null; prices: Array<{ currency: string; amount: number }> }>`, required)
- `metadata` (`Record<string, unknown>`, optional)
- `startsAt` (`string | null`, optional)
- `endsAt` (`string | null`, optional)
- `active` (`boolean`, optional)
- `planIds` (`Array<string>`, optional) — Plans the offer is limited to: it cannot be applied to a subscription on another plan, and an applied offer ends when the subscriber changes to one. An empty list removes the limit. Omit to keep the current limit.
- `billingInterval` (`"weekly" | "monthly" | "quarterly" | "semiannual" | "yearly" | "one_time" | null`, optional) — Billing interval the offer is limited to: it cannot be applied to a subscription on another interval, and an applied offer ends when the subscriber changes to one. Null removes the limit. Omit to keep the current limit.

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`Offer`
