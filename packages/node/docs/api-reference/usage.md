# Usage

API version: `2026-07-31`

## check

`commet.usage.check(params, options?)`

`POST /usage/check` · operation `check-usage-availability`

Check if a customer can consume a feature before actual consumption. Returns availability and cost estimates based on the plan's consumption model.

### Parameters

- `customerId` (`string`, required)
- `featureCode` (`string`, required)
- `quantity` (`number`, optional)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`UsageCheck`

## track

`commet.usage.track(params, options?)`

`POST /usage/events` · operation `track-usage`

Track a usage event for a metered feature. Deducts from balance/credits if applicable.

### Parameters

- `featureCode` (`string`, required)
- `customerId` (`string`, required)
- `eventId` (`string`, optional)
- `timestamp` (`string`, optional)
- `properties` (`Array<object>`, optional)
- `model` (`string`, optional)
- `inputTokens` (`number`, optional)
- `outputTokens` (`number`, optional)
- `value` (`number`, optional)
- `cacheReadTokens` (`number`, optional)
- `cacheWriteTokens` (`number`, optional)

### Valid parameter combinations

- `featureCode` + `customerId` + `model` + `inputTokens` + `outputTokens`
- `featureCode` + `customerId`

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`UsageEvent`

## set

`commet.usage.set(params, options?)`

`PUT /usage` · operation `set-usage`

Set a metered feature's usage to an exact value for the current period. Use the Idempotency-Key header to make retries safe.

### Parameters

- `customerId` (`string`, required)
- `featureCode` (`string`, required)
- `value` (`number`, required)
- `reason` (`string`, optional)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`UsageAdjustment`
