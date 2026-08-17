---
lastModified: 2026-07-28
title: Integrate with Django
description: Add billing and payments to your Django application.
---

Install the Commet Skill so your coding agent can integrate the current SDK and verify its work against the live API contract.

```bash
npx skills add commet-labs/skills --skill commet
```

1. ## Install
   ### pip
   ```bash
   pip install commet-sdk django
   ```
   ### uv
   ```bash
   uv add commet-sdk django
   ```
   ### poetry
   ```bash
   poetry add commet-sdk django
   ```

2. ## Configure
   ```bash title=".env"
   COMMET_API_KEY=ck_sandbox_xxx
   ```
   ```python title="billing/commet_client.py"
   import os
   from commet import Commet

   commet = Commet(
       api_key=os.environ["COMMET_API_KEY"],
   )
   ```

3. ## Subscribe
   ```python title="billing/views.py"
   import json
   from django.http import JsonResponse
   from django.views.decorators.http import require_POST
   from .commet_client import commet


   @require_POST
   def subscribe(request):
       data = json.loads(request.body)

       commet.customers.create(
           email=data["email"],
           id=data["customer_id"],
       )

       subscription = commet.subscriptions.create(
           customer_id=data["customer_id"],
           plan_code="pro",
       )

       return JsonResponse({"checkout_url": subscription.checkout_url})
   ```

4. ## Check Access
   ```python title="billing/views.py"
   def get_subscription(request, customer_id):
       sub = commet.subscriptions.get_active(customer_id=customer_id)
       if sub is None:
           return JsonResponse({"error": "no_active_subscription"}, status=404)
       return JsonResponse({"status": sub.status})


   def check_feature(request, feature, customer_id):
       result = commet.feature_access.get(code=feature, customer_id=customer_id)
       return JsonResponse({"allowed": result.allowed})
   ```

5. ## Track Usage
   ```python title="billing/views.py"
   @require_POST
   def track_usage(request):
       data = json.loads(request.body)

       commet.usage.track(
           customer_id=data["customer_id"],
           feature_code="api_calls",
           value=1,
       )

       return JsonResponse({"tracked": True})
   ```
   Usage is aggregated and billed at end of period.

6. ## Customer Portal
   ```python title="billing/views.py"
   from django.shortcuts import redirect


   def portal(request):
       result = commet.portal.get_url(customer_id="user_123")
       return redirect(result.portal_url)
   ```

7. ## Webhooks
   ```python title="billing/views.py"
   import os

   from django.views.decorators.csrf import csrf_exempt
   from commet import Webhooks

   webhooks = Webhooks()


   @csrf_exempt
   @require_POST
   def handle_webhook(request):
       payload = webhooks.verify_and_parse(
           raw_body=request.body.decode(),
           signature=request.headers.get("x-commet-signature"),
           secret=os.environ["COMMET_WEBHOOK_SECRET"],
       )

       if payload is None:
           return JsonResponse({"error": "Invalid signature"}, status=401)

       if payload["event"] == "subscription.activated":
           # handle activation
           pass

       return JsonResponse({"ok": True})
   ```

8. ## URLs
   ```python title="billing/urls.py"
   from django.urls import path
   from . import views

   urlpatterns = [
       path("subscribe", views.subscribe),
       path("subscription/<str:customer_id>", views.get_subscription),
       path("features/<str:feature>/<str:customer_id>", views.check_feature),
       path("usage", views.track_usage),
       path("portal", views.portal),
       path("webhooks/commet", views.handle_webhook),
   ]
   ```
   ```python title="project/urls.py"
   from django.urls import path, include

   urlpatterns = [
       path("billing/", include("billing.urls")),
   ]
   ```

## Related

- [Subscriptions](/docs/manage-subscriptions)
- [Track Usage](/docs/track-usage)
- [Customer Portal](/docs/customer-portal)
- [SDK Reference](/docs/sdk-reference)
