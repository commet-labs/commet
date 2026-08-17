---
lastModified: 2026-07-28
title: Integrate with Express
description: Add billing and payments to your Express application.
---

Install the Commet Skill so your coding agent can integrate the current SDK and verify its work against the live API contract.

```bash
npx skills add commet-labs/skills --skill commet
```

1. ## Install
   ### pnpm
   ```bash
   pnpm add @commet/node express
   ```
   ### npm
   ```bash
   npm install @commet/node express
   ```
   ### yarn
   ```bash
   yarn add @commet/node express
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
   import { Router } from 'express'
   import { commet } from '../commet'

   const router = Router()

   router.post('/subscribe', async (req, res) => {
     const { customerId, email } = req.body

     await commet.customers.create({ email, id: customerId })

     const subscription = await commet.subscriptions.create({
       customerId,
       planCode: 'pro',
     })

     res.json({ checkoutUrl: subscription.checkoutUrl ?? null })
   })

   export default router
   ```

4. ## Check Access
   ```typescript title="src/routes/billing.ts"
   router.get('/subscription/:customerId', async (req, res) => {
     const subscription = await commet.subscriptions.getActive({ customerId: req.params.customerId })

     if (!subscription) {
       return res.status(404).json({ error: 'no_active_subscription' })
     }

     res.json({ status: subscription.status })
   })

   router.get('/features/:feature/:customerId', async (req, res) => {
     const access = await commet.featureAccess.get({
       code: req.params.feature,
       customerId: req.params.customerId,
     })

     res.json({ allowed: access.allowed })
   })
   ```

5. ## Track Usage
   ```typescript title="src/routes/billing.ts"
   router.post('/usage', async (req, res) => {
     await commet.usage.track({
       customerId: req.body.customerId,
       featureCode: 'api_calls',
       value: 1,
     })

     res.json({ tracked: true })
   })
   ```
   Usage is aggregated and billed at end of period.

6. ## Customer Portal
   ```typescript title="src/routes/billing.ts"
   router.get('/portal', async (req, res) => {
     const portal = await commet.portal.getUrl({
       customerId: req.user.customerId,
     })

     res.redirect(portal.portalUrl)
   })
   ```

7. ## Start Server
   ```typescript title="src/index.ts"
   import express from 'express'
   import billingRoutes from './routes/billing'

   const app = express()

   app.use(express.json())
   app.use('/billing', billingRoutes)

   app.listen(3000)
   ```

## Related

- [Subscriptions](/docs/manage-subscriptions)
- [Track Usage](/docs/track-usage)
- [Customer Portal](/docs/customer-portal)
- [SDK Reference](/docs/sdk-reference)
