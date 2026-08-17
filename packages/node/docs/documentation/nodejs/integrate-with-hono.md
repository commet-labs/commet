---
lastModified: 2026-07-28
title: Integrate with Hono
description: Add billing and payments to your Hono application.
---

Install the Commet Skill so your coding agent can integrate the current SDK and verify its work against the live API contract.

```bash
npx skills add commet-labs/skills --skill commet
```

1. ## Install
   ### pnpm
   ```bash
   pnpm add @commet/node hono
   ```
   ### npm
   ```bash
   npm install @commet/node hono
   ```
   ### bun
   ```bash
   bun add @commet/node hono
   ```

2. ## Configure
   ```bash title=".env"
   COMMET_API_KEY=ck_sandbox_xxx
   ```
   ```typescript title="src/commet.ts"
   import { Commet } from '@commet/node'

   export const commet = new Commet({
     apiKey: process.env.COMMET_API_KEY!,
   })
   ```

3. ## Subscribe
   ```typescript title="src/routes/billing.ts"
   import { Hono } from 'hono'
   import { commet } from '../commet'

   const billing = new Hono()

   billing.post('/subscribe', async (c) => {
     const { customerId, email } = await c.req.json()

     await commet.customers.create({ email, id: customerId })

     const subscription = await commet.subscriptions.create({
       customerId,
       planCode: 'pro',
     })

     return c.json({ checkoutUrl: subscription.checkoutUrl ?? null })
   })

   export default billing
   ```

4. ## Check Access
   ```typescript title="src/routes/billing.ts"
   billing.get('/subscription/:customerId', async (c) => {
     const subscription = await commet.subscriptions.getActive({ customerId: c.req.param('customerId') })

     if (!subscription) {
       return c.json({ error: 'no_active_subscription' }, 404)
     }

     return c.json({ status: subscription.status })
   })

   billing.get('/features/:feature/:customerId', async (c) => {
     const access = await commet.featureAccess.get({
       code: c.req.param('feature'),
       customerId: c.req.param('customerId'),
     })

     return c.json({ allowed: access.allowed })
   })
   ```

5. ## Track Usage
   ```typescript title="src/routes/billing.ts"
   billing.post('/usage', async (c) => {
     const { customerId } = await c.req.json()

     await commet.usage.track({
       customerId,
       featureCode: 'api_calls',
       value: 1,
     })

     return c.json({ tracked: true })
   })
   ```
   Usage is aggregated and billed at end of period.

6. ## Customer Portal
   ```typescript title="src/routes/billing.ts"
   billing.get('/portal', async (c) => {
     const customerId = c.get('customerId')

     const portal = await commet.portal.getUrl({ customerId })

     return c.redirect(portal.portalUrl)
   })
   ```

7. ## Start Server
   ### Node.js
   ```typescript title="src/index.ts"
   import { serve } from '@hono/node-server'
   import { Hono } from 'hono'
   import billing from './routes/billing'

   const app = new Hono()

   app.route('/billing', billing)

   serve({ fetch: app.fetch, port: 3000 })
   ```
   ### Bun
   ```typescript title="src/index.ts"
   import { Hono } from 'hono'
   import billing from './routes/billing'

   const app = new Hono()

   app.route('/billing', billing)

   export default app
   ```

## Related

- [Subscriptions](/docs/manage-subscriptions)
- [Track Usage](/docs/track-usage)
- [Customer Portal](/docs/customer-portal)
- [SDK Reference](/docs/sdk-reference)
