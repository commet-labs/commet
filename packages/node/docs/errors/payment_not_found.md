# payment_not_found

The requested payment does not exist in this organization.

- **Error type:** `not_found_error`
- **`code`:** `payment_not_found`
- **API version:** `2026-07-31`


## What to do

Verify the payment ID, organization, and sandbox or live mode.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry only with an existing payment.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.