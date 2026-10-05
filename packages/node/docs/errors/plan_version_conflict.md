# plan_version_conflict

The draft revision, main version, or subscription adoption state changed before the operation completed.

- **Error type:** `conflict_error`
- **`code`:** `plan_version_conflict`
- **API version:** `2026-10-04`

## API versions

- Available since API version `2026-10-04`.


## What to do

Read the current version or adoption, reconcile the intended change, and submit its current revision and main version identifier.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Do not retry with stale revision or main-version values.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.