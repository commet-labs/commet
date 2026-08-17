# insufficient_credits

The subscription does not have enough credits for the usage event.

- **Error type:** `billing_error`
- **`code`:** `insufficient_credits`
- **API version:** `2026-07-31`


## What to do

Add credits, activate a credit pack, or reduce the requested usage according to the response details.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry after sufficient credits are available.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.