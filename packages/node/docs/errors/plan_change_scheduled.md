# plan_change_scheduled

The requested plan change takes effect at the end of the current billing period instead of being prorated immediately.

- **Error type:** `validation_error`
- **`code`:** `plan_change_scheduled`
- **API version:** `2026-07-31`


## What to do

Use the change-plan endpoint to schedule the change and inspect the returned schedule.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Do not retry the preview as an immediate prorated change.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.