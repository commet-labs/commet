---
lastModified: 2026-07-28
title: Integrate with Remix
description: Add billing and payments to your Remix application.
---

Install the Commet Skill so your coding agent can integrate the current SDK and verify its work against the live API contract.

```bash
npx skills add commet-labs/skills --skill commet
```

1. ## Install
   ### pnpm
   ```bash
   pnpm add @commet/node @remix-run/node
   ```
   ### npm
   ```bash
   npm install @commet/node @remix-run/node
   ```
   ### yarn
   ```bash
   yarn add @commet/node @remix-run/node
   ```
   ### bun
   ```bash
   bun add @commet/node @remix-run/node
   ```

2. ## Configure
   ```bash title=".env"
   COMMET_API_KEY=ck_sandbox_xxx
   ```
   The `.server.ts` suffix ensures this module is never bundled into client code.
   ```typescript title="app/lib/commet.server.ts"
   import { Commet } from '@commet/node'

   export const commet = new Commet({
     apiKey: process.env.COMMET_API_KEY!,
   })
   ```

3. ## Subscribe
   `customers.create` is idempotent — if a customer with the same `id` already exists, it returns the existing record.
   ```typescript title="app/routes/billing.subscribe.ts"
   import { json, redirect, type ActionFunctionArgs } from '@remix-run/node'
   import { commet } from '~/lib/commet.server'

   export async function action({ request }: ActionFunctionArgs) {
     const formData = await request.formData()
     const customerId = String(formData.get('customerId'))
     const email = String(formData.get('email'))

     await commet.customers.create({ email, id: customerId })

     const subscription = await commet.subscriptions.create({
       customerId,
       planCode: 'pro',
     })

     const checkoutUrl = subscription.checkoutUrl
     if (checkoutUrl) {
       return redirect(checkoutUrl)
     }

     return json({ subscribed: true })
   }
   ```

4. ## Check Access
   ```typescript title="app/routes/billing.status.ts"
   import { json, type LoaderFunctionArgs } from '@remix-run/node'
   import { commet } from '~/lib/commet.server'

   export async function loader({ request }: LoaderFunctionArgs) {
     const url = new URL(request.url)
     const customerId = url.searchParams.get('customerId')!

     const subscription = await commet.subscriptions.getActive({ customerId })

     if (!subscription) {
       return json({ error: 'no_active_subscription' }, { status: 404 })
     }

     const feature = await commet.featureAccess.get({
       code: 'api_calls',
       customerId,
     })

     return json({
       status: subscription.status,
       allowed: feature.allowed,
     })
   }
   ```

5. ## Track Usage
   ```typescript title="app/routes/billing.usage.ts"
   import { json, type ActionFunctionArgs } from '@remix-run/node'
   import { commet } from '~/lib/commet.server'

   export async function action({ request }: ActionFunctionArgs) {
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
   ```typescript title="app/routes/billing.portal.ts"
   import { redirect, type LoaderFunctionArgs } from '@remix-run/node'
   import { commet } from '~/lib/commet.server'

   export async function loader({ request }: LoaderFunctionArgs) {
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
