# plan_version_not_found

The requested plan version does not exist, is not published, or belongs to another plan.

- **Error type:** `not_found_error`
- **`code`:** `plan_version_not_found`
- **API version:** `2026-08-27`


## What to do

List the plan's versions with GET /plans/{id}/versions and use one of their IDs.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry only with a published version of the same plan.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.