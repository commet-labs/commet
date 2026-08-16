# payment_failed

The operation could not complete its payment or required tax calculation.

- **Error type:** `billing_error`
- **`code`:** `payment_failed`
- **API version:** `2026-07-31`


## What to do

Follow the operation-specific response message and details to correct the payment method, provider condition, or tax calculation failure.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Do not loop on the same failure. Retry only when the response permits it or after correcting the reported condition.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.