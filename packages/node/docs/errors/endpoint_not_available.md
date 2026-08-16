# endpoint_not_available

This endpoint is not available in the resolved API version.

- **Error type:** `not_found_error`
- **`code`:** `endpoint_not_available`
- **API version:** `2026-07-31`


## What to do

Use an API version that contains the endpoint or migrate to the operation available in the pinned version.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Do not retry with the same endpoint and API version.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.