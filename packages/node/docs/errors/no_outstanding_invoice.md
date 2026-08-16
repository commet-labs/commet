# no_outstanding_invoice

The subscription has no outstanding invoice to charge or recover.

- **Error type:** `conflict_error`
- **`code`:** `no_outstanding_invoice`
- **API version:** `2026-07-31`


## What to do

Read the current invoices and subscription state before requesting another payment attempt.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Do not retry unless an outstanding invoice exists.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.