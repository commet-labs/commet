---
lastModified: 2026-08-16
title: SDK Reference
description: Configuration, environments, and pagination
---

## Setup

```typescript
import { Commet } from '@commet/node'

const commet = new Commet({
  apiKey: process.env.COMMET_API_KEY!,
})
```

Get your API key from the dashboard under **Settings → API Keys**.

The installed package includes version-matched agent documentation at `node_modules/@commet/node/docs/README.md`. Run `commet doctor --output agent` to check the local SDK and configuration without changing files or contacting Commet.

## Options

| Option       | Type    | Default                                   | Description                                                                                                         |
| ------------ | ------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `apiKey`     | string  | required                                  | Your API key (starts with `ck_`). The org that owns the key decides whether calls run against sandbox or live data. |
| `apiVersion` | string  | version the SDK release was built against | API version pin, sent as the `Commet-Version` header on every request. See [API versioning](/docs/api-versioning).  |
| `debug`      | boolean | `false`                                   | Log requests/responses                                                                                              |
| `timeout`    | number  | `30000`                                   | Request timeout (ms)                                                                                                |
| `retries`    | number  | `3`                                       | Max retry attempts                                                                                                  |
| `telemetry`  | boolean | `true`                                    | Send anonymous client info (SDK version, runtime, platform) with requests. Set to `false` to disable.               |

## Sandbox vs live

There is a single API host, `commet.co`. Use an API key created in a sandbox organization while integrating; swap it for a key from a live organization when you go to production. No code change beyond the environment variable.

## Debug Mode

See all requests and responses:

```typescript
const commet = new Commet({
  apiKey: process.env.COMMET_API_KEY!,
  debug: true,
})

// [Commet SDK] POST https://commet.co/api/v1/customers
// [Commet SDK] Response status: 200 OK
```

## Pagination

List endpoints use cursor-based pagination.

```typescript
const page = await commet.customers.list({ limit: 25 })

if (page.hasMore) {
  const nextPage = await commet.customers.list({ 
    limit: 25,
    cursor: page.nextCursor,
  })
}
```

| Parameter | Type   | Default | Description                   |
| --------- | ------ | ------- | ----------------------------- |
| `limit`   | number | 25      | Items per page (max 100)      |
| `cursor`  | string | -       | Cursor from previous response |
