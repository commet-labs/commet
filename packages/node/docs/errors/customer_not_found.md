# customer_not_found

The requested customer does not exist in this organization.

- **Error type:** `not_found_error`
- **`code`:** `customer_not_found`
- **API version:** `2026-07-31`


## What to do

Verify the customer identifier and the sandbox or live organization used by the API key.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry only with an existing customer in the same request context.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.