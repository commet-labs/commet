# no_active_subscription

The customer has no subscription that is active for this operation.

- **Error type:** `not_found_error`
- **`code`:** `no_active_subscription`
- **API version:** `2026-07-31`


## What to do

Inspect the customer's subscriptions and create, activate, or recover the appropriate subscription.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry only after an eligible subscription exists.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.