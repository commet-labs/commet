---
lastModified: 2026-07-31
title: Introduction
description: Receive real-time notifications when events happen in your Commet account.
---

Webhooks let your application receive real-time HTTP notifications when events happen in Commet — like a subscription being activated, a payment failing, or an invoice being created.

## How it works

1. You register an endpoint URL in the Commet dashboard
2. You select which events you want to receive
3. When an event occurs, Commet sends a `POST` request to your URL with the event data

## Local development

Use the Commet CLI to forward webhook events to your local server in real time — no tunneling tools needed:

```bash
commet listen localhost:3000/api/webhooks/commet
```

The CLI connects to Commet's event stream and replays every webhook directly to your local URL. You'll see each event, its response status, and timing in the terminal:

```
  ✓ Authenticated (org: Acme Inc)
  ✓ Connected to Commet webhook stream
  ⟶ Forwarding to http://localhost:3000/api/webhooks/commet/
  ⟶ Signing secret: whsec_abc123...

  Ready! Listening for webhook events...

  14:32:01  subscription.activated        →  200 OK    (12ms)
  14:32:05  invoice.created               →  200 OK    (8ms)
```

You can point to any local URL — a custom hostname, a different port, or a specific path:

```bash
commet listen localhost:3000/api/webhooks/commet
commet listen local.myapp.dev:3010/webhooks
commet listen 4000
```

Filter to specific events with `--events`:

```bash
commet listen localhost:3000/api/webhooks/commet --events subscription.activated,payment.failed
```

The signing secret is printed when the session starts. Set it as `COMMET_WEBHOOK_SECRET` in your `.env` to verify signatures locally with the same code you'll use in production.

## Payload structure

Every webhook delivers a JSON payload with this envelope:

```json
{
  "id": "whev_8AzNvGSAZJw0YBOUMTn9vM1V",
  "event": "subscription.activated",
  "timestamp": "2026-03-25T14:30:00.000Z",
  "organizationId": "8f14e45f-ceea-4e7a-9c3d-1c2b3a4d5e6f",
  "mode": "live",
  "apiVersion": "2026-05-25",
  "data": {
    // Event-specific fields
  }
}
```

| Field            | Type   | Description                                                                                                                      |
| ---------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `id`             | string | Unique event id (e.g. `whev_…`). Stable across delivery retries — deduplicate on it. Also sent as the `X-Commet-Event-Id` header |
| `event`          | string | The event type (e.g. `subscription.activated`)                                                                                   |
| `timestamp`      | string | ISO 8601 datetime when the event was emitted                                                                                     |
| `organizationId` | string | Your organization ID                                                                                                             |
| `mode`           | string | `"live"` or `"sandbox"` — which environment triggered the event                                                                  |
| `apiVersion`     | string | The API version used to shape this payload (e.g. `2026-05-25`). See [API Versioning](/docs/api-versioning)                       |
| `data`           | object | Event-specific payload — see individual event pages below                                                                        |

The same event is retried with the **same `id`** when your endpoint doesn't respond with a `2xx`, so store processed ids and skip duplicates.

## Handling webhooks

Receive events by exposing an HTTP endpoint. The Node.js SDK ships a dedicated Next.js handler that verifies signatures and routes events automatically; in other languages, verify the payload and dispatch on `event`.

### Node.js

```typescript title="app/api/webhooks/commet/route.ts"
import { Webhooks } from "@commet/next"

export const POST = Webhooks({
  webhookSecret: process.env.COMMET_WEBHOOK_SECRET!,

  onSubscriptionActivated: async (payload) => {
    await db.update(users)
      .set({ isPaid: true })
      .where(eq(users.id, payload.data.customerId))
  },

  onSubscriptionCanceled: async (payload) => {
    await db.update(users)
      .set({ isPaid: false })
      .where(eq(users.id, payload.data.customerId))
  },

  onPayload: async (payload) => {
    console.log(`Received: ${payload.event}`)
  },
})
```

### Python

```python
import os
from flask import Flask, request, Response
from commet import Commet

app = Flask(__name__)
commet = Commet(api_key=os.environ['COMMET_API_KEY'])

@app.post('/api/webhooks/commet')
def handle_webhook():
    payload = commet.webhooks.verify_and_parse(
        raw_body=request.get_data(as_text=True),
        signature=request.headers.get('x-commet-signature'),
        secret=os.environ['COMMET_WEBHOOK_SECRET'],
    )

    if payload is None:
        return Response('Invalid signature', status=401)

    if payload['event'] == 'subscription.activated':
        # Grant access
        pass
    elif payload['event'] == 'subscription.canceled':
        # Revoke access
        pass

    return Response('OK', status=200)
```

### Go

