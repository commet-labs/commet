# feature_in_use

The feature cannot be deleted while a plan or add-on uses it.

- **Error type:** `conflict_error`
- **`code`:** `feature_in_use`
- **API version:** `2026-07-31`


## What to do

Remove the feature from active plans and add-ons before deleting it.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry after the feature is no longer referenced.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.