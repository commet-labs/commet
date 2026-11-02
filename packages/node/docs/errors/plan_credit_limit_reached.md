# plan_credit_limit_reached

The usage event would spend more plan credits than the plan's credit limit allows in the current day or week, and purchased credits do not cover the rest.

- **Error type:** `billing_error`
- **`code`:** `plan_credit_limit_reached`
- **API version:** `2026-08-27`


## What to do

Use the planCreditLimit details to show what remains and when the window resets, or let the customer buy credits, which the limit never caps.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry after planCreditLimit.resetsAt or once purchased credits cover the usage.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.