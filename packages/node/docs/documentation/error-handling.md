---
lastModified: 2026-07-31
title: Error Handling
description: Handle errors with automatic retries and typed error classes
---

## Error Classes

### TypeScript

```typescript
import { CommetAPIError, CommetValidationError } from '@commet/node'

try {
  await commet.customers.create({ email: 'invalid' })
} catch (error) {
  if (error instanceof CommetValidationError) {
    console.log(error.validationErrors)
    // { email: ['Invalid email format'] }
  }

  if (error instanceof CommetAPIError) {
    console.log(error.statusCode, error.message)
  }
}
```

### Python

```python
from commet import CommetAPIError, CommetValidationError

try:
    commet.customers.create(email='invalid')
except CommetValidationError as e:
    print(e.validation_errors)
    # { 'email': ['Invalid email format'] }
except CommetAPIError as e:
    print(e.status_code, e)
```

### Go

```go
import (
    "errors"

    "github.com/commet-labs/commet-go/v9"
)

_, err := client.Customers.Create(ctx, &commet.CreateCustomerParams{Email: "invalid"})
if err != nil {
    var validationErr *commet.ValidationError
    if errors.As(err, &validationErr) {
        fmt.Println(validationErr.ValidationErrors)
        // map[email:[Invalid email format]]
    }

    var apiErr *commet.CommetError
    if errors.As(err, &apiErr) {
        fmt.Println(apiErr.StatusCode, apiErr.Message)
    }
}
```

### Java

```java
import co.commet.CommetApiException;
import co.commet.CommetValidationException;
import co.commet.params.CreateCustomerParams;

try {
    commet.customers().create(CreateCustomerParams.builder("invalid").build());
} catch (CommetValidationException e) {
    System.out.println(e.getValidationErrors());
    // { email: [Invalid email format] }
} catch (CommetApiException e) {
    System.out.println(e.getStatusCode() + " " + e.getMessage());
}
```

### PHP

```php
use Commet\Exceptions\ApiException;
use Commet\Exceptions\ValidationException;

try {
    $commet->customers->create(email: 'invalid');
} catch (ValidationException $e) {
    print_r($e->validationErrors);
    // [ 'email' => ['Invalid email format'] ]
} catch (ApiException $e) {
    echo $e->getStatusCode() . ' ' . $e->getMessage();
}
```

| Class                                                                         | Use case                         |
| ----------------------------------------------------------------------------- | -------------------------------- |
| `CommetAPIError` / `CommetApiException` / `ApiException`                      | HTTP errors (4xx, 5xx)           |
| `CommetValidationError` / `CommetValidationException` / `ValidationException` | Invalid input with field details |
| `CommetError` / `CommetException`                                             | Base class for all errors        |

Go exposes `*commet.CommetError` and `*commet.ValidationError` as concrete types — check them with `errors.As`.

## Error Code Reference

Every current API error includes a stable `code` and a version-matched `doc_url` such as [`customer_not_found`](/docs/api-reference/2026-07-31/errors/customer_not_found.md). The URL returns a dedicated English Markdown reference with handling and retry guidance for the resolved API version.

Keep the `x-request-id` response header when logging or reporting an error. Commet records the same identifier in Platform, allowing the request to be correlated without including credentials or customer data.

## Automatic Retries

Failed requests retry with exponential backoff (1s → 2s → 4s, max 8s).

**Retryable:** 408, 429, 500, 502, 503, 504

Rate limits are the exception to the backoff: a 429 is retried only when the response carries a `Retry-After` header, and the client waits exactly that value (capped at 30s) instead of backing off. A 429 without `Retry-After` is not retried.

### TypeScript

```typescript
const commet = new Commet({
  apiKey: process.env.COMMET_API_KEY!,
  retries: 3,  // default
})
```

### Python

```python
commet = Commet(
    api_key=os.environ['COMMET_API_KEY'],
    retries=3,  # default
)
```

### Go

```go
client, err := commet.New(
    os.Getenv("COMMET_API_KEY"),
    commet.WithRetries(3), // default
)
```

### Java

```java
Commet commet = Commet.builder()
    .apiKey(System.getenv("COMMET_API_KEY"))
    .retries(3) // default
    .build();
```

### PHP

```php
$commet = new Commet(
    apiKey: getenv('COMMET_API_KEY'),
    retries: 3, // default
);
```

## Non-Blocking Usage

Don't let tracking errors break your app:

### TypeScript

```typescript
commet.usage.track({
  customerId: 'user_123',
  featureCode: 'api_calls',
}).catch(console.error)

// Continue without waiting
```

### Python

```python
try:
    commet.usage.track(customer_id='user_123', feature_code='api_calls')
except Exception as e:
    logger.error(e)

# Continue without waiting
```

### Go

```go
go func() {
    _, err := client.Usage.Track(context.Background(), &commet.TrackUsageParams{
        CustomerID: "user_123",
        FeatureCode: "api_calls",
    })
    if err != nil {
        log.Printf("track failed: %v", err)
    }
}()

// Continue without waiting
```

### Java

```java
CompletableFuture.runAsync(() -> {
    try {
        commet.usage().track(
            TrackUsageParams.builder("api_calls", "user_123")
                .customerId("user_123")
                .build()
        );
    } catch (Exception e) {
        log.error("track failed", e);
    }
});

// Continue without waiting
```

### PHP

```php
try {
    $commet->usage->track(
        customerId: 'user_123',
        featureCode: 'api_calls',
    );
} catch (\Throwable $e) {
    error_log($e->getMessage());
}

// Continue without waiting
```
