---
lastModified: 2026-08-16
title: Create an API Key
description: Create a sandbox key, keep it on your server, and rotate it without interrupting billing.
---

Your API key selects one Commet organization and environment. A sandbox key can only access sandbox data; a live key can only access live data.

## Create a sandbox key

1. Open your sandbox organization in the dashboard.
2. Go to **Settings → API Keys**.
3. Create a key with a name that identifies the application or environment.
4. Copy the key when it is shown and store it in your server's secret manager.

```bash title=".env.local"
COMMET_API_KEY=ck_sandbox_xxxxxxxxx
```

Commet does not show the full secret again. If it is lost, create a replacement and delete the old key after the new deployment is healthy.

## Initialize the SDK on the server

```typescript
import { Commet } from "@commet/node"

export const commet = new Commet({
  apiKey: process.env.COMMET_API_KEY,
})
```

Never expose the key in browser code, public environment variables, logs, screenshots, or agent prompts. Requests sent directly to the REST API authenticate with the `x-api-key` header.

## Use separate keys per environment

Keep sandbox and live credentials in different deployment environments. A safe promotion flow is:

1. Build and test with the sandbox key.
2. Verify checkout, webhooks, and a renewal with the [Test Clock](/docs/testing-sandbox).
3. Add a live key to the production secret store.
4. Deploy without copying sandbox IDs into live configuration.

## Rotate a key

Create the replacement first, deploy it, verify successful requests, and only then delete the previous key. Keys can also be managed through the generated [API Keys reference](/docs/api-reference/api-keys/list-api-keys).

Use one key per workload when you need independent rotation or audit boundaries. Do not reuse a developer's local key in production.
