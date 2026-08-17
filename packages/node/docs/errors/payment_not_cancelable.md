# payment_not_cancelable

The payment's current state does not allow cancellation.

- **Error type:** `conflict_error`
- **`code`:** `payment_not_cancelable`
- **API version:** `2026-07-31`


## What to do

Inspect the payment status and use the operation supported for its current state.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry only if the payment later enters a cancelable state.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.