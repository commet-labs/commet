# feature_already_exists

A feature with the same code or name already exists, or the feature is already assigned where uniqueness is required.

- **Error type:** `conflict_error`
- **`code`:** `feature_already_exists`
- **API version:** `2026-07-31`


## What to do

Reuse the existing feature or choose a unique code, name, or assignment according to the response message.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Do not retry the duplicate request unchanged.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.