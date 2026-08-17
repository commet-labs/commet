# plan_group_not_found

The requested plan group does not exist in this organization.

- **Error type:** `not_found_error`
- **`code`:** `plan_group_not_found`
- **API version:** `2026-07-31`


## What to do

Verify the plan-group ID and organization.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry only with an existing plan group.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.