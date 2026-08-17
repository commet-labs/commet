# subscription_uncancel_failed

Platform could not remove the subscription's scheduled cancellation.

- **Error type:** `internal_error`
- **`code`:** `subscription_uncancel_failed`
- **API version:** `2026-07-31`


## What to do

Keep the request ID and read the current subscription state before attempting the operation again.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Preserve the Idempotency-Key and retry with bounded backoff if cancellation is still scheduled.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.