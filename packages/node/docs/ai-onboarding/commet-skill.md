---
lastModified: 2026-07-31
title: Commet Skills
description: Give AI agents expert-level billing knowledge with Agent Skills.
---

Agent Skills give AI agents modular billing capabilities — SDK integration, pricing models, subscription patterns, and billing best practices. Install all skills with a single command.

## Install all skills

```bash
npx skills add commet-labs/skills
```

## Install a single skill

```bash
npx skills add commet-labs/skills --skill commet
npx skills add commet-labs/skills --skill ai-billing
npx skills add commet-labs/skills --skill billing-behaviors
npx skills add commet-labs/skills --skill commet-webhooks
npx skills add commet-labs/skills --skill commet-cli
npx skills add commet-labs/skills --skill migrate-commet-v7-to-v8
npx skills add commet-labs/skills --skill migrate-commet-v8-to-v9
```

## Available skills

| Skill                     | Description                                                                               |
| ------------------------- | ----------------------------------------------------------------------------------------- |
| `commet`                  | Core SDK — @commet/node, @commet/next, @commet/ai-sdk, @commet/better-auth                |
| `billing-behaviors`       | Business rules — proration, plan changes, subscription lifecycle                          |
| `commet-cli`              | CLI — config-as-code: pull and push `commet.config.ts` with `commet pull` / `commet push` |
| `commet-webhooks`         | Webhooks — event handling, signature verification, framework handlers                     |
| `ai-billing`              | AI billing — tracked() middleware, balance model, cost calculation                        |
| `migrate-commet-v7-to-v8` | Migration — upgrade SDK v7 and API `2026-07-11` integrations to v8 and `2026-07-24`       |
| `migrate-commet-v8-to-v9` | Migration — upgrade v8 Offers and Markets to SDK v9 and API `2026-07-31`                  |

## Standalone skills

Universal billing knowledge that works with any stack. Code examples use `@commet/node`.

```bash
npx skills add commet-labs/billing-best-practices
npx skills add commet-labs/pricing-models
npx skills add commet-labs/subscription-patterns
```

## Supported agents

Claude Code, Cursor, Codex, Gemini CLI, GitHub Copilot, Windsurf, OpenCode, and 40+ more.

## Learn More

- [**commet-labs/skills on skills.sh**](https://skills.sh/commet-labs/skills)
- [**billing-best-practices**](https://skills.sh/commet-labs/billing-best-practices)
- [**pricing-models**](https://skills.sh/commet-labs/pricing-models)
- [**subscription-patterns**](https://skills.sh/commet-labs/subscription-patterns)
