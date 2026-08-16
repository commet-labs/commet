# price_not_found

The requested price does not exist on the selected plan or no price matches the operation.

- **Error type:** `not_found_error`
- **`code`:** `price_not_found`
- **API version:** `2026-07-31`


## What to do

Verify the price ID and plan, or configure a price for the requested billing context.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry only with an existing matching price.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.