# model_not_found

The requested AI model does not exist in the current model catalog.

- **Error type:** `not_found_error`
- **`code`:** `model_not_found`
- **API version:** `2026-07-31`


## What to do

Verify the model identifier and select a model available in the catalog.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry only with an available model.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.