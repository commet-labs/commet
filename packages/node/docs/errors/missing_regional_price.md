# missing_regional_price

The plan, or the plan version a subscription is moving to, has no price for the subscription's currency or resolved market. A version move keeps the subscription's currency unless it asks to charge it in USD from its renewal; asking for another currency, or for USD when the version still sells what the subscription pays, is refused with this code, and what keeps a subscription in its currency has its own currency_held_by code.

- **Error type:** `billing_error`
- **`code`:** `missing_regional_price`
- **API version:** `2026-08-27`


## What to do

Configure the missing regional or currency price identified by the response, move the subscription to a version that sells its currency, or ask to charge it in USD from its renewal.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry after the required price is configured, with a version that sells the subscription's currency, or with currency usd when the version does not sell it.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.