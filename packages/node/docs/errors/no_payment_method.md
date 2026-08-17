# no_payment_method

The subscription has no reusable payment method for this operation.

- **Error type:** `conflict_error`
- **`code`:** `no_payment_method`
- **API version:** `2026-07-31`


## What to do

Collect or update the customer's payment method through the supported checkout or payment-method flow.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry after a usable payment method is attached.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.