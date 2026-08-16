# insufficient_seats

The requested seat removal exceeds the subscription's available seat balance.

- **Error type:** `billing_error`
- **`code`:** `insufficient_seats`
- **API version:** `2026-07-31`


## What to do

Use the current balance from the response and request a removable seat quantity.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry with a quantity that does not exceed the current balance.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.