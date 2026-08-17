---
lastModified: 2026-07-16
title: Local Currency Taxes
description: Banks in some countries add taxes or surcharges on top of local currency payments. What they are, where they apply, and how to handle customer questions.
---

When customers pay in their local currency, their bank or card issuer may add country-specific taxes or surcharges on top of the amount Commet charges. These charges are collected by the customer's bank on behalf of local tax authorities — Commet does not apply them, does not receive them, and cannot refund them.

## Why this happens

Commet acts as the [Merchant of Record](/docs/merchant-of-record), so even when a customer pays in their own currency, the transaction may be processed as a cross-border purchase from a foreign merchant. Some countries require card issuers to collect taxes or tax perceptions on these transactions at the moment of payment.

The result: the total on the customer's bank statement can be higher than the price shown at checkout. The tax appears as a separate line item charged by the bank, not as part of the Commet charge.

## Where it applies

| Country             | What customers may see                                                                                                                              |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Argentina**       | Tax perceptions on cross-border card payments, historically up to 30% (e.g. "impuesto PAÍS" and income tax perceptions), applied by the card issuer |
| **Other countries** | Cross-border transaction fees or local tax withholdings, depending on the customer's bank and local regulation                                      |

Rates and rules change frequently and vary by bank, card type, and local regulation. The customer's bank determines the final amount.

> **Note**
>
> These charges apply per transaction and are independent of the currency configured in your plan. Paying in local currency does not by itself exempt the customer from cross-border taxes.

## What this means for your customers

- **It is not a duplicate charge.** The Commet charge and the bank's tax perception are separate line items on the statement.
- **Commet invoices show only the price you configured.** Bank-applied taxes never appear on the Commet invoice or receipt.
- **Refunds don't include bank taxes.** If you refund a payment, Commet returns the amount it charged. Tax perceptions are refunded (or credited) by the customer's bank or tax authority under local rules.

If a customer asks about an unexpected extra charge, direct them to their card issuer — the bank can confirm which tax was applied and how to claim it back where local rules allow it.

## Related

- [Regional Prices](/docs/regional-prices) — Let customers pay in their own currency
- [Merchant of Record](/docs/merchant-of-record) — How Commet handles taxes and compliance on your behalf
- [Supported Countries](/docs/supported-countries) — Where Commet operates
