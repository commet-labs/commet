# forbidden

The caller is authenticated but cannot perform this operation in the current organization or state.

- **Error type:** `authentication_error`
- **`code`:** `forbidden`
- **API version:** `2026-07-31`


## What to do

Use the response message to identify the missing permission or capability, then change the caller or organization configuration.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry only after the required access or capability changes.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.