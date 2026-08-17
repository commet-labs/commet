# no_prices_configured

The selected plan has no price available for the request.

- **Error type:** `conflict_error`
- **`code`:** `no_prices_configured`
- **API version:** `2026-07-31`


## What to do

Configure a plan price that matches the requested currency, market, and billing context.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry after a matching price is configured.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.