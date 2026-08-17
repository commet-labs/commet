# feature_not_found

The requested feature, seat feature, or quota feature does not exist in this organization.

- **Error type:** `not_found_error`
- **`code`:** `feature_not_found`
- **API version:** `2026-07-31`


## What to do

Verify the feature code or identifier. Create the feature first when the response indicates that it is missing.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry only after using or creating a valid feature.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.