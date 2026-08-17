# plans_not_in_same_group

The current and target plans do not belong to the same plan group.

- **Error type:** `validation_error`
- **`code`:** `plans_not_in_same_group`
- **API version:** `2026-07-31`


## What to do

Choose a target plan in the subscription's plan group or use a supported replacement flow.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Do not retry with the same target plan.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.