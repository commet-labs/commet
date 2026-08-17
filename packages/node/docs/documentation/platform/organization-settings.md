---
lastModified: 2026-08-16
title: Organization Settings
description: Configure the organization identity, customer emails, notification recipient, language, and environment boundaries.
---

An organization is an isolated billing environment. Its customers, catalog, API keys, providers, transactions, and webhooks do not cross into another organization.

## Sandbox and live

Every live organization has a paired sandbox for development. Switch organizations from the dashboard header and confirm the environment before creating catalog data or API keys. IDs created in sandbox are not valid in live.

## Identity and URLs

Under **Settings → Organization**, configure the visible name, logo, and slug. The slug identifies dashboard and hosted-page URLs; changing it does not change customer or subscription IDs.

## Customer communication

Choose whether Commet sends transactional emails for payments, invoices, and subscription changes. When disabled, Commet sends no customer transactional email; your application must send its own messages from the corresponding webhooks.

Set the email language and the internal notification recipient separately. The notification recipient receives important organization alerts and does not replace customer billing email addresses.

## Archive an organization

Only an owner can archive an organization. Archiving a live organization also archives every sandbox under it, removes access, releases its slug, and removes its custom and email domains. Billing records are retained for compliance, but you cannot access them afterward and the action is irreversible.

Export required records and disconnect workloads first. Do not archive an organization to clear test data; use a sandbox instead.

API keys and most organization settings are environment-specific. See [Create an API Key](/docs/create-api-key) and [Testing](/docs/testing-sandbox).
