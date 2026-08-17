---
lastModified: 2026-07-31
title: MCP Server
description: Use the MCP Server to manage billing infrastructure.
---

## What is an MCP Server?

MCP is an open protocol that standardizes how applications provide context to LLMs. Among other benefits, it provides LLMs tools to act on your behalf.

## What can Commet's MCP Server do?

Commet's MCP server gives your AI agent native access to the full Commet platform through a single integration. You can manage all aspects of your billing infrastructure using natural language.

- **Organization** — See the live or sandbox organization fixed to the connection
- **Commet API** — Use every operation in the current public OpenAPI document
- **Docs** — Search the live Commet documentation

As an example, you could use this to create a full billing setup, manage plans and features, inspect customer subscriptions, or review invoices and usage data.

## Prerequisites

The MCP endpoint is the same for sandbox and live data:

```
https://commet.co/mcp/v2
```

OAuth opens Commet in the browser and asks you to choose one organization for the connection. The connection stays fixed to that organization even if you later switch organizations in the dashboard; reconnect to choose another one. API key authentication uses the exact sandbox or live organization that created the key. OAuth currently exposes the same API tools to owners, admins, and members.

To use it, you'll need to:

- [Create a Commet account](https://commet.co)
- Have an MCP-compatible client (Cursor, Claude Code, Claude Desktop, etc.)

> **Note**
>
> Browser-based clients can use OAuth with no API key. If your client runs in CI, on a server, or anywhere browser login is not possible, pass a Commet API key in the `x-api-key` header.

> **Warning**
>
> Switch to a sandbox organization when experimenting or setting up billing for the first time. Operations on a live organization affect real customers immediately.

## How to use the MCP Server

Choose your preferred client below.

### cursor

Open the command palette and choose "Cursor Settings" > "MCP" > "Add new global MCP server".

```json
{
  "mcpServers": {
    "commet": {
      "url": "https://commet.co/mcp/v2"
    }
  }
}
```

### claude-code

```bash
claude mcp add --transport http commet https://commet.co/mcp/v2
```

### claude-desktop

Open Claude Desktop settings > "Developer" tab > "Edit Config".

```json
{
  "mcpServers": {
    "commet": {
      "url": "https://commet.co/mcp/v2"
    }
  }
}
```

### codex

```bash
codex mcp add commet --url https://commet.co/mcp/v2
```

The command opens the browser for OAuth authentication. Once complete, verify with:

```bash
codex mcp list
```

### copilot

Add the following to your VS Code `settings.json`:

```json
{
  "mcp": {
    "servers": {
      "commet": {
        "type": "http",
        "url": "https://commet.co/mcp/v2"
      }
    }
  }
}
```

### gemini

Add the following to `~/.gemini/settings.json`:

```json
{
  "mcpServers": {
    "commet": {
      "httpUrl": "https://commet.co/mcp/v2"
    }
  }
}
```

### opencode

Add the following to `opencode.json`:

```json
{
  "mcp": {
    "commet": {
      "type": "remote",
      "url": "https://commet.co/mcp/v2"
    }
  }
}
```

### windsurf

```json
{
  "mcpServers": {
    "commet": {
      "serverUrl": "https://commet.co/mcp/v2"
    }
  }
}
```

### API key authentication

For clients that cannot open browser login, add an `x-api-key` header:

```bash
claude mcp add --transport http commet https://commet.co/mcp/v2 --header "x-api-key: ck_xxxxxxxxx"
```

For JSON-based clients:

```json
{
  "mcpServers": {
    "commet": {
      "url": "https://commet.co/mcp/v2",
      "headers": {
        "x-api-key": "ck_xxxxxxxxx"
      }
    }
  }
}
```

API-key sessions authenticate as the user who created the key and use the exact organization that created the key. A sandbox key can only act on its sandbox organization; a live key can only act on its live organization. Create the key from a sandbox organization when experimenting.

## Available Tools

MCP v2 exposes one generated tool for every operation in the current Commet OpenAPI document. The generated names use `api_` plus the operation ID in snake case:

```text
list-plans   → api_list_plans
create-plan  → api_create_plan
track-usage  → api_track_usage
```

Each generated tool groups its input the same way:

- `path` for URL parameters
- `query` for filters, cursors, and pagination
- `body` for the endpoint's exact OpenAPI request body
- `idempotencyKey` for optional POST, PUT, and PATCH idempotency

Generated tools always execute the latest API version published by Commet. They do not read or change an older API version pinned for the organization's SDKs.

The following Commet-specific tools remain available:

| Tool                       | Description                                            |
| -------------------------- | ------------------------------------------------------ |
| `get_current_organization` | Get the organization used by API tools                 |
| `search_docs`              | Search the live Commet documentation by semantic query |

The previous MCP endpoint remains available at `https://commet.co/mcp` with its original tools and behavior. New connections should use v2.

> **Warning**
>
> Before calling a write or delete tool, check `get_current_organization`. Operations on a live organization affect real customers and money immediately.
