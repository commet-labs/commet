---
lastModified: 2026-07-28
title: Integrate with Flask
description: Add billing and payments to your Flask application.
---

Install the Commet Skill so your coding agent can integrate the current SDK and verify its work against the live API contract.

```bash
npx skills add commet-labs/skills --skill commet
```

1. ## Install
   ### pip
   ```bash
   pip install commet-sdk flask
   ```
   ### uv
   ```bash
   uv add commet-sdk flask
   ```
   ### poetry
   ```bash
   poetry add commet-sdk flask
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
   from flask import Blueprint, request, jsonify, redirect
   from commet_client import commet

   billing = Blueprint("billing", __name__)


   @billing.route("/subscribe", methods=["POST"])
   def subscribe():
       data = request.get_json()

       commet.customers.create(
           email=data["email"],
           id=data["customer_id"],
       )

       subscription = commet.subscriptions.create(
           customer_id=data["customer_id"],
           plan_code="pro",
       )

       return jsonify({"checkout_url": subscription.checkout_url})
   ```

4. ## Check Access
   ```python title="routes/billing.py"
   @billing.route("/subscription/<customer_id>")
   def get_subscription(customer_id):
       sub = commet.subscriptions.get_active(customer_id=customer_id)
       if sub is None:
           return jsonify({"error": "no_active_subscription"}), 404
       return jsonify({"status": sub.status})


   @billing.route("/features/<feature>/<customer_id>")
   def check_feature(feature, customer_id):
       result = commet.feature_access.get(code=feature, customer_id=customer_id)
       return jsonify({"allowed": result.allowed})
   ```

5. ## Track Usage
   ```python title="routes/billing.py"
   @billing.route("/usage", methods=["POST"])
   def track_usage():
       data = request.get_json()

       commet.usage.track(
           customer_id=data["customer_id"],
           feature_code="api_calls",
           value=1,
       )

       return jsonify({"tracked": True})
   ```
   Usage is aggregated and billed at end of period.

6. ## Customer Portal
   ```python title="routes/billing.py"
   @billing.route("/portal")
   def portal():
       result = commet.portal.get_url(customer_id="user_123")
       return redirect(result.portal_url)
   ```

7. ## Webhooks
   ```python title="routes/webhooks.py"
   import os

   from flask import Blueprint, request
   from commet import Webhooks

   webhooks_bp = Blueprint("webhooks", __name__)
   webhooks = Webhooks()


   @webhooks_bp.route("/webhooks/commet", methods=["POST"])
   def handle_webhook():
       payload = webhooks.verify_and_parse(
           raw_body=request.get_data(as_text=True),
           signature=request.headers.get("x-commet-signature"),
           secret=os.environ["COMMET_WEBHOOK_SECRET"],
       )

       if payload is None:
           return "Invalid signature", 401

       if payload["event"] == "subscription.activated":
           # handle activation
           pass

       return "", 200
   ```

8. ## Start Server
   ```python title="app.py"
   from flask import Flask
   from routes.billing import billing
   from routes.webhooks import webhooks_bp

   app = Flask(__name__)
   app.register_blueprint(billing, url_prefix="/billing")
   app.register_blueprint(webhooks_bp)

   if __name__ == "__main__":
       app.run(port=3000)
   ```

## Related

- [Subscriptions](/docs/manage-subscriptions)
- [Track Usage](/docs/track-usage)
- [Customer Portal](/docs/customer-portal)
- [SDK Reference](/docs/sdk-reference)
