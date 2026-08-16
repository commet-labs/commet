# market_in_use

The market cannot be deleted while a price or subscription uses it.

- **Error type:** `conflict_error`
- **`code`:** `market_in_use`
- **API version:** `2026-07-31`


## What to do

Remove or migrate the market's dependent prices and subscriptions.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry after the market is no longer referenced.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.