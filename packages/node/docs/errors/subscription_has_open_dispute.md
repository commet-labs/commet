# subscription_has_open_dispute

The subscription has an unresolved payment dispute that blocks the requested billing change.

- **Error type:** `internal_error`
- **`code`:** `subscription_has_open_dispute`
- **API version:** `2026-07-31`


## What to do

Inspect the disputed payment and wait until its dispute no longer blocks charges before changing or reactivating the subscription.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry only after the subscription no longer has an open payment dispute.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.