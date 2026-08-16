# subscription_required

The requested operation requires a chargeable subscription.

- **Error type:** `conflict_error`
- **`code`:** `subscription_required`
- **API version:** `2026-07-31`


## What to do

Create or select the subscription required by the operation before continuing.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry after the required subscription exists.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.