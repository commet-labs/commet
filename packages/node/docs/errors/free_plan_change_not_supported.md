# free_plan_change_not_supported

This plan-change operation does not support the selected free plan.

- **Error type:** `validation_error`
- **`code`:** `free_plan_change_not_supported`
- **API version:** `2026-07-31`


## What to do

Use the supported subscription flow for moving to or from a free plan.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Do not retry the same plan-change request.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.