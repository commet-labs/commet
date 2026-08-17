---
lastModified: 2026-07-28
title: Integrate with Python
description: Install and configure the Commet Python SDK.
---

Install the Commet Skill so your coding agent can integrate the current SDK and verify its work against the live API contract.

```bash
npx skills add commet-labs/skills --skill commet
```

1. ## Install
   ### pip
   ```bash
   pip install commet-sdk
   ```
   ### uv
   ```bash
   uv add commet-sdk
   ```
   ### poetry
   ```bash
   poetry add commet-sdk
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

3. ## Create Customer and Subscribe
   `customers.create` is idempotent — if a customer with the same `id` already exists, it returns the existing record.
   ```python
   response = commet.customers.create(
       email="user@example.com",
       id="user_123",
   )

   subscription = commet.subscriptions.create(
       customer_id="user_123",
       plan_code="pro",
   )

   checkout_url = subscription.checkout_url
   ```
   The customer is redirected to checkout to complete payment.

4. ## Check Access
   ```python
   sub = commet.subscriptions.get_active(customer_id="user_123")
   status = sub.status if sub else None

   access = commet.feature_access.get(code="custom_branding", customer_id="user_123")
   allowed = access.allowed
   ```

5. ## Track Usage
   ```python
   commet.usage.track(
       customer_id="user_123",
       feature_code="api_calls",
       value=1,
   )
   ```
   Usage is aggregated and billed at end of period.

6. ## Multiple Operations
   Call each resource directly with `customer_id`:
   ```python
   commet.usage.track(customer_id="user_123", feature_code="api_calls", value=1)
   commet.feature_access.get(code="custom_branding", customer_id="user_123")
   commet.seats.add(customer_id="user_123", feature_code="editor", count=3)
   ```

## Related

- [Flask](/docs/integrate-with-flask)
- [FastAPI](/docs/integrate-with-fastapi)
- [Django](/docs/integrate-with-django)
- [SDK Reference](/docs/sdk-reference)
