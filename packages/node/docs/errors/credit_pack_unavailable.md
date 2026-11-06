# credit_pack_unavailable

The subscription's plan version does not sell the credit pack.

- **Error type:** `conflict_error`
- **`code`:** `credit_pack_unavailable`
- **API version:** `2026-08-27`


## What to do

Buy a credit pack the version sells, or move the subscription to a version that sells it.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Do not retry with the same unavailable credit pack.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.