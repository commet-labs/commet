# Api Keys

API version: `2026-10-04`

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

Create a full-access or restricted API key. Provide permissions to restrict access; the full key is returned only once. A restricted key with api_key: write may only create restricted keys with the same or fewer permissions, and they expire no later than the key that creates them.

### Parameters

- `name` (`string`, required)
- `expiresInDays` (`number`, optional)
- `permissions` (`{ customer?: Array<"read"> | ["read", "write"] | ["write", "read"]; subscription?: Array<"read"> | ["read", "write"] | ["write", "read"]; invoice?: Array<"read"> | ["read", "write"] | ["write", "read"]; usage?: Array<"read"> | ["read", "write"] | ["write", "read"]; seat?: Array<"read"> | ["read", "write"] | ["write", "read"]; plan?: Array<"read"> | ["read", "write"] | ["write", "read"]; plan_group?: Array<"read"> | ["read", "write"] | ["write", "read"]; feature?: Array<"read"> | ["read", "write"] | ["write", "read"]; addon?: Array<"read"> | ["read", "write"] | ["write", "read"]; credit_pack?: Array<"read"> | ["read", "write"] | ["write", "read"]; offer?: Array<"read"> | ["read", "write"] | ["write", "read"]; promo_code?: Array<"read"> | ["read", "write"] | ["write", "read"]; market_group?: Array<"read"> | ["read", "write"] | ["write", "read"]; payment?: Array<"read"> | ["read", "write"] | ["write", "read"]; transaction?: Array<"read"> | ["read", "write"] | ["write", "read"]; payout?: Array<"read"> | ["read", "write"] | ["write", "read"]; test_clock?: Array<"read"> | ["read", "write"] | ["write", "read"]; organization?: Array<"read"> | ["read", "write"] | ["write", "read"]; api_key?: Array<"read"> | ["read", "write"] | ["write", "read"] }`, optional)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`CreatedApiKey`
