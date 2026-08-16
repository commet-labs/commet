# missing_regional_price

The plan has no price for the subscription's currency or resolved market.

- **Error type:** `billing_error`
- **`code`:** `missing_regional_price`
- **API version:** `2026-07-31`


## What to do

Configure the missing regional or currency price identified by the response.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry after the required price is configured.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.