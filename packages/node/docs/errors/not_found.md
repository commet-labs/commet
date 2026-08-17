# not_found

The requested endpoint or resource could not be found in the current organization, mode, or API version.

- **Error type:** `not_found_error`
- **`code`:** `not_found`
- **API version:** `2026-07-31`


## What to do

Use the response message to identify the missing target, then verify its identifier and request context.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry only after correcting the target or context.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.