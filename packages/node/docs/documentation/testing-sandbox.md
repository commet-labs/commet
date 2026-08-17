---
lastModified: 2026-08-12
title: Testing
description: Test safely with sandbox environment
---

Sandbox is the default environment — completely isolated from production.

## Test Flow

```typescript
// 1. Create customer
const customerId = `test_${Date.now()}`
const customer = await commet.customers.create({
  email: 'test@example.com',
  id: customerId,
})

// 2. Create subscription
const subscription = await commet.subscriptions.create({
  customerId,
  planCode: 'pro',
})

// 3. Pay with test card at checkoutUrl

// 4. Track usage
await commet.usage.track({
  customerId,
  featureCode: 'api_calls',
})
```

## Dev Tools Panel

A floating widget that appears on all sandbox pages. The [**Test Clock**](#test-clock) tab is available everywhere. The [**Test Data**](#test-data) tab (address and card presets) only appears on checkout pages.

### Test Clock

Simulate future dates to test billing cycles, renewals, and prorations without waiting for real time to pass. Advancing the clock from the dashboard processes every due billing deadline before the clock reaches the selected time.

**Current Time** — displays the simulated time in UTC, or the real time if no simulation is active.

**Set Time** — pick a future date from a calendar. Before the run starts, the panel shows the target time and the number of currently scheduled deadlines it expects to process. Time can only move forward and cannot be reverted.

**Quick Advance** — jump forward by a preset amount:

| Button     | Days |
| ---------- | ---- |
| + 1 Day    | 1    |
| + 1 Week   | 7    |
| + 2 Weeks  | 14   |
| + 1 Month  | 30   |
| + 3 Months | 90   |

**Run progress** — after confirmation, the panel processes due renewals, trial endings, scheduled changes, cancellations, entitlement resets, and dunning retries in chronological order. Progress and per-subscription outcomes remain visible if you reload or reopen the panel.

**Example workflow:** choose **+ 1 Month**, review the estimated impact, then confirm **Advance and Process**. The clock reaches the target after the run finishes.

#### Test Clock with the SDK

The API starts the same durable run as the dashboard. Advancing the clock returns `202 Accepted` with the new run; poll the clock state to follow its progress and terminal per-deadline outcomes. These methods are sandbox only.

**Read the current state**

### TypeScript

```typescript
const clock = await commet.testClock.get()
```

### Python

```python
clock = commet.test_clock.get()
```

### Go

```go
clock, err := client.TestClock.Get(ctx)
```

### Java

```java
var clock = commet.testClock().get();
```

### PHP

```php
$clock = $commet->testClock->get();
```

### cURL

```bash
curl "https://commet.co/api/v1/test-clock" \
  -H "x-api-key: $COMMET_API_KEY"
```

**Advance the clock and process billing**

Move the clock forward and process every billing deadline due before the target time. The clock can only move forward.

### TypeScript

```typescript
await commet.testClock.advance({ advanceDays: 30 })
```

### Python

```python
commet.test_clock.advance(advance_days=30)
```

### Go

```go
days := 30
_, err := client.TestClock.Advance(ctx, &commet.AdvanceTestClockParams{
    AdvanceDays: &days,
})
```

### Java

```java
commet.testClock().advance(AdvanceTestClockParams.builder().advanceDays(30L).build());
```

### PHP

```php
$commet->testClock->advance(advanceDays: 30);
```

### cURL

```bash
curl -X POST https://commet.co/api/v1/test-clock \
  -H "x-api-key: $COMMET_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"advanceDays": 30}'
```

The former `POST /test-clock/process-billing` operation is deprecated and returns `410 Gone`. Remove separate `processBilling()` calls; advancing the clock now performs that work automatically.

### Test Data

The Test Data tab automates checkout form filling with valid, country-specific test data. Open it from the Dev Tools panel on any sandbox checkout page.

**Address autofill** — select a country and the checkout form is automatically filled with a valid name, email, street, city, state, and postal code for that country. No need to type anything manually.

**Country-specific test cards** — after selecting a country, the panel shows the test cards that match that country. Click one and the card fields are filled for you. Expiry and CVC are always `12/34` and `123`.

**Failure scenarios** — the panel also offers generic cards to test error handling: declined payment, insufficient funds, and expired card. For 3D Secure authentication, use the cards in the table below.

#### Test cards by country

| Country                   | Card                  | Brand        |
| ------------------------- | --------------------- | ------------ |
| United States (US)        | `4242 4242 4242 4242` | Visa         |
| Argentina (AR)            | `4000 0032 0000 0021` | Visa         |
| Australia (AU)            | `4000 0003 6000 0006` | Visa         |
| Austria (AT)              | `4000 0004 0000 0008` | Visa         |
| Belarus (BY)              | `4000 0011 2000 0005` | Visa         |
| Belgium (BE)              | `4000 0005 6000 0004` | Visa         |
| Brazil (BR)               | `4000 0076 0000 0002` | Visa         |
| Bulgaria (BG)             | `4000 0010 0000 0000` | Visa         |
| Canada (CA)               | `4000 0012 4000 0000` | Visa         |
| Chile (CL)                | `4000 0015 2000 0001` | Visa         |
| China (CN)                | `4000 0015 6000 0002` | Visa         |
| Colombia (CO)             | `4000 0017 0000 0003` | Visa         |
| Costa Rica (CR)           | `4000 0018 8000 0005` | Visa         |
| Croatia (HR)              | `4000 0019 1000 0009` | Visa         |
| Cyprus (CY)               | `4000 0019 6000 0008` | Visa         |
| Czechia (CZ)              | `4000 0020 3000 0002` | Visa         |
| Denmark (DK)              | `4000 0020 8000 0001` | Visa         |
| Ecuador (EC)              | `4000 0021 8000 0000` | Visa         |
| Estonia (EE)              | `4000 0023 3000 0009` | Visa         |
| Finland (FI)              | `4000 0024 6000 0001` | Visa         |
| France (FR)               | `4000 0025 0000 0003` | Visa         |
| Germany (DE)              | `4000 0027 6000 0016` | Visa         |
| Gibraltar (GI)            | `4000 0029 2000 0005` | Visa         |
| Greece (GR)               | `4000 0030 0000 0030` | Visa         |
| Hong Kong (HK)            | `4000 0034 4000 0004` | Visa         |
| Hungary (HU)              | `4000 0034 8000 0005` | Visa         |
| India (IN)                | `4000 0035 6000 0008` | Visa         |
| Ireland (IE)              | `4000 0037 2000 0005` | Visa         |
| Italy (IT)                | `4000 0038 0000 0008` | Visa         |
| Japan (JP)                | `4000 0039 2000 0003` | Visa         |
| Japan (JP)                | `3530 1113 3330 0000` | JCB          |
| Latvia (LV)               | `4000 0042 8000 0005` | Visa         |
| Liechtenstein (LI)        | `4000 0043 8000 0004` | Visa         |
| Lithuania (LT)            | `4000 0044 0000 0000` | Visa         |
| Luxembourg (LU)           | `4000 0044 2000 0006` | Visa         |
| Malaysia (MY)             | `4000 0045 8000 0002` | Visa         |
| Malta (MT)                | `4000 0047 0000 0007` | Visa         |
| Mexico (MX)               | `4000 0048 4000 8001` | Visa         |
| Mexico (MX)               | `5062 2100 0000 0009` | Carnet       |
| Netherlands (NL)          | `4000 0052 8000 0002` | Visa         |
| New Zealand (NZ)          | `4000 0055 4000 0008` | Visa         |
| Norway (NO)               | `4000 0057 8000 0007` | Visa         |
| Panama (PA)               | `4000 0059 1000 0000` | Visa         |
| Paraguay (PY)             | `4000 0060 0000 0066` | Visa         |
| Peru (PE)                 | `4000 0060 4000 0068` | Visa         |
| Poland (PL)               | `4000 0061 6000 0005` | Visa         |
| Portugal (PT)             | `4000 0062 0000 0007` | Visa         |
| Romania (RO)              | `4000 0064 2000 0001` | Visa         |
| Saudi Arabia (SA)         | `4000 0068 2000 0007` | Visa         |
| Singapore (SG)            | `4000 0070 2000 0003` | Visa         |
| Slovakia (SK)             | `4000 0070 3000 0001` | Visa         |
| Slovenia (SI)             | `4000 0070 5000 0006` | Visa         |
| Spain (ES)                | `4000 0072 4000 0007` | Visa         |
| Sweden (SE)               | `4000 0075 2000 0008` | Visa         |
| Switzerland (CH)          | `4000 0075 6000 0009` | Visa         |
| Taiwan (TW)               | `4000 0015 8000 0008` | Visa         |
| Thailand (TH)             | `4000 0076 4000 0003` | Visa         |
| Thailand (TH)             | `4000 0576 4000 0008` | Visa (debit) |
| United Arab Emirates (AE) | `4000 0078 4000 0001` | Visa         |
| United Arab Emirates (AE) | `5200 0078 4000 0022` | Mastercard   |
| United Kingdom (GB)       | `4000 0082 6000 0000` | Visa         |
| United Kingdom (GB)       | `4000 0582 6000 0005` | Visa (debit) |
| United Kingdom (GB)       | `5555 5582 6555 4449` | Mastercard   |
| Uruguay (UY)              | `4000 0085 8000 0003` | Visa         |

#### Failure scenarios

| Card                  | Scenario           |
| --------------------- | ------------------ |
| `4000 0000 0000 9995` | Insufficient funds |
| `4000 0000 0000 0002` | Card declined      |
| `4000 0000 0000 0069` | Expired card       |

#### 3D Secure

| Card                  | Description             |
| --------------------- | ----------------------- |
| `4000 0000 0000 3220` | Requires authentication |
| `4000 0025 0000 3155` | Requires authentication |

## Production

```typescript
const commet = new Commet({
  apiKey: process.env.COMMET_PRODUCTION_KEY!,
})
```
