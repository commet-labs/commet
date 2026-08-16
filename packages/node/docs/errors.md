# Errors and request IDs

API failures throw `CommetAPIError`. Validation failures throw `CommetValidationError`, which is also a `CommetAPIError`.

```ts
import { CommetAPIError } from "@commet/node";

try {
  await commet.subscriptions.create(params, {
    idempotencyKey: "subscription:user_123:pro",
  });
} catch (error) {
  if (error instanceof CommetAPIError) {
    console.error(error.code);
    console.error(error.requestId);
    console.error(error.retryable);
    console.error(error.docUrl);
  }
}
```

Error fields:

- `type`: broad API error category.
- `code`: stable machine-readable error code.
- `message`: operation-specific explanation.
- `statusCode`: HTTP status.
- `param`: invalid request parameter when provided.
- `details`: structured diagnostic data when provided.
- `requestId`: exact `x-request-id` returned by Platform. It is absent if no server identifier was received and is never fabricated locally.
- `retryable`: whether Platform explicitly marked the failed idempotent write as safe to retry.
- `docUrl`: versioned Markdown reference for the error code.

`JSON.stringify(error)` serializes the fields above without adding stack traces, credentials, request headers, or request bodies. It preserves API-provided `details` because they are part of the public diagnostic contract.

Do not retry a write merely because its HTTP status is usually transient. Respect `retryable`, preserve the same idempotency key, and inspect the current resource state when the outcome is uncertain.
