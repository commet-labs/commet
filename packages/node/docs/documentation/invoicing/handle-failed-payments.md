---
lastModified: 2026-07-28
title: Handle Failed Payments
description: What happens when a customer's payment fails and how they can reactivate from the Customer Portal.
---

When a renewal payment fails, the subscription moves to `past_due` and enters dunning. The customer keeps service during this grace window while Commet retries the charge. Customers can reactivate sooner from the Customer Portal by retrying payment or updating their card.

## What happens when a payment fails

1. The subscription status changes to `past_due`
2. The failed invoice is marked as `outstanding`
3. The customer keeps service: usage events and seat events still work (usage accrues as debt)
4. The customer receives an email notification
5. Commet retries the charge on a fixed schedule (dunning)

If a retry succeeds, the subscription returns to `active`. If all retries fail, the subscription is canceled and the invoice is marked as `uncollectible`.

## Provider error mapping

Commet translates provider responses into a common payment outcome and keeps the provider detail alongside it. For recurring failures, the [`payment.failed`](/docs/webhooks/payment-failed) webhook exposes `failureCode`, `failureMessage`, and a `recoveryUrl` when a recovery path is available. The exact `failureCode` depends on the provider, so use the normalized outcome and the recovery URL for customer handling instead of matching only one provider's raw codes.

| Payment outcome                      | What it means                                                     | What to do                                                                                                         |
| ------------------------------------ | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `requires_action`                    | The provider needs an additional customer step, such as 3D Secure | Keep the customer in checkout and complete the authentication flow                                                 |
| `PAYMENT_FAILED` with a decline code | The provider rejected the charge                                  | Show a retry or alternate payment method and record the provider code for support                                  |
| `payment.failed`                     | A recurring charge failed and the invoice entered dunning         | Keep service during the grace window, communicate the recovery path, and wait for a retry or recovery              |
| `payment.retry_failed`               | All scheduled dunning retries were exhausted                      | Revoke access according to your product policy and ask the customer to start a new subscription or contact support |

Initial checkout card declines do not emit `payment.failed`; the checkout response carries the failure state directly. Recurring failures use the dunning flow below.

## Automatic retries

Retries run on day 1, day 3, day 5, and day 7 after the original failure (4 retries). The calendar is anchored to the failure and never moves. After the last failed retry the subscription is canceled.

