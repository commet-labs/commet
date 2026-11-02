# customer_deleted

The externalId belongs to a deleted customer, so the plan group's default plan cannot start for it.

- **Error type:** `conflict_error`
- **`code`:** `customer_deleted`
- **API version:** `2026-08-27`


## What to do

Create the customer with a different externalId, or send the request without planGroupId.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Do not retry the same request.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.