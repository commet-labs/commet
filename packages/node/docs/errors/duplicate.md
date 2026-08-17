# duplicate

The request conflicts with an existing resource, unique value, or previously recorded event.

- **Error type:** `conflict_error`
- **`code`:** `duplicate`
- **API version:** `2026-07-31`


## What to do

Read the response message to identify the duplicate. Reuse the existing resource or choose a unique value when a new resource is intended.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Do not retry the same request unchanged.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.