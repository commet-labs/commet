# charge_failed

The charge required by the subscription operation failed.

- **Error type:** `billing_error`
- **`code`:** `charge_failed`
- **API version:** `2026-07-31`


## What to do

Use the response message and decline information to resolve the payment failure.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry only after changing the payment conditions or when the response indicates that another attempt is appropriate.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.