# addon_has_activations

The add-on cannot be deleted while subscriptions use it.

- **Error type:** `conflict_error`
- **`code`:** `addon_has_activations`
- **API version:** `2026-07-31`


## What to do

Remove or migrate its active subscription assignments before deleting the add-on.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry after the add-on has no active assignments.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.