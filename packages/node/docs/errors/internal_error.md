# internal_error

Platform could not complete the operation because an internal execution path or dependency failed.

- **Error type:** `internal_error`
- **`code`:** `internal_error`
- **API version:** `2026-07-31`


## What to do

Keep the x-request-id and inspect the resource state before repeating a write. Contact support with the request ID if the failure persists.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry with bounded backoff. Preserve the Idempotency-Key for the same logical write unless the response explicitly requires a new key.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.