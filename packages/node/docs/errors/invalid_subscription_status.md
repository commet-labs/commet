# invalid_subscription_status

The subscription's current status is incompatible with the requested operation.

- **Error type:** `conflict_error`
- **`code`:** `invalid_subscription_status`
- **API version:** `2026-07-31`


## What to do

Use the response message to identify the accepted states, then choose the appropriate lifecycle action.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry only after the subscription enters an accepted state.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.