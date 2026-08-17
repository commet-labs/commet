---
lastModified: 2026-07-28
title: Integrate with Bun
description: Add billing and payments to your Bun application.
---

Install the Commet Skill so your coding agent can integrate the current SDK and verify its work against the live API contract.

```bash
npx skills add commet-labs/skills --skill commet
```

1. ## Install
   ```bash
   bun add @commet/node
   ```

2. ## Configure
   ```bash title=".env"
   COMMET_API_KEY=ck_sandbox_xxx
   ```
   ```typescript title="src/commet.ts"
   import { Commet } from '@commet/node'

   export const commet = new Commet({
     apiKey: Bun.env.COMMET_API_KEY!,
   })
   ```

3. ## Subscribe
   ```typescript title="src/index.ts"
   import { commet } from './commet'

   Bun.serve({
     port: 3000,
     async fetch(req) {
       const url = new URL(req.url)

       if (url.pathname === '/subscribe' && req.method === 'POST') {
         const { customerId, email } = await req.json()

         await commet.customers.create({ email, id: customerId })

         const subscription = await commet.subscriptions.create({
           customerId,
           planCode: 'pro',
         })

         return Response.json({ checkoutUrl: subscription.checkoutUrl ?? null })
       }

       return new Response('Not Found', { status: 404 })
     },
   })
   ```

4. ## Check Access
   Add these routes to the `fetch` handler.
   ```typescript title="src/index.ts"
   if (url.pathname.startsWith('/subscription/') && req.method === 'GET') {
     const customerId = url.pathname.split('/')[2]

     const subscription = await commet.subscriptions.getActive({ customerId })

     if (!subscription) {
       return Response.json({ error: 'no_active_subscription' }, { status: 404 })
     }

     return Response.json({ status: subscription.status })
   }

   if (url.pathname.startsWith('/features/') && req.method === 'GET') {
     const [, , feature, customerId] = url.pathname.split('/')

     const access = await commet.featureAccess.get({ code: feature, customerId })

     return Response.json({ allowed: access.allowed })
   }
   ```

5. ## Track Usage
   ```typescript title="src/index.ts"
   if (url.pathname === '/usage' && req.method === 'POST') {
     const { customerId } = await req.json()

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
   ```typescript title="src/index.ts"
   if (url.pathname === '/portal' && req.method === 'GET') {
     const customerId = url.searchParams.get('customerId')!

     const portal = await commet.portal.getUrl({ customerId })

     return Response.redirect(portal.portalUrl)
   }
   ```

## Related

- [Subscriptions](/docs/manage-subscriptions)
- [Track Usage](/docs/track-usage)
- [Customer Portal](/docs/customer-portal)
- [SDK Reference](/docs/sdk-reference)
