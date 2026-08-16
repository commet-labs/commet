# Seats

API version: `2026-07-31`

## getBalance

`commet.seats.getBalance(params)`

`GET /seats/balance` · operation `get-seat-balance`

Get current balance for a specific seat type.

### Parameters

- `customerId` (`string`, required)
- `featureCode` (`string`, required)

### Returns

`SeatBalance`

## getAllBalances

`commet.seats.getAllBalances(params)`

`GET /seats/balances` · operation `get-all-seat-balances`

Get the current balance for all seat types in a customer's subscription.

### Parameters

- `customerId` (`string`, required)

### Returns

`SeatBalanceCollection`

## setAll

`commet.seats.setAll(params, options?)`

`PUT /seats/bulk` · operation `bulk-set-seats`

Set all seat types at once.

### Parameters

- `customerId` (`string`, required)
- `seats` (`Record<string, number>`, required)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`object`

## remove

`commet.seats.remove(params, options?)`

`POST /seats/remove` · operation `remove-seats`

Remove seats from a customer's subscription. Takes effect at the end of the billing period.

### Parameters

- `customerId` (`string`, required)
- `featureCode` (`string`, required)
- `count` (`number`, required)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`SeatEvent`

## add

`commet.seats.add(params, options?)`

`POST /seats` · operation `add-seats`

Add seats to a customer's subscription. Prorates charges for the current billing period.

### Parameters

- `customerId` (`string`, required)
- `featureCode` (`string`, required)
- `count` (`number`, required)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`SeatEvent`

## set

`commet.seats.set(params, options?)`

`PUT /seats` · operation `set-seats`

Set seats to an exact count.

### Parameters

- `customerId` (`string`, required)
- `featureCode` (`string`, required)
- `count` (`number`, required)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`SeatEvent`
