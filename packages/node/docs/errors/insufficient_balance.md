# insufficient_balance

The operation cannot be charged against the available balance, or the required regional overage price is missing.

- **Error type:** `billing_error`
- **`code`:** `insufficient_balance`
- **API version:** `2026-07-31`


## What to do

Follow the operation-specific response message. Add balance, reduce the requested amount, or configure the missing regional price it identifies.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry only after correcting the balance or pricing condition identified by the response.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.