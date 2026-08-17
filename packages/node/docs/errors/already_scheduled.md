# already_scheduled

The requested subscription action is already scheduled.

- **Error type:** `conflict_error`
- **`code`:** `already_scheduled`
- **API version:** `2026-07-31`


## What to do

Read the subscription's current schedule instead of creating the same schedule again.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Do not retry while the existing schedule remains active.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.