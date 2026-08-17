# endpoint_deprecated

The endpoint has been retired and returns HTTP 410 Gone.

- **Error type:** `not_found_error`
- **`code`:** `endpoint_deprecated`
- **API version:** `2026-07-31`


## What to do

Follow the replacement operation or workflow identified by the response message.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Do not retry the deprecated endpoint.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.