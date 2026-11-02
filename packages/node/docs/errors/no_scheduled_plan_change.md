# no_scheduled_plan_change

The subscription has no scheduled plan change to revoke.

- **Error type:** `conflict_error`
- **`code`:** `no_scheduled_plan_change`
- **API version:** `2026-08-27`


## What to do

Read the subscription's scheduledPlanChange before revoking a plan change.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Do not retry unless a plan change is scheduled first.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.