# idempotency_in_progress

A request with this Idempotency-Key is still being processed.

- **Error type:** `conflict_error`
- **`code`:** `idempotency_in_progress`
- **API version:** `2026-07-31`


## What to do

Wait for the original request to finish before checking its result with the same key.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry the same request and key after a short delay.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.