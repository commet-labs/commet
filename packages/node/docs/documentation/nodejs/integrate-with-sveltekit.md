---
lastModified: 2026-07-28
title: Integrate with SvelteKit
description: Add billing and payments to your SvelteKit application.
---

Install the Commet Skill so your coding agent can integrate the current SDK and verify its work against the live API contract.

```bash
npx skills add commet-labs/skills --skill commet
```

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
   ```typescript title="src/lib/server/commet.ts"
   import { Commet } from '@commet/node'
   import { COMMET_API_KEY } from '$env/static/private'

   export const commet = new Commet({
     apiKey: COMMET_API_KEY,
   })
   ```

3. ## Subscribe
   `customers.create` is idempotent — if a customer with the same `id` already exists, it returns the existing record.
   ```typescript title="src/routes/api/billing/subscribe/+server.ts"
   import { json } from '@sveltejs/kit'
   import { commet } from '$lib/server/commet'
   import type { RequestHandler } from './$types'

   export const POST: RequestHandler = async ({ request }) => {
     const { customerId, email } = await request.json()

     await commet.customers.create({ email, id: customerId })

     const subscription = await commet.subscriptions.create({
       customerId,
       planCode: 'pro',
     })

     return json({ checkoutUrl: subscription.checkoutUrl ?? null })
   }
   ```

4. ## Check Access
   ```typescript title="src/routes/api/billing/access/[customerId]/+server.ts"
   import { json } from '@sveltejs/kit'
   import { commet } from '$lib/server/commet'
   import type { RequestHandler } from './$types'

   export const GET: RequestHandler = async ({ params }) => {
     const subscription = await commet.subscriptions.getActive({ customerId: params.customerId })

     if (!subscription) {
       return json({ error: 'no_active_subscription' }, { status: 404 })
     }

     const feature = await commet.featureAccess.get({
       code: 'api_calls',
       customerId: params.customerId,
     })

     return json({ status: subscription.status, allowed: feature.allowed })
   }
   ```

5. ## Track Usage
   ```typescript title="src/routes/api/billing/usage/+server.ts"
   import { json } from '@sveltejs/kit'
   import { commet } from '$lib/server/commet'
   import type { RequestHandler } from './$types'

   export const POST: RequestHandler = async ({ request }) => {
     const { customerId } = await request.json()

     await commet.usage.track({
       customerId,
       featureCode: 'api_calls',
       value: 1,
     })

     return json({ tracked: true })
   }
   ```
   Usage is aggregated and billed at end of period.

6. ## Customer Portal
   ```typescript title="src/routes/api/billing/portal/+server.ts"
   import { redirect } from '@sveltejs/kit'
   import { commet } from '$lib/server/commet'
   import type { RequestHandler } from './$types'

   export const GET: RequestHandler = async ({ locals }) => {
     const portal = await commet.portal.getUrl({
       customerId: locals.user.customerId,
     })

     redirect(303, portal.portalUrl)
   }
   ```

## Related

- [Subscriptions](/docs/manage-subscriptions)
- [Track Usage](/docs/track-usage)
- [Customer Portal](/docs/customer-portal)
- [SDK Reference](/docs/sdk-reference)
