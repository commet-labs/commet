# currency_held_by_customer_credit

The customer holds credit in the currency the subscription pays, which applies only to invoices in that currency, so a version move cannot charge it in USD.

- **Error type:** `billing_error`
- **`code`:** `currency_held_by_customer_credit`
- **API version:** `2026-08-27`


## What to do

Keep the subscription on its version, or move it once that credit is used or revoked.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry with currency usd once the reason no longer applies; a scheduled move that meets it at renewal is canceled with this code as its reason.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.