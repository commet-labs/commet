---
lastModified: 2026-07-28
title: Configure Features
description: Define capabilities and read current or prospective customer access.
---

Features are reusable capabilities that can be attached to several plans with different limits and prices.

## Feature types

| Type      | Use it for                                      |
| --------- | ----------------------------------------------- |
| `boolean` | On/off capabilities such as SSO                 |
| `usage`   | Metered quantities such as API calls            |
| `seats`   | Per-user licenses                               |
| `quota`   | Durable integer balances that can rise and fall |

The feature code is the identifier used by Feature Access, Usage, Seats, and Quota. Use lowercase letters, numbers, and underscores.

## Current feature state

Use `featureAccess.get` to read whether the customer currently has access and the feature's current counters:

**TypeScript**

```typescript
import { Commet } from "@commet/node";

const commet = new Commet({ apiKey: "ck_xxx" });

const featureAccess = await commet.featureAccess.get({
  code: "api_calls",
  customerId: "user_123",
});
```

**Python**

```python
from commet import Commet

commet = Commet("ck_xxx")

feature_access = commet.feature_access.get(
    "api_calls",
    customer_id="user_123",
)
```

**Go**

```go
client, err := commet.New("ck_xxx")
if err != nil {
	log.Fatal(err)
}
ctx := context.Background()

featureAccess, err := client.FeatureAccess.Get(ctx, "api_calls", &commet.GetFeatureAccessParams{
	CustomerID: "user_123",
})
if err != nil {
	log.Fatal(err)
}
```

**Java**

```java
import co.commet.Commet;
import co.commet.params.GetFeatureAccessParams;

var commet = Commet.builder().apiKey("ck_xxx").build();

var featureAccess = commet.featureAccess().get(
    "api_calls",
    GetFeatureAccessParams.builder("user_123").build()
);
```

**PHP**

```php
use Commet\Commet;

$commet = new Commet('ck_xxx');

$featureAccess = $commet->featureAccess->get(
    code: 'api_calls',
    customerId: 'user_123',
);
```

The exact response is discriminated by feature `type`. It can include enabled state, usage, included units, remaining units, seats, or quota values.

Use the list operation to retrieve the customer's complete current feature state:

**TypeScript**

```typescript
import { Commet } from "@commet/node";

const commet = new Commet({ apiKey: "ck_xxx" });

const response = await commet.featureAccess.list({ customerId: "user_123" });
```

**Python**

```python
from commet import Commet

commet = Commet("ck_xxx")

feature_access_list_result = commet.feature_access.list(customer_id="user_123")
```

**Go**

```go
client, err := commet.New("ck_xxx")
if err != nil {
	log.Fatal(err)
}
ctx := context.Background()

featureAccessListResult, err := client.FeatureAccess.List(ctx, &commet.ListFeatureAccessParams{
	CustomerID: "user_123",
})
if err != nil {
	log.Fatal(err)
}
```

**Java**

```java
import co.commet.Commet;
import co.commet.params.ListFeatureAccessParams;

var commet = Commet.builder().apiKey("ck_xxx").build();

var featureAccessListResult = commet.featureAccess().list(
    ListFeatureAccessParams.builder("user_123").build()
);
```

**PHP**

```php
use Commet\Commet;

$commet = new Commet('ck_xxx');

$featureAccessListResult = $commet->featureAccess->list(customerId: 'user_123');
```

Feature Access lists return the standard `{ object, data, hasMore, nextCursor }` envelope.

## Prospective consumption

Use `usage.check` before an action when you need to know whether a specific quantity can be consumed and what it would cost:

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

The response is discriminated by the plan's consumption model:

- `metered` reports current, remaining, included, and overage pricing.
- `credits` reports the estimated credit cost and available pools.
- `balance` reports the estimated monetary amount and current balance.

Do not use Feature Access as a substitute for this prospective check. Feature Access describes current state; Usage Check evaluates the proposed consumption.

## Track the consumption

Once the action succeeds, record it through Usage:

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

Use the caller-owned `eventId` for the business event when retries must deduplicate it. Request idempotency is a separate transport option that maps to `Idempotency-Key`.

## Related

- [Track Usage](/docs/track-usage)
- [Consumption Models](/docs/consumption-models)
- [Seat Management](/docs/seat-management)
- [Quota Management](/docs/quota-management)
