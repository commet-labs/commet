# payouts_not_available_in_sandbox

Payout operations are not available in sandbox mode.

- **Error type:** `authentication_error`
- **`code`:** `payouts_not_available_in_sandbox`
- **API version:** `2026-07-31`


## What to do

Use a live organization with payouts configured before creating payout resources or requesting a payout.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Do not retry while the organization remains in sandbox mode.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.