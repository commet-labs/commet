# plan_experiment_not_found

The plan has no experiment with that code, or the plan belongs to another organization.

- **Error type:** `not_found_error`
- **`code`:** `plan_experiment_not_found`
- **API version:** `2026-08-27`


## What to do

List the plan's experiments with GET /plans/{id}/experiments and use one of their codes.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry only with an existing experiment code of the same plan.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.