```go
import (
    "io"
    "net/http"
    "os"

    "github.com/commet-labs/commet-go/v9"
)

client, _ := commet.New(os.Getenv("COMMET_API_KEY"))

http.HandleFunc("/api/webhooks/commet", func(w http.ResponseWriter, r *http.Request) {
    body, _ := io.ReadAll(r.Body)

    payload, err := client.Webhooks.VerifyAndParse(
        string(body),
        r.Header.Get("X-Commet-Signature"),
        os.Getenv("COMMET_WEBHOOK_SECRET"),
    )
    if err != nil {
        http.Error(w, "Invalid signature", http.StatusUnauthorized)
        return
    }

    switch payload["event"] {
    case "subscription.activated":
        // Grant access
    case "subscription.canceled":
        // Revoke access
    }

    w.WriteHeader(http.StatusOK)
})
```

### Java

```java
import co.commet.Commet;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
public class CommetWebhookController {

    private final Commet commet = Commet.builder()
        .apiKey(System.getenv("COMMET_API_KEY"))
        .build();

    @PostMapping("/api/webhooks/commet")
    public ResponseEntity<String> handle(
        @RequestBody String rawBody,
        @RequestHeader("X-Commet-Signature") String signature
    ) {
        Map<String, Object> payload = commet.webhooks().verifyAndParse(
            rawBody,
            signature,
            System.getenv("COMMET_WEBHOOK_SECRET")
        );

        if (payload == null) {
            return ResponseEntity.status(401).body("Invalid signature");
        }

        String event = (String) payload.get("event");
        switch (event) {
            case "subscription.activated" -> { /* Grant access */ }
            case "subscription.canceled" -> { /* Revoke access */ }
        }

        return ResponseEntity.ok("OK");
    }
}
```

### PHP

```php
use Commet\Commet;

$commet = new Commet(apiKey: getenv('COMMET_API_KEY'));

$rawBody = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_COMMET_SIGNATURE'] ?? null;

$payload = $commet->webhooks->verifyAndParse(
    $rawBody,
    $signature,
    getenv('COMMET_WEBHOOK_SECRET'),
);

if ($payload === null) {
    http_response_code(401);
    exit('Invalid signature');
}

match ($payload['event']) {
    'subscription.activated' => null, // Grant access
    'subscription.canceled' => null,  // Revoke access
    default => null,
};

http_response_code(200);
echo 'OK';
```

## Verifying signatures manually

If you're not using `@commet/next`, verify the HMAC-SHA256 signature yourself with the SDK:

### Node.js

```typescript
import { Commet } from "@commet/node"

const commet = new Commet({ apiKey: process.env.COMMET_API_KEY! })

export async function POST(request: Request) {
  const rawBody = await request.text()
  const signature = request.headers.get("x-commet-signature")

  const payload = commet.webhooks.verifyAndParse({
    rawBody,
    signature,
    secret: process.env.COMMET_WEBHOOK_SECRET!,
  })

  if (!payload) {
    return new Response("Invalid signature", { status: 403 })
  }

  switch (payload.event) {
    case "subscription.activated":
      // Grant access
      break
    case "subscription.canceled":
      // Revoke access
      break
  }

  return new Response("OK", { status: 200 })
}
```

### Python

```python
import os
from flask import Flask, request, Response
from commet import Commet

app = Flask(__name__)
commet = Commet(api_key=os.environ['COMMET_API_KEY'])

@app.post('/webhooks/commet')
def commet_webhook():
    raw_body = request.get_data(as_text=True)
    signature = request.headers.get('x-commet-signature')

    payload = commet.webhooks.verify_and_parse(
        raw_body=raw_body,
        signature=signature,
        secret=os.environ['COMMET_WEBHOOK_SECRET'],
    )

    if payload is None:
        return Response('Invalid signature', status=403)

    if payload['event'] == 'subscription.activated':
        # Grant access
        pass
    elif payload['event'] == 'subscription.canceled':
        # Revoke access
        pass

    return Response('OK', status=200)
```

### Go

```go
import (
    "io"
    "net/http"
    "os"

    "github.com/commet-labs/commet-go/v9"
)

client, _ := commet.New(os.Getenv("COMMET_API_KEY"))

http.HandleFunc("/webhooks/commet", func(w http.ResponseWriter, r *http.Request) {
    body, _ := io.ReadAll(r.Body)
    signature := r.Header.Get("X-Commet-Signature")

    payload, err := client.Webhooks.VerifyAndParse(
        string(body),
        signature,
        os.Getenv("COMMET_WEBHOOK_SECRET"),
    )
    if err != nil {
        http.Error(w, "Invalid signature", http.StatusForbidden)
        return
    }

    switch payload["event"] {
    case "subscription.activated":
        // Grant access
    case "subscription.canceled":
        // Revoke access
    }

    w.WriteHeader(http.StatusOK)
    w.Write([]byte("OK"))
})
```

### Java

