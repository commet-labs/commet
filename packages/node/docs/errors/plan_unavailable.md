# plan_unavailable

The subscription's plan is no longer available for this operation.

- **Error type:** `conflict_error`
- **`code`:** `plan_unavailable`
- **API version:** `2026-07-31`


## What to do

Select an available plan or use a supported migration path for the subscription.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Do not retry with the same unavailable plan.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.