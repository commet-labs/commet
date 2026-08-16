# included_limit_reached

The requested usage exceeds the plan's included usage limit.

- **Error type:** `billing_error`
- **`code`:** `included_limit_reached`
- **API version:** `2026-07-31`


## What to do

Use the current, included, and remaining values from the response to reduce usage or enable an eligible overage path.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry only after capacity becomes available or the request is reduced.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.