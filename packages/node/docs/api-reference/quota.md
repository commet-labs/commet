# Quota

API version: `2026-07-31`

## getAll

`commet.quota.getAll(params)`

`GET /usage/quota/all` · operation `get-all-quota-allowances`

Get all quota allowances for a customer across every quota feature in their plan.

### Parameters

- `customerId` (`string`, required)

### Returns

`object`

## remove

`commet.quota.remove(params, options?)`

`POST /usage/quota/remove` · operation `remove-quota`

Remove from a customer's quota allowance for a feature. Defaults to 1 if count is omitted. Returns 400 insufficient_balance if the balance would go negative.

### Parameters

- `featureCode` (`string`, required)
- `count` (`number`, optional)
- `customerId` (`string`, optional)
- `externalId` (`string`, optional)

### Valid parameter combinations

- `featureCode` + `customerId`
- `featureCode` + `externalId`

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`UsageQuotaEvent`

## get

`commet.quota.get(params)`

`GET /usage/quota` · operation `get-quota-allowance`

Get the current quota allowance (used vs included) for a specific feature.

### Parameters

- `customerId` (`string`, required)
- `featureCode` (`string`, required)

### Returns

`UsageQuota`

## add

`commet.quota.add(params, options?)`

`POST /usage/quota` · operation `add-quota`

Add to a customer's quota allowance for a feature. Defaults to 1 if count is omitted.

### Parameters

- `featureCode` (`string`, required)
- `count` (`number`, optional)
- `customerId` (`string`, optional)
- `externalId` (`string`, optional)

### Valid parameter combinations

- `featureCode` + `customerId`
- `featureCode` + `externalId`

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`UsageQuotaEvent`

## set

`commet.quota.set(params, options?)`

`PUT /usage/quota` · operation `set-quota`

Set a customer's quota allowance for a feature to an exact value.

### Parameters

- `featureCode` (`string`, required)
- `count` (`number`, required)
- `customerId` (`string`, optional)
- `externalId` (`string`, optional)

### Valid parameter combinations

- `featureCode` + `count` + `customerId`
- `featureCode` + `count` + `externalId`

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`UsageQuotaEvent`
