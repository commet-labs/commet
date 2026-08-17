---
lastModified: 2026-07-28
title: Integrate with Astro
description: Add billing and payments to your Astro application.
---

Install the Commet Skill so your coding agent can integrate the current SDK and verify its work against the live API contract.

```bash
npx skills add commet-labs/skills --skill commet
```

> **Warning**
>
> Astro requires an SSR adapter for API routes. Set `output: 'server'` or `output: 'hybrid'` in your `astro.config.mjs`.

1. ## Install
   ### pnpm
   ```bash
   pnpm add @commet/node
   ```
   ### npm
   ```bash
   npm install @commet/node
   ```
   ### yarn
   ```bash
   yarn add @commet/node
   ```
   ### bun
   ```bash
   bun add @commet/node
   ```

2. ## Configure
   ```bash title=".env"
   COMMET_API_KEY=ck_sandbox_xxx
   ```
   ```typescript title="src/lib/commet.ts"
   import { Commet } from '@commet/node'

   export const commet = new Commet({
     apiKey: import.meta.env.COMMET_API_KEY,
   })
   ```

3. ## Subscribe
   `customers.create` is idempotent — if a customer with the same `id` already exists, it returns the existing record.
   ```typescript title="src/pages/api/billing/subscribe.ts"
   import type { APIRoute } from 'astro'
   import { commet } from '../../../lib/commet'

   export const POST: APIRoute = async ({ request }) => {
     const { customerId, email } = await request.json()

     await commet.customers.create({ email, id: customerId })

     const subscription = await commet.subscriptions.create({
       customerId,
       planCode: 'pro',
     })

     return Response.json({ checkoutUrl: subscription.checkoutUrl ?? null })
   }
   ```

4. ## Check Access
   ```typescript title="src/pages/api/billing/access/[customerId].ts"
   import type { APIRoute } from 'astro'
   import { commet } from '../../../../lib/commet'

   export const GET: APIRoute = async ({ params }) => {
     const subscription = await commet.subscriptions.getActive({ customerId: params.customerId! })

     if (!subscription) {
       return Response.json({ error: 'no_active_subscription' }, { status: 404 })
     }

     const feature = await commet.featureAccess.get({
       code: 'api_calls',
       customerId: params.customerId!,
     })

     return Response.json({
       status: subscription.status,
       allowed: feature.allowed,
     })
   }
   ```

5. ## Track Usage
   ```typescript title="src/pages/api/billing/usage.ts"
   import type { APIRoute } from 'astro'
   import { commet } from '../../../lib/commet'

   export const POST: APIRoute = async ({ request }) => {
     const { customerId } = await request.json()

     await commet.usage.track({
       customerId,
       featureCode: 'api_calls',
       value: 1,
     })

     return Response.json({ tracked: true })
   }
   ```
   Usage is aggregated and billed at end of period.

6. ## Customer Portal
   ```typescript title="src/pages/api/billing/portal.ts"
   import type { APIRoute } from 'astro'
   import { commet } from '../../../lib/commet'

   export const GET: APIRoute = async ({ redirect }) => {
     const customerId = 'user_123'

     const portal = await commet.portal.getUrl({ customerId })

     return redirect(portal.portalUrl)
   }
   ```

## Related

- [Subscriptions](/docs/manage-subscriptions)
- [Track Usage](/docs/track-usage)
- [Customer Portal](/docs/customer-portal)
- [SDK Reference](/docs/sdk-reference)
