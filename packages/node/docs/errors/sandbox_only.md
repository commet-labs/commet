# sandbox_only

This operation is available only to sandbox organizations.

- **Error type:** `authentication_error`
- **`code`:** `sandbox_only`
- **API version:** `2026-07-31`


## What to do

Run the operation with a sandbox organization.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Do not retry against a live organization.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.