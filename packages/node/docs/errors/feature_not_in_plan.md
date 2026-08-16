# feature_not_in_plan

The requested feature is not included in the customer's plan or subscription.

- **Error type:** `billing_error`
- **`code`:** `feature_not_in_plan`
- **API version:** `2026-07-31`


## What to do

Attach the feature to the plan or use a plan that includes it before checking or recording usage.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry after the subscription includes the feature.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.