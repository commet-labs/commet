# offer_not_found

The requested offer does not exist or is not compatible with the selected operation.

- **Error type:** `not_found_error`
- **`code`:** `offer_not_found`
- **API version:** `2026-07-31`


## What to do

Verify the offer ID, state, kind, and compatibility described by the response message.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry only with an existing compatible offer.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.