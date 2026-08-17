---
lastModified: 2026-07-28
title: Integrate with Laravel
description: Add billing and payments to your Laravel application.
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
   ```php title="app/Providers/AppServiceProvider.php"
   <?php

   namespace App\Providers;

   use Commet\Commet;
   use Illuminate\Support\ServiceProvider;

   class AppServiceProvider extends ServiceProvider
   {
       public function register(): void
       {
           $this->app->singleton(Commet::class, function () {
               return new Commet(
                   apiKey: config('services.commet.api_key'),
               );
           });
       }
   }
   ```
   ```php title="config/services.php"
   'commet' => [
       'api_key' => env('COMMET_API_KEY'),
       'webhook_secret' => env('COMMET_WEBHOOK_SECRET'),
   ],
   ```

3. ## Subscribe
   ```php title="app/Http/Controllers/BillingController.php"
   <?php

   namespace App\Http\Controllers;

   use Commet\Commet;
   use Illuminate\Http\JsonResponse;
   use Illuminate\Http\Request;

   class BillingController extends Controller
   {
       public function __construct(
           private Commet $commet,
       ) {}

       public function subscribe(Request $request): JsonResponse
       {
           $request->validate([
               'email' => 'required|email',
               'customer_id' => 'required|string',
           ]);

           $this->commet->customers->create(
               email: $request->input('email'),
               id: $request->input('customer_id'),
           );

           $subscription = $this->commet->subscriptions->create(
               customerId: $request->input('customer_id'),
               planCode: 'pro',
           );

           return response()->json([
               'checkout_url' => $subscription->checkoutUrl,
           ]);
       }
   }
   ```

4. ## Check Access
   ```php title="app/Http/Controllers/BillingController.php"
   public function getSubscription(string $customerId): JsonResponse
   {
       $subscription = $this->commet->subscriptions->getActive($customerId);

       if ($subscription === null) {
           return response()->json(['error' => 'no_active_subscription'], 404);
       }

       return response()->json([
           'status' => $subscription->status->value,
       ]);
   }

   public function checkFeature(string $feature, string $customerId): JsonResponse
   {
       $result = $this->commet->featureAccess->get(code: $feature, customerId: $customerId);

       return response()->json([
           'allowed' => $result->allowed,
       ]);
   }
   ```

5. ## Track Usage
   ```php title="app/Http/Controllers/BillingController.php"
   public function trackUsage(Request $request): JsonResponse
   {
       $request->validate([
           'customer_id' => 'required|string',
       ]);

       $this->commet->usage->track(
           customerId: $request->input('customer_id'),
           featureCode: 'api_calls',
           value: 1,
       );

       return response()->json(['tracked' => true]);
   }
   ```
   Usage is aggregated and billed at end of period.

6. ## Customer Portal
   ```php title="app/Http/Controllers/BillingController.php"
   use Illuminate\Http\RedirectResponse;

   public function portal(): RedirectResponse
   {
       $result = $this->commet->portal->getUrl(customerId: 'user_123');

       return redirect($result->portalUrl);
   }
   ```

7. ## Webhooks
   ```php title="app/Http/Controllers/WebhookController.php"
   <?php

   namespace App\Http\Controllers;

   use Commet\Resources\WebhooksResource;
   use Illuminate\Http\JsonResponse;
   use Illuminate\Http\Request;

   class WebhookController extends Controller
   {
       public function handle(Request $request): JsonResponse
       {
           $webhooks = new WebhooksResource();

           $payload = $webhooks->verifyAndParse(
               rawBody: $request->getContent(),
               signature: $request->header('x-commet-signature'),
               secret: config('services.commet.webhook_secret'),
           );

           if ($payload === null) {
               return response()->json(['error' => 'Invalid signature'], 401);
           }

           match ($payload['event']) {
               'subscription.activated' => $this->handleActivated($payload),
               'subscription.canceled' => $this->handleCanceled($payload),
               default => null,
           };

           return response()->json(['ok' => true]);
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
   Exclude the webhook route from CSRF verification:
   ```php title="bootstrap/app.php"
   ->withMiddleware(function (Middleware $middleware) {
       $middleware->validateCsrfTokens(except: [
           'webhooks/commet',
       ]);
   })
   ```

8. ## Routes
   ```php title="routes/api.php"
   <?php

   use App\Http\Controllers\BillingController;
   use App\Http\Controllers\WebhookController;
   use Illuminate\Support\Facades\Route;

   Route::post('/billing/subscribe', [BillingController::class, 'subscribe']);
   Route::get('/billing/subscription/{customerId}', [BillingController::class, 'getSubscription']);
   Route::get('/billing/features/{feature}/{customerId}', [BillingController::class, 'checkFeature']);
   Route::post('/billing/usage', [BillingController::class, 'trackUsage']);
   Route::get('/billing/portal', [BillingController::class, 'portal']);
   Route::post('/webhooks/commet', [WebhookController::class, 'handle']);
   ```

## Related

- [Subscriptions](/docs/manage-subscriptions)
- [Track Usage](/docs/track-usage)
- [Customer Portal](/docs/customer-portal)
- [SDK Reference](/docs/sdk-reference)