```java
import co.commet.Commet;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
public class WebhookController {

    private final Commet commet = Commet.builder()
        .apiKey(System.getenv("COMMET_API_KEY"))
        .build();

    @PostMapping("/webhooks/commet")
    public ResponseEntity<String> handle(
        @RequestBody String rawBody,
        @RequestHeader("X-Commet-Signature") String signature
    ) {
        Map<String, Object> payload = commet.webhooks().verifyAndParse(
            rawBody,
            signature,
            System.getenv("COMMET_WEBHOOK_SECRET")
        );

        if (payload == null) {
            return ResponseEntity.status(403).body("Invalid signature");
        }

        String event = (String) payload.get("event");
        switch (event) {
            case "subscription.activated" -> { /* Grant access */ }
            case "subscription.canceled" -> { /* Revoke access */ }
        }

        return ResponseEntity.ok("OK");
    }
}
```

### PHP

```php
use Commet\Commet;

$commet = new Commet(apiKey: getenv('COMMET_API_KEY'));

$rawBody = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_COMMET_SIGNATURE'] ?? null;

$payload = $commet->webhooks->verifyAndParse(
    $rawBody,
    $signature,
    getenv('COMMET_WEBHOOK_SECRET'),
);

if ($payload === null) {
    http_response_code(403);
    echo 'Invalid signature';
    exit;
}

match ($payload['event']) {
    'subscription.activated' => null, // Grant access
    'subscription.canceled' => null,  // Revoke access
    default => null,
};

http_response_code(200);
echo 'OK';
```

## Headers

Commet sends these headers with every webhook request:

| Header               | Description                                    |
| -------------------- | ---------------------------------------------- |
| `X-Commet-Signature` | HMAC-SHA256 hex signature of the raw body      |
| `X-Commet-Event`     | The event type (e.g. `subscription.activated`) |
| `X-Commet-Timestamp` | ISO 8601 datetime when the event was emitted   |
| `Content-Type`       | `application/json`                             |

## Retry policy

If your endpoint returns a non-2xx status or times out (10 seconds), Commet retries with exponential backoff. The initial delivery counts as the first attempt, followed by up to 7 retries — 8 attempts in total over a window of roughly 8 hours:

| Retry     | Delay after previous attempt |
| --------- | ---------------------------- |
| 1st retry | 1 minute                     |
| 2nd retry | 5 minutes                    |
| 3rd retry | 15 minutes                   |
| 4th retry | 30 minutes                   |
| 5th retry | 1 hour                       |
| 6th retry | 2 hours                      |
| 7th retry | 4 hours                      |

After 8 failed attempts (the initial delivery plus 7 retries), the delivery is marked as failed and we email your organization's notification recipient with the endpoint URL, event type, and the last response we received (HTTP status or error code).

## Auto-disable for broken endpoints

If three events in a row fail to deliver, Commet automatically disables the endpoint so it stops consuming retries. You'll get a second email confirming the endpoint was turned off.

Once you've fixed the issue on your receiver, re-enable the endpoint from the Commet dashboard under **Settings → Webhooks → Endpoints**. Events that arrived while the endpoint was disabled are not replayed automatically — contact support if you need to backfill any missed events.

You can monitor delivery status, inspect payloads, and retry individual deliveries from the dashboard at any time.

## Subscription status lifecycle

Every `subscription.*` webhook includes a `status` field. These are the valid values and which ones grant access to your product:

| Status            | Grants access?     | Meaning                                                                                                        |
| ----------------- | ------------------ | -------------------------------------------------------------------------------------------------------------- |
| `draft`           | No                 | Internal setup state before any event is fired                                                                 |
| `pending_payment` | **No**             | Subscription created, waiting for the first charge to confirm                                                  |
| `trialing`        | **Yes**            | Trial active; card captured, no charge yet                                                                     |
| `active`          | **Yes**            | Paid and current                                                                                               |
| `past_due`        | Yes (grace period) | A renewal charge failed; dunning retries in progress — usage and seats keep working, new purchases are blocked |
| `canceled`        | No                 | Terminal — the cancellation executed at period end, or dunning exhausted its retries                           |

Typical flow:

```
draft → pending_payment → trialing → active ⇄ past_due
                  │                   ↑ │        │
                  └───────────────────┘ ↓        ↓
                                         canceled
```

- Without a trial, `pending_payment` goes straight to `active` when the first charge confirms; with one, it goes to `trialing`.
- `trialing → active` happens when the trial converts — and also when it expires: trial expiry activates the subscription and regular billing begins.
- `active ⇄ past_due`: a failed renewal starts dunning; a recovered payment returns the subscription to `active`.
- `canceled` is terminal, reached when a scheduled cancellation executes at period end or when dunning exhausts its retries.

Rule of thumb: gate access on `status === "active" || status === "trialing"`. Rely on `subscription.activated` to turn access on and `subscription.canceled` to turn it off.
