# no_change_requested

The request would not change the current subscription state.

- **Error type:** `validation_error`
- **`code`:** `no_change_requested`
- **API version:** `2026-07-31`


## What to do

Read the current subscription and submit only when a different plan, price, or configuration is intended.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Do not retry the unchanged request.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.