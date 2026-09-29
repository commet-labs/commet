---
lastModified: 2026-09-07
title: Quickstart
description: Go from a Commet account to your first subscription payment in sandbox.
---

Commet lets you charge through **subscriptions** and **one-time payments**.

- A **subscription** connects a customer to a plan. The plan defines what they can use and what they pay; Commet manages checkout, invoices, and renewals.
- A **one-time payment** charges a customer for a single purchase, without a plan or subscription. Follow [Accept One-Time Payments](/docs/accept-one-time-payments) if that is all you need.

This quickstart walks you through your first paid subscription in sandbox.

## Plans, features, and consumption

A **feature** is something your product provides, such as API calls, seats, or access to a capability. A **plan** groups features and sets their limits and prices.

Each plan uses one consumption model to define how its measured usage consumes the included allowance and is charged:

| Model       | How it works                                                                                                                  |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Metered** | Count usage per feature. Include a quantity in the plan and optionally charge for usage above it.                             |
| **Credits** | Give the customer a pool of credits. Each use deducts the number of credits configured for that feature.                      |
| **Balance** | Give the customer a monetary balance. Each use deducts its monetary cost; the plan can block when exhausted or allow overage. |

A fixed monthly price can include features without extra usage charges. You do not need to charge for overage to use a plan.

For this walkthrough, use a **Metered** plan with a monthly price and an included API-call allowance. See [Consumption Models](/docs/consumption-models) when you need to configure a different model.

## Your first subscription payment

1. [Create a Commet account](/login) and select your **sandbox organization**. Keep every resource in this walkthrough in that organization. Complete its [payment provider setup](/docs/payment-providers) so it can accept sandbox payments.

2. [Create a sandbox API key](/docs/create-api-key) and store it on your server. That guide covers the dashboard, CLI, MCP, and SDK initialization.

3. In **Features**, create **API Calls** with code `api_calls` and type **Usage**. The code identifies the feature when your application records consumption. You will set its included quantity on the plan.

   See [Configure Features](/docs/configure-features).

4. In **Plans**, create a plan named **Pro**, with code `pro`, and choose **Metered**. Add a **USD 20 monthly price**, include **1,000 API calls**, and leave overage disabled for this first example. Use a paid price without a trial so the next steps lead directly to payment.

   See [Manage Plans](/docs/create-plans).

5. Create a test customer with a billing email and a stable identifier from your application, such as `demo_customer`. The customer represents the person or business you are going to bill.

   See [Manage Customers](/docs/manage-customers) for the dashboard and SDK flow.

6. Connect that customer to the **Pro** plan using its monthly price. Creating the subscription for this paid plan returns a `checkoutUrl`. Open it or redirect the customer there to enter their billing details and pay.

   See [Manage Subscriptions](/docs/manage-subscriptions#create) for the request in your SDK.

7. Use the sandbox checkout's **Test Data** panel to fill in test payment details and complete checkout. Confirm that the invoice is paid and the subscription is active in the dashboard.

   Your first subscription payment is complete. Commet manages subsequent renewals for the monthly plan. See [Testing](/docs/testing-sandbox) for the available test tools.

## Connect it to your product

With the first payment working, [check feature access](/docs/configure-features#current-feature-state) and [track usage](/docs/track-usage) when your customer uses the product. Use [signed webhooks](/docs/webhooks/introduction) to keep your application in sync with subscription and payment changes; a checkout redirect alone is not payment confirmation.

If a coding agent is implementing the flow, connect it through [MCP](/docs/mcp-server) or install the [Commet Skill](/docs/commet-skill). Use the same sandbox organization and the feature, plan, and customer identifiers from this walkthrough.
