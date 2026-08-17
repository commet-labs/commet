# not_scheduled_for_cancellation

The subscription has no scheduled cancellation to remove.

- **Error type:** `conflict_error`
- **`code`:** `not_scheduled_for_cancellation`
- **API version:** `2026-07-31`


## What to do

Inspect the subscription state before attempting to undo a cancellation.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Do not retry unless a cancellation is scheduled first.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.