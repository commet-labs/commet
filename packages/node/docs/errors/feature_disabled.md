# feature_disabled

The requested feature is disabled for the customer's subscription.

- **Error type:** `billing_error`
- **`code`:** `feature_disabled`
- **API version:** `2026-07-31`


## What to do

Enable the feature through the plan or subscription configuration before using it.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry after the feature is enabled.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.