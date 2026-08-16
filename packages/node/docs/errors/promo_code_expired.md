# promo_code_expired

The promo code is no longer within its valid redemption period.

- **Error type:** `conflict_error`
- **`code`:** `promo_code_expired`
- **API version:** `2026-07-31`


## What to do

Use another active and eligible promo code.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Do not retry with the expired promo code.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.