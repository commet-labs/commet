# charge_in_progress

A charge or payment retry is already running for the subscription.

- **Error type:** `conflict_error`
- **`code`:** `charge_in_progress`
- **API version:** `2026-07-31`


## What to do

Wait for the current attempt to finish and read the resulting subscription or invoice state.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry only after the in-progress attempt has completed.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.