# payment_method_not_found

The requested or required payment method could not be found.

- **Error type:** `not_found_error`
- **`code`:** `payment_method_not_found`
- **API version:** `2026-07-31`


## What to do

Collect a payment method or verify the payment-method identifier before continuing.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry after a usable payment method exists.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.