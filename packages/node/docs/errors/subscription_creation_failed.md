# subscription_creation_failed

Platform could not complete subscription creation.

- **Error type:** `internal_error`
- **`code`:** `subscription_creation_failed`
- **API version:** `2026-07-31`


## What to do

Keep the request ID and inspect the response message before deciding whether the operation can be repeated.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

For the same logical write, preserve the Idempotency-Key and retry with bounded backoff unless the response requires a corrected request.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.