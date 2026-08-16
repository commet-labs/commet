# Api Keys

API version: `2026-07-31`

## delete

`commet.apiKeys.delete(params, options?)`

`DELETE /api-keys/{id}` · operation `delete-api-key`

Permanently revoke and delete an API key.

### Parameters

- `id` (`string`, required)

### Returns

`DeletedObject`

## list

`commet.apiKeys.list(params?)`

`GET /api-keys` · operation `list-api-keys`

List API keys with cursor-based pagination. Keys are returned without the full secret.

### Parameters

- `cursor` (`string`, optional)
- `limit` (`number`, optional)

### Returns

`{ object: "list"; data: Array<ApiKey>; hasMore: boolean; nextCursor?: string }`

## create

`commet.apiKeys.create(params, options?)`

`POST /api-keys` · operation `create-api-key`

Create a new API key. The full key is only returned once in the response.

### Parameters

- `name` (`string`, required)
- `expiresInDays` (`number`, optional)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`CreatedApiKey`
