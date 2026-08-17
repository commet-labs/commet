# offer_not_applicable

The selected offer does not satisfy the eligibility or lifecycle conditions for this operation.

- **Error type:** `validation_error`
- **`code`:** `offer_not_applicable`
- **API version:** `2026-07-31`


## What to do

Use the response message to identify the failed condition, then choose an eligible offer or change the request context.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry only after the offer or eligibility context changes.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.