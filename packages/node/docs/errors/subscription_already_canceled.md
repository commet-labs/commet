# subscription_already_canceled

The subscription is already canceled.

- **Error type:** `conflict_error`
- **`code`:** `subscription_already_canceled`
- **API version:** `2026-07-31`


## What to do

Use a supported reactivation flow when the subscription is eligible instead of undoing a pending cancellation.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Do not retry the same uncancel request.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.