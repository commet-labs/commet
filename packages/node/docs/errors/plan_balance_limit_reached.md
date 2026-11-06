# plan_balance_limit_reached

The usage event would spend more plan balance than the plan's balance limit allows in the current day or week, and purchased balance does not cover the rest.

- **Error type:** `billing_error`
- **`code`:** `plan_balance_limit_reached`
- **API version:** `2026-08-27`


## What to do

Use the planBalanceLimit details to show what remains and when the window resets, or let the customer top up, which the limit never caps.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry after planBalanceLimit.resetsAt or once purchased balance covers the usage.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.