Manual retries — from the Customer Portal or [`reactivate`](#retry-the-charge-server-to-server) — count against the same calendar: a declined manual retry consumes the next scheduled slot. Four declined retries cancel the subscription even before day 7.

Retries use the payment connection already associated with the subscription. Changing country routing does not move the retry to another provider, and Commet does not silently switch a saved payment method to a different account.

## Dunning communications

Commet sends a payment-failure notification when a recurring charge enters dunning. For product-specific messaging, subscribe to these webhooks:

- [`payment.failed`](/docs/webhooks/payment-failed) — a recurring charge failed; use `failureCode`, `failureMessage`, and `recoveryUrl` to explain the next step.
- [`payment.recovered`](/docs/webhooks/payment-recovered) — the outstanding invoice was paid and the subscription returned to `active`.
- [`payment.retry_failed`](/docs/webhooks/payment-retry-failed) — all retries were exhausted and the subscription was canceled.

Send your own email, SMS, or in-app message when you need product-specific copy. Do not create a second retry schedule in your app; use Commet's events to close the communication loop.

## Check subscription status

### TypeScript

```typescript
const subscription = await commet.subscriptions.getActive({ customerId: 'user_123' })

if (subscription?.status === 'past_due') {
  showRecoveryPrompt()
}
```

### Python

```python
subscription = commet.subscriptions.get_active(customer_id='user_123')

if subscription is not None and subscription.status == 'past_due':
    show_recovery_prompt()
```

### Go

```go
subscription, err := client.Subscriptions.GetActive(ctx, &commet.GetActiveSubscriptionParams{CustomerID: "user_123"})
if err != nil {
    log.Fatal(err)
}
if subscription != nil && subscription.Status == "past_due" {
    showRecoveryPrompt()
}
```

### Java

```java
var subscription = commet.subscriptions().getActive(GetActiveSubscriptionParams.builder("user_123").build());

if (subscription != null && subscription.status() == SubscriptionStatus.PAST_DUE) {
    showRecoveryPrompt();
}
```

### PHP

```php
$result = $commet->subscriptions->getActive('user_123');

if ($result !== null && $result->status->value === 'past_due') {
    showRecoveryPrompt();
}
```

### cURL

```bash
curl "https://commet.co/api/v1/subscriptions/active?customerId=user_123" \
  -H "x-api-key: $COMMET_API_KEY"
```

## Gate access based on status

Commet keeps serving `past_due` customers during the dunning window — usage and seat events still work. You decide whether to gate your own product on `past_due`. To grant access only while billing is healthy, treat `active` and `trialing` as the access states:

### TypeScript

```typescript
const subscription = await commet.subscriptions.getActive({ customerId: 'user_123' })

const hasAccess = subscription !== null &&
  (subscription.status === 'active' || subscription.status === 'trialing')
```

### Python

```python
subscription = commet.subscriptions.get_active(customer_id='user_123')

has_access = subscription is not None and subscription.status in ('active', 'trialing')
```

### Go

```go
subscription, err := client.Subscriptions.GetActive(ctx, &commet.GetActiveSubscriptionParams{CustomerID: "user_123"})
if err != nil {
    log.Fatal(err)
}
hasAccess := subscription != nil &&
    (subscription.Status == "active" || subscription.Status == "trialing")
```

### Java

```java
var subscription = commet.subscriptions().getActive(GetActiveSubscriptionParams.builder("user_123").build());

boolean hasAccess = subscription != null &&
    (subscription.status() == SubscriptionStatus.ACTIVE ||
        subscription.status() == SubscriptionStatus.TRIALING);
```

### PHP

```php
$result = $commet->subscriptions->getActive('user_123');

$hasAccess = $result !== null &&
    in_array($result->status->value, ['active', 'trialing'], true);
```

### cURL

```bash
curl "https://commet.co/api/v1/subscriptions/active?customerId=user_123" \
  -H "x-api-key: $COMMET_API_KEY"
```

## Recover a subscription programmatically

The SDK exposes three server-side recovery primitives. For `past_due` subscriptions they all operate on the same `outstanding` renewal invoice — none of them void it. `reactivate` also reactivates `canceled` subscriptions.

### Retry the charge server-to-server

`reactivate` charges the subscription's saved payment method. It works on both `past_due` and `canceled` subscriptions, with different effects:

- `past_due`: retries the same outstanding renewal invoice. The billing anchor stays fixed. On success the subscription returns to `active` and `payment.recovered` fires.
- `canceled`: generates a fresh invoice, resets the billing period anchor to now, and charges the saved card. On success the subscription returns to `active` and `subscription.reactivated` fires. Requires the plan to still be available in the subscription's currency, otherwise it returns `PLAN_UNAVAILABLE` (422).

```typescript
const result = await commet.subscriptions.reactivate({ id: 'sub_123' })

// result.retryInitiated === true
```

On a declined charge or no saved card, the response returns a `recoveryUrl` in the error details — a hosted page where the customer adds a new card and pays. This matters for subscriptions canceled by dunning: they reached `canceled` precisely because the saved card kept failing.

### Send the customer a recovery link

`createRecoveryLink` returns a hosted, signed link so the customer pays the outstanding renewal themselves. Deliver it through your own email, SMS, or dashboard. The link stays valid until the charge is paid or the subscription is no longer `past_due`.

The [`payment.failed` webhook](/docs/webhooks/payment-failed) already carries a `recoveryUrl`: the checkout URL for a first failed charge, a signed recovery link for a failed renewal. If you consume webhooks, no separate `createRecoveryLink` call is needed.

```typescript
const recovery = await commet.subscriptions.createRecoveryLink({ id: 'sub_123' })

// recovery.url   → hosted payment page
// recovery.token → signed token embedded in the URL
```

### Update the payment method

`updatePaymentMethod` returns a hosted checkout where the customer updates the subscription's default payment method.

```typescript
const paymentMethodUpdate = await commet.subscriptions.updatePaymentMethod({
  id: 'sub_123',
  successUrl: 'https://yourapp.com/billing',
})

// redirect(paymentMethodUpdate.checkoutUrl)
```

## Self-serve recovery

Customers in `past_due` see their subscription in the [Customer Portal](/docs/customer-portal) with a **Reactivate Subscription** button. They can choose:

- **Retry with their current card** — useful when the failure was temporary (insufficient funds that are now available, a bank hold that cleared).
- **Update their payment method** — enter a new card through the subscription's payment provider and retry in the same step.

A successful retry settles the outstanding invoice, moves the subscription back to `active`, and emits a `payment.recovered` event. A declined retry consumes the next slot on the dunning calendar. Retry attempts are rate-limited to 3 per day per customer.

## Prompt payment update

Redirect customers to the Customer Portal to reactivate:

### TypeScript

```typescript
const portal = await commet.portal.getUrl({ customerId: 'user_123' })

redirect(portal.portalUrl)
```

### Python

```python
portal = commet.portal.get_url(customer_id='user_123')

redirect(portal.portal_url)
```

### Go

```go
portal, err := client.Portal.GetURL(ctx, &commet.GetPortalURLParams{
    CustomerID: "user_123",
})

// redirect(portal.PortalURL)
```

### Java

```java
var portal = commet.portal().getUrl(RequestPortalAccessParams.builder().customerId("user_123").build());

// redirect(portal.portalUrl())
```

### PHP

```php
$portal = $commet->portal->getUrl(customerId: 'user_123');

redirect($portal->portalUrl);
```

### cURL

```bash
curl -X POST https://commet.co/api/v1/portal/request-access \
  -H "x-api-key: $COMMET_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"customerId": "user_123"}'
```

## Related

- [Invoices and Billing Cycles](/docs/invoices-and-billing-cycles) — Invoice types and charge timing
- [Manage Subscriptions](/docs/manage-subscriptions) — Create and manage customer subscriptions
- [Customer Portal](/docs/customer-portal) — Self-service billing portal for customers
- [Payment Providers](/docs/payment-providers) — How Commet routes payments through Commet, Stripe, or dLocal
- [Payment Orchestration](/docs/payment-orchestration) — Country routing, defaults, and provider-bound payment methods
