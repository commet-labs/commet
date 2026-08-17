# already_has_active_subscription

The customer already has a draft, trialing, active, or past-due subscription that blocks creating another subscription.

- **Error type:** `conflict_error`
- **`code`:** `already_has_active_subscription`
- **API version:** `2026-07-31`


## What to do

Inspect the existing subscription and continue, recover, cancel, or change it instead of creating a conflicting subscription.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Do not retry the same subscription creation request.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.