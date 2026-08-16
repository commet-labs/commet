# Test Clock

API version: `2026-07-31`

## processBilling

`commet.testClock.processBilling(options?)`

`POST /test-clock/process-billing` · operation `process-test-clock-billing`

Deprecated. POST /test-clock now advances time and processes every due billing deadline in one durable run.

Deprecated.

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`void`

## get

`commet.testClock.get()`

`GET /test-clock` · operation `get-test-clock`

Returns the organization's current test clock state and latest durable run. Sandbox only.

### Returns

`TestClock`

## advance

`commet.testClock.advance(params, options?)`

`POST /test-clock` · operation `advance-test-clock`

Starts a durable run that moves the test clock forward and processes every billing deadline due before the target time. Poll GET /test-clock for progress and terminal results. Sandbox only.

### Parameters

- `advanceDays` (`number`, optional)
- `frozenTime` (`string`, optional)

### Valid parameter combinations

- `advanceDays`
- `frozenTime`

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`TestClockRun`
