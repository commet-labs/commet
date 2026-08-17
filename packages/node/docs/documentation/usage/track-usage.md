---
lastModified: 2026-07-28
title: Track Usage
description: Record metered consumption with the current Commet SDKs.
---

Every metered feature has one code. Send that code as `featureCode`; Commet aggregates events for access, credits, balance, and billing.

## Track an event

**TypeScript**

```typescript
import { Commet } from "@commet/node";

const commet = new Commet({ apiKey: "ck_xxx" });

const usageEvent = await commet.usage.track({
  featureCode: "api_calls",
  customerId: "user_123",
  model: "example",
  inputTokens: 1,
  outputTokens: 1,
});
```

**Python**

```python
from commet import Commet

commet = Commet("ck_xxx")

usage_event = commet.usage.track(
    feature_code="api_calls",
    customer_id="user_123",
    model="example",
    input_tokens=1,
    output_tokens=1,
)
```

**Go**

```go
client, err := commet.New("ck_xxx")
if err != nil {
	log.Fatal(err)
}
ctx := context.Background()

usageEvent, err := client.Usage.Track(ctx, &commet.TrackUsageParams{
	FeatureCode: "api_calls",
	CustomerID: "user_123",
	Model: func(value string) *string { return &value }("example"),
	InputTokens: func(value int) *int { return &value }(1),
	OutputTokens: func(value int) *int { return &value }(1),
})
if err != nil {
	log.Fatal(err)
}
```

**Java**

```java
import co.commet.Commet;
import co.commet.params.TrackUsageParams;

var commet = Commet.builder().apiKey("ck_xxx").build();

var usageEvent = commet.usage().track(
    TrackUsageParams.builder("api_calls", "user_123").model("example").inputTokens(1L).outputTokens(1L).build()
);
```

**PHP**

```php
use Commet\Commet;

$commet = new Commet('ck_xxx');

$usageEvent = $commet->usage->track(
    featureCode: 'api_calls',
    customerId: 'user_123',
    model: 'example',
    inputTokens: 1,
    outputTokens: 1,
);
```

The request accepts:

| Field         | Required | Meaning                                                    |
| ------------- | -------- | ---------------------------------------------------------- |
| `featureCode` | Yes      | Metered feature code                                       |
| `customerId`  | Yes      | Commet customer ID or your stable customer ID              |
| `value`       | No       | Numeric quantity; defaults to one for normal usage events  |
| `eventId`     | No       | Caller-owned business event ID used to deduplicate retries |
| `timestamp`   | No       | ISO 8601 event time; defaults to now                       |
| `properties`  | No       | String property entries for attribution and debugging      |

AI-model events use the same operation but send `model`, `inputTokens`, and `outputTokens` instead of `value`.

## Business event ID vs request idempotency

`eventId` identifies the consumption event in your system. Reuse it when the same event is retried.

Request idempotency protects one HTTP mutation and is passed through the SDK's request options as `idempotencyKey`. It becomes the `Idempotency-Key` header. Do not put that transport key in the usage body.

```typescript
await commet.usage.track(
  {
    featureCode: 'api_calls',
    customerId: 'user_123',
    value: 1,
    eventId: 'request_01JXYZ',
  },
  { idempotencyKey: 'delivery_01JXYZ' },
)
```

## Correct current-period usage

Use `set` when your source of truth needs to replace the current metered total:

**TypeScript**

```typescript
import { Commet } from "@commet/node";

const commet = new Commet({ apiKey: "ck_xxx" });

const usageAdjustment = await commet.usage.set({
  customerId: "user_123",
  featureCode: "api_calls",
  value: 1,
});
```

**Python**

```python
from commet import Commet

commet = Commet("ck_xxx")

usage_adjustment = commet.usage.set(
    customer_id="user_123",
    feature_code="api_calls",
    value=1,
)
```

**Go**

```go
client, err := commet.New("ck_xxx")
if err != nil {
	log.Fatal(err)
}
ctx := context.Background()

usageAdjustment, err := client.Usage.Set(ctx, &commet.SetUsageParams{
	CustomerID: "user_123",
	FeatureCode: "api_calls",
	Value: 1,
})
if err != nil {
	log.Fatal(err)
}
```

**Java**

```java
import co.commet.Commet;
import co.commet.params.SetUsageParams;

var commet = Commet.builder().apiKey("ck_xxx").build();

var usageAdjustment = commet.usage().set(
    SetUsageParams.builder("user_123", "api_calls", 1L).build()
);
```

**PHP**

```php
use Commet\Commet;

$commet = new Commet('ck_xxx');

$usageAdjustment = $commet->usage->set(
    customerId: 'user_123',
    featureCode: 'api_calls',
    value: 1,
);
```

`value` is the desired total, not a delta. Commet records a signed adjustment and preserves the original event trail. This operation applies only to the active metered period.

## Check before consuming

When access or cost depends on the proposed quantity, call Usage Check before performing the action:

**TypeScript**

```typescript
import { Commet } from "@commet/node";

const commet = new Commet({ apiKey: "ck_xxx" });

const usageCheck = await commet.usage.check({
  customerId: "user_123",
  featureCode: "api_calls",
});
```

**Python**

```python
from commet import Commet

commet = Commet("ck_xxx")

usage_check = commet.usage.check(
    customer_id="user_123",
    feature_code="api_calls",
)
```

**Go**

```go
client, err := commet.New("ck_xxx")
if err != nil {
	log.Fatal(err)
}
ctx := context.Background()

usageCheck, err := client.Usage.Check(ctx, &commet.CheckUsageAvailabilityParams{
	CustomerID: "user_123",
	FeatureCode: "api_calls",
})
if err != nil {
	log.Fatal(err)
}
```

**Java**

```java
import co.commet.Commet;
import co.commet.params.CheckUsageAvailabilityParams;

var commet = Commet.builder().apiKey("ck_xxx").build();

var usageCheck = commet.usage().check(
    CheckUsageAvailabilityParams.builder("user_123", "api_calls").build()
);
```

**PHP**

```php
use Commet\Commet;

$commet = new Commet('ck_xxx');

$usageCheck = $commet->usage->check(
    customerId: 'user_123',
    featureCode: 'api_calls',
);
```

## Related

- [Configure Features](/docs/configure-features)
- [AI Token Billing](/docs/ai-token-billing)
- [Consumption Models](/docs/consumption-models)
