# validation_error

The request failed validation. The response message, param, and details identify the invalid field, value, or field combination.

- **Error type:** `validation_error`
- **`code`:** `validation_error`
- **API version:** `2026-07-31`


## What to do

Correct the condition identified by the response before sending the request again.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry only after changing the invalid request.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.