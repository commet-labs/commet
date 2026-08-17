# rate_limited

The caller exceeded the request allowance for the current window.

- **Error type:** `rate_limit_error`
- **`code`:** `rate_limited`
- **API version:** `2026-07-31`


## What to do

Read Retry-After and the RateLimit-* response headers, then reduce request concurrency when necessary.

The response `message`, `param`, and `details` fields describe the condition observed by the specific operation.

## Retry behavior

Retry after the Retry-After interval. Do not automatically retry a 429 response that omits Retry-After.

## Correlate the request

Keep the `x-request-id` response header when reporting or investigating this error. Platform records the same identifier in its request event, so Commet can locate the exact execution without customer data or credentials.