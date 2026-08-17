# subscription_not_active

The subscription status does not permit the requested operation.

- **Error type:** `conflict_error`
- **`code`:** `subscription_not_active`
- **API version:** `2026-07-31`


## What to do

Read the current subscription status and use the lifecycle operation supported for that state.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry only after the subscription enters an eligible state.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.