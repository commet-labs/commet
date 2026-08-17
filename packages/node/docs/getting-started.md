# Getting started

Install the core SDK:

```bash
npm install @commet/node
```

Create one server-side client. Never expose an API key to browser code.

```ts
import { Commet } from "@commet/node";

const commet = new Commet({
  apiKey: process.env.COMMET_API_KEY,
});
```

The installed SDK sends the API version recorded in [`manifest.json`](./manifest.json). You can inspect the same value from code:

```ts
import { API_VERSION } from "@commet/node";

console.log(API_VERSION);
```

Every resource and method available in this release is generated from the versioned OpenAPI contract. Read the [generated API reference](./api-reference/index.md) instead of relying on remembered method names.

Before a mutation:

1. Confirm the organization and whether it is sandbox or live.
2. Use a stable idempotency key when the caller may repeat the same write.
3. Preserve the returned error code and request ID when diagnosing failures.

The local SDK and CLI never infer permission to mutate billing from documentation or agent setup.
