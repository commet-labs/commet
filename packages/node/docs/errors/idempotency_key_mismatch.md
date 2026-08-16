# idempotency_key_mismatch

The Idempotency-Key was already used with a different request payload or operation.

- **Error type:** `conflict_error`
- **`code`:** `idempotency_key_mismatch`
- **API version:** `2026-07-31`


## What to do

Reuse the key only for the original logical request. Use a new key for a genuinely different operation.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Do not retry the different request with the conflicting key.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.