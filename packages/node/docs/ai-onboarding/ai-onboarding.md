---
lastModified: 2026-08-16
title: AI Onboarding
description: Give an AI agent the product knowledge, tools, environment, and safety boundaries it needs to implement Commet.
---

An agent needs two kinds of context to work with Commet: curated knowledge that explains billing behavior, and versioned contracts that define exact operations. Give it both instead of asking it to infer business rules from API schemas.

## Choose how the organization is created

### Human-first

Create an account at [commet.co](https://commet.co), open the sandbox organization, and create an API key under **Settings → API Keys**. Use OAuth when the agent's MCP client can open a browser; use the sandbox API key for headless clients.

### Agent-first

A headless agent can provision paired live and sandbox organizations before a human signs in:

```bash
curl -X POST https://commet.co/api/v1/provision \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: 3f5ebf70-8afd-4fc0-ae6e-6eaf0f647c91" \
  -d '{"name":"Acme","country":"US","businessType":"company"}'
```

The response contains one live key, one sandbox key, and a claim URL. Store the keys immediately, use sandbox for implementation, and give the claim URL to the human owner. Repeating the same UUID and body returns the same result; reusing it with another body fails.

## Connect the MCP server

Use the hosted endpoint:

```json
{
  "mcpServers": {
    "commet": {
      "url": "https://commet.co/mcp/v2"
    }
  }
}
```

OAuth fixes an interactive connection to the organization selected in the browser. An `x-api-key` connection is fixed to the key's organization. Always confirm whether that organization is sandbox or live before a write.

MCP v2 generates one `api_*` tool per current OpenAPI operation and also exposes documentation search. See [MCP Server](/docs/mcp-server) for client-specific configuration.

## Give the agent the right documentation

Use the smallest source that answers the task:

1. `node_modules/@commet/node/docs/README.md` for the API that matches the installed SDK version.
2. [Documentation index](https://commet.co/docs/llms.txt) to discover the right curated concept or business rule.
3. Append `.md` to a page URL for focused Markdown, such as `https://commet.co/docs/how-does-billing-work.md`.
4. [Full documentation](https://commet.co/docs/llms-full.txt) only when the task genuinely needs the complete curated corpus.
5. [OpenAPI](https://commet.co/openapi.json) and generated API Reference for the exact current platform contract.

Installed SDK docs are version-matched. The curated Documentation explains how dashboard and API work together. The Knowledge Base defines business rules. API Reference and Webhooks define the current generated contracts.

Prepare an existing repository with a managed, reversible block in `AGENTS.md`:

```bash
commet agents setup
commet agents setup --check --output agent
```

Then validate the local integration without changing files, contacting Commet, or printing secret values:

```bash
commet doctor --output agent
```

`@commet/next`, `@commet/ai-sdk`, and `@commet/better-auth` keep their integration-specific guidance in their package READMEs and share the Node SDK contract above.

## Install billing skills

```bash
npx skills add commet-labs/skills
```

Skills provide task-specific instructions for SDK integration, billing behavior, webhooks, CLI workflows, and AI billing. Universal pricing and subscription knowledge is available from the standalone packages listed in [Commet Skills](/docs/commet-skill).

## Use a safe implementation loop

1. Ask the agent to identify the billing model and the customer-visible outcome.
2. Configure or inspect the catalog in sandbox.
3. Implement one canonical flow with stable customer IDs and idempotency keys.
4. Confirm asynchronous outcomes from signed webhooks, not redirects.
5. Advance the Test Clock and verify renewal, failure, and recovery.
6. Review every intended live mutation before changing credentials.

Start with [Choose a Billing Model](/docs/choose-a-billing-model) and the runnable [Examples](/docs/examples).
