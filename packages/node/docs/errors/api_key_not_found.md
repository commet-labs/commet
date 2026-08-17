# api_key_not_found

The requested API key does not exist in this organization.

- **Error type:** `not_found_error`
- **`code`:** `api_key_not_found`
- **API version:** `2026-07-31`


## What to do

Verify the API-key ID and organization.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry only with an existing API key.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.