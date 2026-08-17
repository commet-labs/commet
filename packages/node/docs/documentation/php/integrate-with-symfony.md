---
lastModified: 2026-07-28
title: Integrate with Symfony
description: Add billing and payments to your Symfony application.
---

Install the Commet Skill so your coding agent can integrate the current SDK and verify its work against the live API contract.

```bash
npx skills add commet-labs/skills --skill commet
```

1. ## Install
   ```bash
   composer require commet/commet-php
   ```

2. ## Configure
   ```bash title=".env"
   COMMET_API_KEY=ck_sandbox_xxx
   COMMET_WEBHOOK_SECRET=whsec_xxx
   ```
   ```yaml title="config/services.yaml"
   services:
       Commet\Commet:
           factory: ['@App\Factory\CommetFactory', 'create']

       App\Factory\CommetFactory:
           arguments:
               $apiKey: '%env(COMMET_API_KEY)%'
   ```
   ```php title="src/Factory/CommetFactory.php"
   <?php

   namespace App\Factory;

   use Commet\Commet;

   class CommetFactory
   {
       public function __construct(
           private string $apiKey,
       ) {}

       public function create(): Commet
       {
           return new Commet(
               apiKey: $this->apiKey,
           );
       }
   }
   ```

3. ## Subscribe
   ```php title="src/Controller/BillingController.php"
   <?php

   namespace App\Controller;

   use Commet\Commet;
   use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
   use Symfony\Component\HttpFoundation\JsonResponse;
   use Symfony\Component\HttpFoundation\Request;
   use Symfony\Component\Routing\Attribute\Route;

   class BillingController extends AbstractController
   {
       public function __construct(
           private Commet $commet,
       ) {}

       #[Route('/billing/subscribe', methods: ['POST'])]
       public function subscribe(Request $request): JsonResponse
       {
           $data = $request->toArray();

           $this->commet->customers->create(
               email: $data['email'],
               id: $data['customer_id'],
           );

           $subscription = $this->commet->subscriptions->create(
               customerId: $data['customer_id'],
               planCode: 'pro',
           );

           return $this->json([
               'checkout_url' => $subscription->checkoutUrl,
           ]);
       }
   }
   ```

4. ## Check Access
   ```php title="src/Controller/BillingController.php"
   #[Route('/billing/subscription/{customerId}', methods: ['GET'])]
   public function getSubscription(string $customerId): JsonResponse
   {
       $subscription = $this->commet->subscriptions->getActive($customerId);

       if ($subscription === null) {
           return $this->json(['error' => 'no_active_subscription'], 404);
       }

       return $this->json([
           'status' => $subscription->status->value,
       ]);
   }

   #[Route('/billing/features/{feature}/{customerId}', methods: ['GET'])]
   public function checkFeature(string $feature, string $customerId): JsonResponse
   {
       $result = $this->commet->featureAccess->get(code: $feature, customerId: $customerId);

       return $this->json([
           'allowed' => $result->allowed,
       ]);
   }
   ```

5. ## Track Usage
   ```php title="src/Controller/BillingController.php"
   #[Route('/billing/usage', methods: ['POST'])]
   public function trackUsage(Request $request): JsonResponse
   {
       $data = $request->toArray();

       $this->commet->usage->track(
           customerId: $data['customer_id'],
           featureCode: 'api_calls',
           value: 1,
       );

       return $this->json(['tracked' => true]);
   }
   ```
   Usage is aggregated and billed at end of period.

6. ## Customer Portal
   ```php title="src/Controller/BillingController.php"
   use Symfony\Component\HttpFoundation\RedirectResponse;

   #[Route('/billing/portal', methods: ['GET'])]
   public function portal(): RedirectResponse
   {
       $result = $this->commet->portal->getUrl(customerId: 'user_123');

       return $this->redirect($result->portalUrl);
   }
   ```

7. ## Webhooks
   ```php title="src/Controller/WebhookController.php"
   <?php

   namespace App\Controller;

   use Commet\Resources\WebhooksResource;
   use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
   use Symfony\Component\DependencyInjection\Attribute\Autowire;
   use Symfony\Component\HttpFoundation\JsonResponse;
   use Symfony\Component\HttpFoundation\Request;
   use Symfony\Component\HttpFoundation\Response;
   use Symfony\Component\Routing\Attribute\Route;

   class WebhookController extends AbstractController
   {
       public function __construct(
           #[Autowire(env: 'COMMET_WEBHOOK_SECRET')]
           private string $webhookSecret,
       ) {}

       #[Route('/webhooks/commet', methods: ['POST'])]
       public function handle(Request $request): JsonResponse|Response
       {
           $webhooks = new WebhooksResource();

           $payload = $webhooks->verifyAndParse(
               rawBody: $request->getContent(),
               signature: $request->headers->get('x-commet-signature'),
               secret: $this->webhookSecret,
           );

           if ($payload === null) {
               return new Response('Invalid signature', 401);
           }

           match ($payload['event']) {
               'subscription.activated' => $this->handleActivated($payload),
               'subscription.canceled' => $this->handleCanceled($payload),
               default => null,
           };

           return $this->json(['ok' => true]);
       }

       private function handleActivated(array $payload): void
       {
           // handle activation
       }

       private function handleCanceled(array $payload): void
       {
           // handle cancellation
       }
   }
   ```

## Related

- [Subscriptions](/docs/manage-subscriptions)
- [Track Usage](/docs/track-usage)
- [Customer Portal](/docs/customer-portal)
- [SDK Reference](/docs/sdk-reference)
