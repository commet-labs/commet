# unauthorized

The request does not contain a valid Commet API key.

- **Error type:** `authentication_error`
- **`code`:** `unauthorized`
- **API version:** `2026-07-31`


## What to do

Provide the correct key in the x-api-key header and verify that it belongs to the intended organization and mode.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Do not retry with the same missing or invalid credentials.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.