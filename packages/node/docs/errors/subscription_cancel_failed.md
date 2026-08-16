# subscription_cancel_failed

Platform could not complete subscription cancellation.

- **Error type:** `internal_error`
- **`code`:** `subscription_cancel_failed`
- **API version:** `2026-07-31`


## What to do

Keep the request ID and read the current subscription state before attempting the cancellation again.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Preserve the Idempotency-Key and retry with bounded backoff if the subscription is still cancelable.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.