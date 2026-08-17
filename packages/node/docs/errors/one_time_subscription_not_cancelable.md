# one_time_subscription_not_cancelable

A one-time subscription cannot be canceled as a recurring subscription.

- **Error type:** `conflict_error`
- **`code`:** `one_time_subscription_not_cancelable`
- **API version:** `2026-07-31`


## What to do

Do not use the subscription cancellation endpoint for a one-time purchase.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Do not retry this cancellation request.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.