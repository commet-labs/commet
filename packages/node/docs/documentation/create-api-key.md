---
lastModified: 2026-09-25
title: Create an API Key
description: Create a sandbox API key from the dashboard, CLI, or MCP, store it on your server, and rotate it safely.
---

An API key gives your server access to one Commet organization. Start with a **sandbox organization** while building your integration.

New full-access keys start with `ck_sandbox_` or `ck_live_`; new restricted keys start with `rk_sandbox_` or `rk_live_`. Existing `ck_` keys remain valid. The organization that created the key determines which data it can reach. Both environments use `https://commet.co/api/v1`.

## Create a key

Choose the path that fits where you are working. You only need one to get started.

### Dashboard

1. Select your **sandbox organization** in the dashboard.
2. Go to **Settings → API Keys** and click **Create API Key**.
3. Choose **Full Access** for a backend or **AI Agents** to select resource permissions.
4. Enter a descriptive name, such as `Local development`, and choose **Expires In (Days)**. The dashboard accepts **1–365 days** and defaults to **365**.
5. Create the key and copy it before closing the dialog. The full secret is shown only once.

### CLI

Install the [Commet CLI](/docs/cli), sign in through your browser, and link the project to your sandbox organization:

```bash
npm install -g commet
commet login
commet link
```

Choose the organization marked **sandbox**. Linking a new organization generates a key for CLI resource commands and saves it in `.commet/config.json`. The CLI adds `.commet/` to `.gitignore`. Keep that directory private.

This configures the CLI; it does **not** set `COMMET_API_KEY` for your application. To create a separate application key after linking:

```bash
commet api-keys create --name "Local development" --expires-in-days 365
```

Save the returned `apiKey` as described below. Resource commands use `COMMET_API_KEY` from the environment before the linked project's key, so check which credential is active before creating or deleting keys.

### MCP

Connect your agent to the [Commet MCP server](/docs/mcp-server) at `https://commet.co/mcp/v2`. With OAuth, you can sign in through your browser and select a **sandbox organization** without an existing API key. The connection stays fixed to that organization.

Ask the agent to create an application key using `api_create_api_key` with these arguments:

```json
{
  "body": {
    "name": "Local development",
    "expiresInDays": 365
  }
}
```

The response contains the full secret only once. Have the agent store it directly in the intended local secret file or secret manager when your tools support that. Do not paste an existing secret into the conversation or ask the agent to repeat it in a message.

Already authenticating with a full-access API key? You can create replacements with `POST /api/v1/api-keys`. That request creates another key for the same organization. See [Create API key](/docs/api-reference/api-keys/create-api-key) for the request and response.

## Limit key permissions

Leave `permissions` out to create a full-access key. Provide resource grants to create a restricted key. For example, a key with `customer: ["read"]` can read customers but cannot change them. Write access requires both `"read"` and `"write"`. An empty object (`{}`) grants no resource access.

A restricted key with `api_key: ["read", "write"]` can create restricted keys with the same or fewer permissions. These keys expire no later than the key that creates them. Restricted keys cannot edit or delete API keys.

```typescript
const key = await commet.apiKeys.create({
  name: "Customer reader",
  permissions: { customer: ["read"] },
})
```

The full secret is returned once. Save it in your secret store before leaving the response.

## Store the key on your server

For local development, save the key in a git-ignored environment file:

```bash title=".env.local"
COMMET_API_KEY=ck_replace_with_your_key
```

Load this variable into your server process using your framework's environment support. For production, use your deployment's secret store. Never expose the key in browser code, public environment variables, logs, screenshots, or source control.

Commet stores a hash of the key and cannot show the full secret again. If you lose it, create a replacement.

## Use the key in your SDK

For Node.js, install the SDK:

```bash
npm install @commet/node
```

Initialize it in server code after loading the environment:

```typescript
import { Commet } from "@commet/node"

const apiKey = process.env.COMMET_API_KEY
if (!apiKey) {
  throw new Error("COMMET_API_KEY is required")
}

export const commet = new Commet({ apiKey })
```

For other languages, follow the [Python](/docs/integrate-with-python), [Go](/docs/integrate-with-go), [Java](/docs/integrate-with-java), or [PHP](/docs/integrate-with-php) integration guide. Direct REST requests authenticate with the `x-api-key` header.

## Rotate and promote to live

Use a separate key for each application or deployment that needs independent rotation. To replace a key before it expires:

1. Create a replacement in the **same organization**.
2. Update the secret in every process using the old key and deploy or restart those processes.
3. Verify a successful read with the replacement and confirm the application is using it.
4. Delete the old key from **Settings → API Keys** or through [Delete API key](/docs/api-reference/api-keys/delete-api-key).

For production, create a key in your **live organization** and store it separately from sandbox credentials. Do not copy sandbox customer, plan, or subscription IDs into live configuration. Before switching, verify checkout, webhooks, and a renewal in sandbox with the [Test Clock](/docs/testing-sandbox).

Next, follow the [quickstart](/docs/choose-a-billing-model) to complete your first subscription payment in sandbox.
