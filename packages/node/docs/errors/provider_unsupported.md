# provider_unsupported

The configured payment connection does not support the requested operation.

- **Error type:** `conflict_error`
- **`code`:** `provider_unsupported`
- **API version:** `2026-07-31`


## What to do

Configure or select a payment connection that provides the required capability.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry only after selecting a capable payment connection.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.