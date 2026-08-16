# addon_already_active

The add-on is already active on this subscription.

- **Error type:** `conflict_error`
- **`code`:** `addon_already_active`
- **API version:** `2026-07-31`


## What to do

Read the existing subscription add-on instead of activating it again.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Do not retry while the add-on remains active.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.