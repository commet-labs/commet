# addon_unavailable

The plan version the subscription is on, or is moving to, does not sell the add-on.

- **Error type:** `conflict_error`
- **`code`:** `addon_unavailable`
- **API version:** `2026-08-27`


## What to do

Activate an add-on the version sells, move the subscription to a version that sells it, or deactivate the add-on before moving the subscription.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Do not retry with the same add-on and version.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.