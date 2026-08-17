---
lastModified: 2026-07-28
title: Integrate with Nuxt
description: Add billing and payments to your Nuxt application.
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
   ```typescript title="nuxt.config.ts"
   export default defineNuxtConfig({
     runtimeConfig: {
       commetApiKey: process.env.COMMET_API_KEY,
     },
   })
   ```
   Nuxt auto-imports from `server/utils/`, so the client is available in all server routes.
   ```typescript title="server/utils/commet.ts"
   import { Commet } from '@commet/node'

   const config = useRuntimeConfig()

   export const commet = new Commet({
     apiKey: config.commetApiKey,
   })
   ```

3. ## Subscribe
   `customers.create` is idempotent — if a customer with the same `id` already exists, it returns the existing record.
   ```typescript title="server/api/billing/subscribe.post.ts"
   export default defineEventHandler(async (event) => {
     const { customerId, email } = await readBody(event)

     await commet.customers.create({ email, id: customerId })

     const subscription = await commet.subscriptions.create({
       customerId,
       planCode: 'pro',
     })

     return { checkoutUrl: subscription.checkoutUrl ?? null }
   })
   ```

4. ## Check Access
   ```typescript title="server/api/billing/access/[customerId].get.ts"
   export default defineEventHandler(async (event) => {
     const customerId = getRouterParam(event, 'customerId')!

     const subscription = await commet.subscriptions.getActive({ customerId })

     if (!subscription) {
       throw createError({ statusCode: 404, statusMessage: 'No active subscription' })
     }

     const feature = await commet.featureAccess.get({
       code: 'api_calls',
       customerId,
     })

     return {
       status: subscription.status,
       allowed: feature.allowed,
     }
   })
   ```

5. ## Track Usage
   ```typescript title="server/api/billing/usage.post.ts"
   export default defineEventHandler(async (event) => {
     const { customerId } = await readBody(event)

     await commet.usage.track({
       customerId,
       featureCode: 'api_calls',
       value: 1,
     })

     return { tracked: true }
   })
   ```
   Usage is aggregated and billed at end of period.

6. ## Customer Portal
   ```typescript title="server/api/billing/portal.get.ts"
   export default defineEventHandler(async (event) => {
     const customerId = 'user_123'

     const portal = await commet.portal.getUrl({ customerId })

     return sendRedirect(event, portal.portalUrl)
   })
   ```

## Related

- [Subscriptions](/docs/manage-subscriptions)
- [Track Usage](/docs/track-usage)
- [Customer Portal](/docs/customer-portal)
- [SDK Reference](/docs/sdk-reference)
