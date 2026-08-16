# idempotency_unavailable

Platform could not safely establish, release, or persist the idempotent response for this operation.

- **Error type:** `internal_error`
- **`code`:** `idempotency_unavailable`
- **API version:** `2026-07-31`


## What to do

Follow the response message exactly because it indicates whether the same key or a new key is required. Keep the request ID when the outcome is ambiguous.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry only as instructed by the response message; choosing the wrong key can repeat a completed operation.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.