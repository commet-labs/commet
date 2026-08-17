# seat_limit_exceeded

The requested plan change would exceed the available seat limit.

- **Error type:** `billing_error`
- **`code`:** `seat_limit_exceeded`
- **API version:** `2026-07-31`


## What to do

Reduce assigned seats or choose a target plan that supports the current seat count.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry after the seat count or target plan changes.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.