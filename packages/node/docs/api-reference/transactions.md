# Transactions

API version: `2026-07-31`

## refund

`commet.transactions.refund(params, options?)`

`POST /transactions/{id}/refund` · operation `refund-transaction`

Issue a full refund and return the provider-neutral refund resource with its actual status.

### Parameters

- `id` (`string`, required)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`Refund`

## retry

`commet.transactions.retry(params, options?)`

`POST /transactions/{id}/retry` · operation `retry-transaction`

Retry a failed subscription renewal and return an honest retry result. The original failed transaction remains immutable.

### Parameters

- `id` (`string`, required)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`TransactionRetry`

## get

`commet.transactions.get(params)`

`GET /transactions/{id}` · operation `get-transaction`

Retrieve a single payment transaction by its public ID, including provider details.

### Parameters

- `id` (`string`, required)

### Returns

`Transaction`

## list

`commet.transactions.list(params?)`

`GET /transactions` · operation `list-transactions`

List payment transactions with cursor-based pagination. Filter by status or customer email.

### Parameters

- `cursor` (`string`, optional)
- `limit` (`number`, optional)
- `status` (`TransactionStatus`, optional)
- `customerEmail` (`string`, optional)

### Returns

`{ object: "list"; data: Array<TransactionListItem>; hasMore: boolean; nextCursor?: string }`
