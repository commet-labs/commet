---
lastModified: 2026-07-28
title: Integrate with PHP
description: Install and configure the Commet PHP SDK.
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
   ```
   ```php title="commet.php"
   <?php

   require_once __DIR__ . '/vendor/autoload.php';

   use Commet\Commet;

   $commet = new Commet(
       apiKey: $_ENV['COMMET_API_KEY'],
   );
   ```

3. ## Create Customer and Subscribe
   `customers->create` is idempotent — if a customer with the same `id` already exists, it returns the existing record.
   ```php
   $commet->customers->create(
       email: 'user@example.com',
       id: 'user_123',
   );

   $subscription = $commet->subscriptions->create(
       customerId: 'user_123',
       planCode: 'pro',
   );

   $checkoutUrl = $subscription->checkoutUrl;
   ```
   The customer is redirected to checkout to complete payment.

4. ## Check Access
   ```php
   $sub = $commet->subscriptions->getActive('user_123');
   $status = $sub?->status->value;

   $access = $commet->featureAccess->get(code: 'custom_branding', customerId: 'user_123');
   $allowed = $access->allowed;
   ```

5. ## Track Usage
   ```php
   $commet->usage->track(
       customerId: 'user_123',
       featureCode: 'api_calls',
       value: 1,
   );
   ```
   Usage is aggregated and billed at end of period.

6. ## Webhooks
   ```php
   <?php

   use Commet\Resources\WebhooksResource;

   $webhooks = new WebhooksResource();

   $payload = $webhooks->verifyAndParse(
       rawBody: file_get_contents('php://input'),
       signature: $_SERVER['HTTP_X_COMMET_SIGNATURE'] ?? '',
       secret: $_ENV['COMMET_WEBHOOK_SECRET'],
   );

   if ($payload === null) {
       http_response_code(401);
       echo json_encode(['error' => 'Invalid signature']);
       exit;
   }

   match ($payload['event']) {
       'subscription.activated' => handleActivated($payload),
       'subscription.canceled' => handleCanceled($payload),
       default => null,
   };

   echo json_encode(['ok' => true]);
   ```

## Related

- [Laravel](/docs/integrate-with-laravel)
- [Symfony](/docs/integrate-with-symfony)
- [SDK Reference](/docs/sdk-reference)
