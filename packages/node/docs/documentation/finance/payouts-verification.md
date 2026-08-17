---
lastModified: 2026-08-10
title: Account Verification
description: How to get verified for payouts — complete the KYC form in the Commet dashboard.
---

Organizations using their own payment connection can start accepting payments immediately. Commet-managed payment processing remains unavailable until merchant review and identity verification are complete.

> **Note: Live organizations only**
>
> Payout verification is unavailable in sandbox. Switch to your live organization before submitting business, identity, document, or bank information.

## How it works

Click **Verify Account** in the finance section to start the one-time KYC process — a multi-step form in the Commet dashboard: business info → personal info → identity document → bank account. Commet submits it to the payment provider for review, then wait for approval — usually a few days.

Your country is set in the first step and locks once the verification is submitted to the provider. Contact support to correct it after that.

## What you'll need

- **Business information**: Company name, address, registration number
- **Personal information**: For business owners and directors
- **Identity document**: Government-issued ID for the account holder
- **Bank account details**: Where you want payouts sent

## Security

Verification data is collected in the Commet dashboard and submitted to the payment provider for KYC review. Full bank account numbers are never returned by the API — only the last 4 digits.

> **Note**
>
> Approval can take several days. You'll be notified when your account is ready.

## Manage payouts with the SDK

After completing verification in the Commet dashboard, you can add destination bank accounts and withdraw your balance programmatically.

### Verification API

`POST /api/v1/payouts/verification` is deprecated and no longer accepts or processes KYC data. Authenticated requests return `410 Gone` with the `endpoint_deprecated` error code.

> **Warning: Complete verification in the dashboard**
>
> Do not send business, identity, document, or bank information to this endpoint. Use the one-time verification flow in your live organization's finance section.

```json
{
  "error": {
    "code": "endpoint_deprecated",
    "message": "The payout verification API is deprecated. Complete KYC in the Commet dashboard."
  }
}
```

### Add a bank account

Add an additional destination bank account to an existing payout account. Country and currency are resolved from your organization. The full account number is never returned — only `last4`.

### TypeScript

```typescript
const account = await commet.payouts.addBankAccount({
  accountNumber: '000123456789',
  accountHolderName: 'Jane Doe',
  routingNumber: '110000000',
  accountType: 'checking',
  setDefault: true,
})
```

### Python

```python
account = commet.payouts.add_bank_account(
    account_number="000123456789",
    account_holder_name="Jane Doe",
    routing_number="110000000",
    account_type="checking",
    set_default=True,
)
```

### Go

```go
account, err := client.Payouts.AddBankAccount(ctx, &commet.AddPayoutBankAccountParams{
    AccountNumber:     "000123456789",
    AccountHolderName: "Jane Doe",
})
```

### Java

```java
var account = commet.payouts().addBankAccount(
    AddPayoutBankAccountParams.builder("000123456789", "Jane Doe")
        .routingNumber("110000000")
        .accountType("checking")
        .setDefault(true)
        .build()
);
```

### PHP

```php
$account = $commet->payouts->addBankAccount(
    accountNumber: '000123456789',
    accountHolderName: 'Jane Doe',
    routingNumber: '110000000',
    accountType: 'checking',
    setDefault: true,
);
```

### cURL

```bash
curl -X POST https://commet.co/api/v1/payouts/bank-accounts \
  -H "x-api-key: $COMMET_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "accountNumber": "000123456789",
    "accountHolderName": "Jane Doe",
    "routingNumber": "110000000",
    "accountType": "checking",
    "setDefault": true
  }'
```

### Request a payout

Withdraw available balance to your verified payout account. `amount` is in cents (USD, minimum `1000` = $10). The payout is created in `pending` and settles to `paid` asynchronously as provider webhooks arrive.

### TypeScript

```typescript
const payout = await commet.payouts.request({
  amount: 50000,
  description: 'March payout',
})
```

### Python

```python
payout = commet.payouts.request(amount=50000, description="March payout")
```

### Go

```go
description := "March payout"
payout, err := client.Payouts.Request(ctx, &commet.RequestPayoutParams{
    Amount:      50000,
    Description: &description,
})
```

### Java

```java
var payout = commet.payouts().request(
    RequestPayoutParams.builder(50000).description("March payout").build()
);
```

### PHP

```php
$payout = $commet->payouts->request(amount: 50000, description: 'March payout');
```

### cURL

```bash
curl -X POST https://commet.co/api/v1/payouts \
  -H "x-api-key: $COMMET_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"amount": 50000, "description": "March payout"}'
```

## Related

- [Finance Overview](/docs/finance-overview) — Balances, payouts, and transaction history
- [Merchant of Record](/docs/merchant-of-record) — How Commet handles taxes and compliance
