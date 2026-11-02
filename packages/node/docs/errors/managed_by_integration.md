# managed_by_integration

The record is managed by an integration (its managedBy field), so its terms change only in that integration.

- **Error type:** `conflict_error`
- **`code`:** `managed_by_integration`
- **API version:** `2026-08-27`


## What to do

Make the change in the integration, such as Dub. Here you can still rename an Offer and activate or deactivate a promo code.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Do not retry the same change; it is rejected while the integration manages the record.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.