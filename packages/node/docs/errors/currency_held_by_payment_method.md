# currency_held_by_payment_method

The subscription pays through a provider that cannot charge it in USD (dLocal: Mercado Pago, Pix, OXXO or a card), so a version move cannot charge it in USD.

- **Error type:** `billing_error`
- **`code`:** `currency_held_by_payment_method`
- **API version:** `2026-08-27`


## What to do

Keep the subscription on its version, or move it once it pays with a method that can be charged in USD.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry with currency usd once the reason no longer applies; a scheduled move that meets it at renewal is canceled with this code as its reason.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.