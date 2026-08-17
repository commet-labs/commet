# claim_not_pending

The organization has no pending claim to complete.

- **Error type:** `not_found_error`
- **`code`:** `claim_not_pending`
- **API version:** `2026-07-31`


## What to do

Verify the organization state and initiate the required provisioning flow before requesting a claim link.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry only after the organization has a pending claim.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.