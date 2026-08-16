# invalid_json

The request body is not valid JSON.

- **Error type:** `validation_error`
- **`code`:** `invalid_json`
- **API version:** `2026-07-31`


## What to do

Encode the body as valid JSON and send it with the expected content type.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry only after correcting the request body.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.