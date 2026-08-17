---
lastModified: 2026-07-28
title: Integrate with FastAPI
description: Add billing and payments to your FastAPI application.
---

Install the Commet Skill so your coding agent can integrate the current SDK and verify its work against the live API contract.

```bash
npx skills add commet-labs/skills --skill commet
```

1. ## Install
   ### pip
   ```bash
   pip install commet-sdk fastapi uvicorn
   ```
   ### uv
   ```bash
   uv add commet-sdk fastapi uvicorn
   ```
   ### poetry
   ```bash
   poetry add commet-sdk fastapi uvicorn
   ```

2. ## Configure
   ```bash title=".env"
   COMMET_API_KEY=ck_sandbox_xxx
   ```
   ```python title="commet_client.py"
   import os
   from commet import Commet

   commet = Commet(
       api_key=os.environ["COMMET_API_KEY"],
   )
   ```

3. ## Subscribe
   ```python title="routes/billing.py"
   from fastapi import APIRouter, HTTPException
   from pydantic import BaseModel
   from commet_client import commet

   router = APIRouter(prefix="/billing")


   class SubscribeRequest(BaseModel):
       customer_id: str
       email: str


   @router.post("/subscribe")
   def subscribe(body: SubscribeRequest):
       commet.customers.create(
           email=body.email,
           id=body.customer_id,
       )

       subscription = commet.subscriptions.create(
           customer_id=body.customer_id,
           plan_code="pro",
       )

       return {"checkout_url": subscription.checkout_url}
   ```

4. ## Check Access
   ```python title="routes/billing.py"
   @router.get("/subscription/{customer_id}")
   def get_subscription(customer_id: str):
       sub = commet.subscriptions.get_active(customer_id=customer_id)
       if sub is None:
           raise HTTPException(status_code=404, detail="No active subscription")
       return {"status": sub.status}


   @router.get("/features/{feature}/{customer_id}")
   def check_feature(feature: str, customer_id: str):
       result = commet.feature_access.get(code=feature, customer_id=customer_id)
       return {"allowed": result.allowed}
   ```

5. ## Track Usage
   ```python title="routes/billing.py"
   class UsageRequest(BaseModel):
       customer_id: str


   @router.post("/usage")
   def track_usage(body: UsageRequest):
       commet.usage.track(
           customer_id=body.customer_id,
           feature_code="api_calls",
           value=1,
       )

       return {"tracked": True}
   ```
   Usage is aggregated and billed at end of period.

6. ## Customer Portal
   ```python title="routes/billing.py"
   from fastapi.responses import RedirectResponse


   @router.get("/portal")
   def portal():
       result = commet.portal.get_url(customer_id="user_123")
       return RedirectResponse(result.portal_url)
   ```

7. ## Webhooks
   ```python title="routes/webhooks.py"
   import os

   from fastapi import APIRouter, Request, Response
   from commet import Webhooks

   router = APIRouter()
   webhooks = Webhooks()


   @router.post("/webhooks/commet")
   async def handle_webhook(request: Request):
       raw_body = await request.body()

       payload = webhooks.verify_and_parse(
           raw_body=raw_body.decode(),
           signature=request.headers.get("x-commet-signature"),
           secret=os.environ["COMMET_WEBHOOK_SECRET"],
       )

       if payload is None:
           return Response(status_code=401)

       if payload["event"] == "subscription.activated":
           # handle activation
           pass

       return Response(status_code=200)
   ```

8. ## Start Server
   ```python title="main.py"
   from fastapi import FastAPI
   from routes.billing import router as billing_router
   from routes.webhooks import router as webhooks_router

   app = FastAPI()
   app.include_router(billing_router)
   app.include_router(webhooks_router)
   ```
   ```bash
   uvicorn main:app --port 3000
   ```

## Related

- [Subscriptions](/docs/manage-subscriptions)
- [Track Usage](/docs/track-usage)
- [Customer Portal](/docs/customer-portal)
- [SDK Reference](/docs/sdk-reference)
