# subscription_activation_failed

The subscription was created or saved, but its initial activation or checkout could not be completed.

- **Error type:** `internal_error`
- **`code`:** `subscription_activation_failed`
- **API version:** `2026-07-31`


## What to do

Keep the request ID and inspect the subscription and checkout state before retrying.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Preserve the Idempotency-Key. Retry only after confirming that repeating the activation will not create a second logical operation.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.