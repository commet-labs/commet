# version_not_newer

Subscriptions move only to a newer version than the one they are on. A subscription on a running experiment moves only to a later version of the same experiment until the experiment is archived or made current.

- **Error type:** `validation_error`
- **`code`:** `version_not_newer`
- **API version:** `2026-08-27`


## What to do

Choose a newer version of the plan, or archive or make current the experiment first.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Do not retry the same move.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.