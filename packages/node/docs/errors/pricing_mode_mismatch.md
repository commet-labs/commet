# pricing_mode_mismatch

The submitted usage shape does not match the feature's configured pricing mode.

- **Error type:** `billing_error`
- **`code`:** `pricing_mode_mismatch`
- **API version:** `2026-07-31`


## What to do

Send numeric usage for fixed pricing or model-token usage for AI model pricing, as identified by the response.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry after matching the request to the feature's pricing mode.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.