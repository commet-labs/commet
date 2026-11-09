# subscribers_do_not_fit

Some subscribers of earlier versions do not fit the version being published, so nothing was published and nobody moved.

- **Error type:** `conflict_error`
- **`code`:** `subscribers_do_not_fit`
- **API version:** `2026-08-27`


## What to do

Read details.conflicts: for each subscriber, send a change that makes it fit (an interval, seats at the limit or add-ons to remove), keep it on its version, or publish without moving subscribers.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry with the changes; the same request fails the same way.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.