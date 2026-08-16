# addon_not_active

The add-on is not active on this subscription.

- **Error type:** `billing_error`
- **`code`:** `addon_not_active`
- **API version:** `2026-07-31`


## What to do

Verify the subscription add-ons before attempting to update or deactivate it.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry only after the add-on is active.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.