# organization_already_claimed

The organization has already completed its claim flow.

- **Error type:** `conflict_error`
- **`code`:** `organization_already_claimed`
- **API version:** `2026-07-31`


## What to do

Use the existing organization access instead of claiming it again.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Do not retry the same claim request.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.