# card_promotions_not_available

Card promotions are not available for this organization.

- **Error type:** `conflict_error`
- **`code`:** `card_promotions_not_available`
- **API version:** `2026-07-31`


## What to do

Remove the card-promotion selection or contact Commet if the organization is expected to have access.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry only after changing the selection or organization capability.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.