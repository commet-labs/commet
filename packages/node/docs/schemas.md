# Schemas

Generated from Commet API version `2026-07-31`.

## Enums

### BillingInterval

- `"weekly"`
- `"monthly"`
- `"quarterly"`
- `"yearly"`
- `"one_time"`

### ConsumptionModel

- `"metered"`
- `"credits"`
- `"balance"`

### FeatureType

- `"boolean"`
- `"usage"`
- `"seats"`
- `"quota"`

### InvoiceType

- `"recurring"`
- `"overage"`
- `"plan_change"`
- `"adjustment"`
- `"credit_purchase"`
- `"balance_topup"`
- `"addon_activation"`
- `"one_time_payment"`
- `"reactivation"`

### PaymentProvider

- `"stripe"`
- `"commet"`
- `"dlocal"`

### SubscriptionStatus

- `"draft"`
- `"pending_payment"`
- `"trialing"`
- `"active"`
- `"past_due"`
- `"canceled"`

### Timezone

- `"UTC"`
- `"America/New_York"`
- `"America/Chicago"`
- `"America/Denver"`
- `"America/Los_Angeles"`
- `"America/Sao_Paulo"`
- `"America/Mexico_City"`
- `"America/Buenos_Aires"`
- `"America/Santiago"`
- `"America/Bogota"`
- `"America/Lima"`
- `"America/Asuncion"`
- `"Europe/London"`
- `"Europe/Paris"`
- `"Europe/Berlin"`
- `"Europe/Madrid"`
- `"Asia/Tokyo"`
- `"Asia/Shanghai"`
- `"Asia/Singapore"`
- `"Asia/Dubai"`
- `"Australia/Sydney"`

### TransactionStatus

- `"pending"`
- `"succeeded"`
- `"failed"`
- `"refunded"`
- `"disputed"`

## Models

### ActiveAddon

- `slug` (`string`, required)
- `name` (`string`, required)
- `basePrice` (`number`, required)
- `featureCode` (`string`, required)
- `featureName` (`string`, required)
- `featureType` (`FeatureType`, required)
- `consumptionModel` (`"boolean" | "metered" | "credits" | "balance"`, required)
- `activatedAt` (`string`, required)
- `object` (`"subscription_addon"`, required)
- `livemode` (`boolean`, required)

### AddedPlanToGroup

- `success` (`boolean`, required)
- `object` (`"plan_group_membership"`, required)
- `livemode` (`boolean`, required)

### Addon

- `id` (`string`, required)
- `name` (`string`, required)
- `slug` (`string`, required)
- `description` (`string | null`, required)
- `basePrice` (`number`, required)
- `featureCode` (`string`, required)
- `featureName` (`string`, required)
- `createdAt` (`string`, required)
- `updatedAt` (`string`, required)
- `consumptionModel` (`"boolean" | "metered" | "credits" | "balance"`, required)
- `includedUnits` (`number | null`, required)
- `overageRate` (`number | null`, required)
- `creditCost` (`number | null`, required)
- `object` (`"addon"`, required)
- `livemode` (`boolean`, required)

### ApiKey

- `id` (`string`, required)
- `name` (`string`, required)
- `prefix` (`string`, required)
- `expiresAt` (`string | null`, required)
- `lastUsedAt` (`string | null`, required)
- `createdAt` (`string`, required)
- `object` (`"api_key"`, required)
- `livemode` (`boolean`, required)

### BalanceAdjustment

- `amount` (`number`, required)
- `newBalance` (`number`, required)
- `reason` (`string | null`, required)
- `object` (`"balance_transaction"`, required)
- `livemode` (`boolean`, required)

### BalanceTopup

- `amount` (`number`, required)
- `object` (`"balance_topup"`, required)
- `livemode` (`boolean`, required)

### ClaimLink

- `url` (`string`, required)
- `expiresAt` (`string`, required)
- `object` (`"claim_link"`, required)
- `livemode` (`boolean`, required)

### CreatedApiKey

- `id` (`string`, required)
- `name` (`string`, required)
- `apiKey` (`string`, required)
- `prefix` (`string`, required)
- `expiresAt` (`string`, required)
- `createdAt` (`string`, required)
- `object` (`"api_key"`, required)
- `livemode` (`boolean`, required)

### CreatedSubscription

- `id` (`string`, required)
- `customerId` (`string`, required)
- `plan` (`{ id: string; name: string }`, required)
- `name` (`string`, required)
- `description` (`string | null`, required)
- `status` (`SubscriptionStatus`, required)
- `billingInterval` (`BillingInterval | null`, required)
- `trialEndsAt` (`string | null`, required)
- `currentPeriod` (`{ start: string; end: string; daysRemaining: number } | null`, required)
- `cancellation` (`{ scheduledAt: string; reason: string | null; effectiveAt: string } | null`, required)
- `cancelAtPeriodEnd` (`boolean`, required)
- `scheduledPlanChange` (`{ changeType: "plan_downgrade" | "interval_change"; newPlanId: string | null; newPlanName: string | null; newBillingInterval: string | null; scheduledFor: string } | null`, required)
- `startDate` (`string`, required)
- `endDate` (`string | null`, required)
- `billingDayOfMonth` (`number | null`, required)
- `nextBillingDate` (`string | null`, required)
- `checkoutUrl` (`string | null`, required)
- `createdAt` (`string`, required)
- `updatedAt` (`string`, required)
- `offerApplications` (`Array<SubscriptionOfferApplication>`, required)
- `checkoutProvider` (`PaymentProvider | null`, required) — Payment provider resolved for this checkout when the subscription response was created. This is an informational snapshot and may differ when the checkout is loaded if its country or the organization's routing changes.
- `priceId` (`string | null`, required)
- `object` (`"subscription"`, required)
- `livemode` (`boolean`, required)

### CreatedWebhook

- `id` (`string`, required)
- `url` (`string`, required)
- `events` (`Array<string>`, required)
- `description` (`string | null`, required)
- `isActive` (`boolean`, required)
- `apiVersion` (`string | null`, required)
- `createdAt` (`string`, required)
- `secretKey` (`string`, required)
- `object` (`"webhook"`, required)
- `livemode` (`boolean`, required)

### CreditGrant

- `credits` (`number`, required)
- `object` (`"credit_grant"`, required)
- `livemode` (`boolean`, required)

### CreditPack

- `id` (`string`, required)
- `name` (`string`, required)
- `description` (`string | null`, required)
- `credits` (`number`, required)
- `price` (`number`, required)
- `isActive` (`boolean`, required)
- `createdAt` (`string`, required)
- `updatedAt` (`string`, required)
- `object` (`"credit_pack"`, required)
- `livemode` (`boolean`, required)

### CreditPackListItem

- `id` (`string`, required)
- `name` (`string`, required)
- `description` (`string | null`, required)
- `credits` (`number`, required)
- `price` (`number`, required)
- `currency` (`string`, required)
- `object` (`"credit_pack"`, required)
- `livemode` (`boolean`, required)

### Customer

- `id` (`string`, required)
- `externalId` (`string | null`, required)
- `fullName` (`string | null`, required)
- `email` (`string`, required)
- `taxDocument` (`string | null`, required)
- `documentType` (`string | null`, required)
- `timezone` (`string | null`, required)
- `metadata` (`Record<string, unknown> | null`, required)
- `createdAt` (`string`, required)
- `updatedAt` (`string`, required)
- `object` (`"customer"`, required)
- `livemode` (`boolean`, required)

### CustomerBatch

- `successful` (`Array<{ id: string; externalId: string | null; email: string }>`, required)
- `failed` (`Array<{ index: number; error: string; data: { id?: string; externalId?: string; email: string; fullName?: string | null; taxDocument?: string | null; timezone?: string; metadata?: Record<string, unknown> | null; address?: { line1: string; line2?: string; city: string; state?: string; postalCode: string; country: string; region?: string } } }>`, required)
- `object` (`"customer_batch"`, required)
- `livemode` (`boolean`, required)

### CustomerCredit

- `id` (`string`, required)
- `amount` (`number`, required) — Original grant amount in the currency's smallest unit.
- `appliedAmount` (`number`, required)
- `reversedAmount` (`number`, required)
- `revokedAmount` (`number`, required)
- `remainingAmount` (`number`, required)
- `currency` (`string`, required)
- `reason` (`string`, required)
- `source` (`"dashboard" | "api" | "plan_change" | "migration"`, required)
- `expiresAt` (`string | null`, required)
- `createdAt` (`string`, required)
- `object` (`"customer_credit"`, required)
- `livemode` (`boolean`, required)

### CustomerCreditRevocation

- `id` (`string`, required)
- `remainingAmount` (`number`, required)
- `revokedAmount` (`number`, required)
- `currency` (`string`, required)
- `object` (`"customer_credit"`, required)
- `livemode` (`boolean`, required)

### DeletedObject

- `id` (`string`, required)
- `deleted` (`true`, required)
- `object` (`string`, required)
- `livemode` (`boolean`, required)

### DeletedOffer

- `deleted` (`true`, required)
- `object` (`"offer"`, required)
- `livemode` (`boolean`, required)

### DeletedPlanRegionalPricing

- `deleted` (`true`, required)
- `object` (`"plan_regional_pricing"`, required)
- `livemode` (`boolean`, required)

### DeletedSubscriptionAddon

- `id` (`string`, required)
- `status` (`"inactive"`, required)
- `deactivatedAt` (`string | null`, required)
- `object` (`"subscription_addon"`, required)
- `livemode` (`boolean`, required)

### Feature

- `id` (`string`, required)
- `name` (`string`, required)
- `code` (`string`, required)
- `type` (`FeatureType`, required)
- `description` (`string | null`, required)
- `unitName` (`string | null`, required)
- `createdAt` (`string`, required)
- `updatedAt` (`string`, required)
- `object` (`"feature"`, required)
- `livemode` (`boolean`, required)

### FeatureAccess

Variants:

- `{ code: string; name: string; unitName: string | null; allowed: boolean; type: "boolean"; enabled: boolean; object: "feature_access"; livemode: boolean }`
- `{ code: string; name: string; unitName: string | null; allowed: boolean; type: "usage"; consumption: { model: "metered"; period: { start: string; end: string }; unitsUsed: number; includedUnits: number; remainingUnits?: number; unlimited: boolean; overage: { enabled: boolean; units: number; unitPrice?: { amount: number; currency: string; scale: 10000 } } } | { model: "credits"; period: { start: string; end: string }; unitsUsed: number; creditsPerUnit: number; creditsConsumed: number; availableUnits: number } | { model: "balance"; period: { start: string; end: string }; unitsUsed: number; spent: { amount: number; currency: string }; availableUnits?: number; unitPrice?: { amount: number; currency: string; scale: 10000 } }; object: "feature_access"; livemode: boolean }`
- `{ code: string; name: string; unitName: string | null; allowed: boolean; type: "seats"; usage: { period: { start: string; end: string }; unitsUsed: number; includedUnits: number; remainingUnits?: number; unlimited: boolean; overage: { enabled: boolean; units: number; unitPrice?: { amount: number; currency: string; scale: 10000 } } }; object: "feature_access"; livemode: boolean }`
- `{ code: string; name: string; unitName: string | null; allowed: boolean; type: "quota"; usage: { period: { start: string; end: string }; unitsUsed: number; includedUnits: number; remainingUnits?: number; unlimited: boolean; overage: { enabled: boolean; units: number; unitPrice?: { amount: number; currency: string; scale: 10000 } }; billedUnits: number }; object: "feature_access"; livemode: boolean }`

### Invoice

- `id` (`string`, required)
- `customerId` (`string`, required)
- `subscriptionId` (`string | null`, required)
- `invoiceNumber` (`string`, required)
- `status` (`"draft" | "outstanding" | "paid" | "void" | "uncollectible"`, required)
- `invoiceType` (`InvoiceType`, required)
- `currency` (`string`, required)
- `subtotal` (`number`, required)
- `discountAmount` (`number`, required)
- `taxAmount` (`number`, required)
- `total` (`number`, required)
- `periodStart` (`string`, required)
- `periodEnd` (`string`, required)
- `issueDate` (`string`, required)
- `dueDate` (`string`, required)
- `memo` (`string | null`, required)
- `metadata` (`Record<string, unknown>`, required)
- `createdAt` (`string`, required)
- `updatedAt` (`string`, required)
- `creditApplied` (`number`, required)
- `planName` (`string | null`, required)
- `poNumber` (`string | null`, required)
- `reference` (`string | null`, required)
- `lineItems` (`Array<{ lineType: "plan_base" | "feature_overage" | "feature_seats" | "feature_quota" | "discount" | "promo_code_discount" | "plan_grant" | "credit" | "balance_overage" | "addon_base" | "one_time"; featureName: string | null; description: string; quantity: number; unitAmount: number; amount: number; includedAmount: number | null; usedAmount: number | null; overageAmount: number | null; discountType: string | null; discountValue: number | null; discountName: string | null; chargeType: "standard" | "advance" | "true_up" }>`, required)
- `object` (`"invoice"`, required)
- `livemode` (`boolean`, required)

### InvoiceDownload

- `url` (`string`, required)
- `expiresAt` (`string`, required)
- `object` (`"invoice_download_link"`, required)
- `livemode` (`boolean`, required)

### InvoiceListItem

- `id` (`string`, required)
- `customerId` (`string`, required)
- `subscriptionId` (`string | null`, required)
- `invoiceNumber` (`string`, required)
- `status` (`"draft" | "outstanding" | "paid" | "void" | "uncollectible"`, required)
- `invoiceType` (`InvoiceType`, required)
- `currency` (`string`, required)
- `subtotal` (`number`, required)
- `discountAmount` (`number`, required)
- `taxAmount` (`number`, required)
- `total` (`number`, required)
- `periodStart` (`string`, required)
- `periodEnd` (`string`, required)
- `issueDate` (`string`, required)
- `dueDate` (`string`, required)
- `memo` (`string | null`, required)
- `metadata` (`Record<string, unknown>`, required)
- `createdAt` (`string`, required)
- `updatedAt` (`string`, required)
- `object` (`"invoice"`, required)
- `livemode` (`boolean`, required)

### Market

- `id` (`string`, required)
- `name` (`string`, required)
- `countryCodes` (`Array<string>`, required)
- `metadata` (`Record<string, unknown>`, required)
- `createdAt` (`string`, required)
- `updatedAt` (`string`, required)
- `object` (`"market"`, required)
- `livemode` (`boolean`, required)

### Offer

- `id` (`string`, required)
- `name` (`string`, required)
- `phases` (`Array<{ type: "free_trial"; durationDays: number } | { type: "percentage"; durationCycles: number | null; durationInterval: "weekly" | "monthly" | "quarterly" | "yearly" | null; percentage: number } | { type: "amount_off"; durationCycles: number | null; durationInterval: "weekly" | "monthly" | "quarterly" | "yearly" | null; amounts: Array<{ currency: string; amount: number }> } | { type: "fixed_price"; durationCycles: number | null; durationInterval: "weekly" | "monthly" | "quarterly" | "yearly" | null; prices: Array<{ currency: string; amount: number }> }>`, required)
- `metadata` (`Record<string, unknown>`, required)
- `startsAt` (`string | null`, required)
- `endsAt` (`string | null`, required)
- `active` (`boolean`, required)
- `createdAt` (`string`, required)
- `updatedAt` (`string`, required)
- `object` (`"offer"`, required)
- `livemode` (`boolean`, required)

### Payment

- `id` (`string`, required)
- `customerId` (`string | null`, required)
- `kind` (`"link" | "charge"`, required)
- `status` (`"pending" | "processing" | "succeeded" | "requires_action" | "failed" | "canceled"`, required)
- `provider` (`"stripe" | "commet" | "dlocal"`, required)
- `amountSubtotal` (`number`, required)
- `taxAmount` (`number`, required)
- `amountTotal` (`number`, required)
- `currency` (`string`, required)
- `description` (`string`, required)
- `metadata` (`Record<string, unknown> | null`, required)
- `url` (`string | null`, required)
- `expiresAt` (`string | null`, required)
- `createdAt` (`string`, required)
- `updatedAt` (`string`, required)
- `object` (`"payment"`, required)
- `livemode` (`boolean`, required)

### PaymentMethodUpdateCheckout

- `checkoutUrl` (`string`, required)
- `object` (`"checkout_session"`, required)
- `livemode` (`boolean`, required)

### Payout

- `id` (`string`, required)
- `status` (`"pending" | "in_transit" | "paid" | "failed" | "canceled"`, required)
- `amount` (`number`, required)
- `fee` (`number`, required)
- `netAmount` (`number`, required)
- `currency` (`string`, required)
- `description` (`string | null`, required)
- `providerTransferId` (`string`, required)
- `createdAt` (`string`, required)
- `object` (`"payout"`, required)
- `livemode` (`boolean`, required)

### PayoutBankAccount

- `id` (`string`, required)
- `providerExternalAccountId` (`string | null`, required)
- `holderName` (`string`, required)
- `last4` (`string`, required)
- `bankName` (`string | null`, required)
- `country` (`string`, required)
- `currency` (`string`, required)
- `accountType` (`"checking" | "savings" | null`, required)
- `isDefault` (`boolean`, required)
- `status` (`"active" | "errored"`, required)
- `createdAt` (`string`, required)
- `object` (`"payout_bank_account"`, required)
- `livemode` (`boolean`, required)

### Plan

- `id` (`string`, required)
- `name` (`string`, required)
- `code` (`string`, required)
- `description` (`string | null`, required)
- `consumptionModel` (`ConsumptionModel | null`, required)
- `isPublic` (`boolean`, required)
- `isDefault` (`boolean`, required)
- `isFree` (`boolean`, required)
- `blockOnExhaustion` (`boolean | null`, required)
- `sortOrder` (`number`, required)
- `planGroupId` (`string | null`, required)
- `metadata` (`Record<string, unknown> | null`, required)
- `createdAt` (`string`, required)
- `updatedAt` (`string`, required)
- `features` (`Array<{ code: string; name: string; type: FeatureType; unitName: string | null; enabled: boolean; includedAmount: number | null; unlimited: boolean; overage: { enabled: boolean; model: "per_unit" | null; unitPrice: number | null } | null; regionalPrices: Array<{ currency: string; overageUnitPrice: number | null; autoSynced: boolean }> }>`, required)
- `prices` (`Array<{ id: string; billingInterval: BillingInterval; price: number; isDefault: boolean; trialDays: number; includedBalance: number | null; includedCredits: number | null; offerId: string | null; inheritsFromPriceId: string | null; metadata: Record<string, unknown>; marketPrices: Array<{ marketGroupId: string; currency: string; price: number }>; regionalPrices: Array<{ currency: string; price: number; includedBalance: number | null; autoSynced: boolean }> }>`, required)
- `exchangeRates` (`Array<{ currency: string; exchangeRate: number }>`, required)
- `object` (`"plan"`, required)
- `livemode` (`boolean`, required)

### PlanChange

Variants:

- `{ outcome: "requires_checkout"; requiresCheckout: true; checkoutUrl: string; offerApplication?: { id: string; offerId: string; name: string; currency: string; subtotal: number; discountAmount: number; total: number; phases: Array<{ type: "free_trial"; durationDays: number; startsAt: string | null; endsAt: string | null } | { type: "percentage"; durationCycles: number | null; durationInterval: "weekly" | "monthly" | "quarterly" | "yearly" | null; startsAt: string | null; endsAt: string | null; percentage: number } | { type: "amount_off"; durationCycles: number | null; durationInterval: "weekly" | "monthly" | "quarterly" | "yearly" | null; startsAt: string | null; endsAt: string | null; amount: number } | { type: "fixed_price"; durationCycles: number | null; durationInterval: "weekly" | "monthly" | "quarterly" | "yearly" | null; startsAt: string | null; endsAt: string | null; price: number }>; appliesTo: { type: "plan_price"; id: string } | { type: "addon"; id: string } | { type: "credit_pack"; id: string } }; object: "plan_change"; livemode: boolean }`
- `{ outcome: "scheduled"; id: string; scheduled: true; scheduledFor: string; changeType: "subscription.plan_downgrade" | "subscription.interval_change" | "subscription.cancel"; customerId: string; newPlanId?: string; newPlanName?: string; newBillingInterval?: string; seatLimitWarning?: { featureCode: string; featureName: string; currentSeats: number; included: number; newPlanName: string; effectiveDate: string }; object: "plan_change"; livemode: boolean }`
- `{ outcome: "completed"; id: string; scheduled: false; customerId: string; previousPlan: { id: string; name: string }; currentPlan: { id: string; name: string; price: number }; billingInterval: string; billing: { credit: number; creditsApplied: number; charge: number; taxAmount: number; netAmount: number; totalCharged: number; remainingCreditBalance: number }; invoiceId?: string; offerApplication?: { id: string; offerId: string; name: string; currency: string; subtotal: number; discountAmount: number; total: number; phases: Array<{ type: "free_trial"; durationDays: number; startsAt: string | null; endsAt: string | null } | { type: "percentage"; durationCycles: number | null; durationInterval: "weekly" | "monthly" | "quarterly" | "yearly" | null; startsAt: string | null; endsAt: string | null; percentage: number } | { type: "amount_off"; durationCycles: number | null; durationInterval: "weekly" | "monthly" | "quarterly" | "yearly" | null; startsAt: string | null; endsAt: string | null; amount: number } | { type: "fixed_price"; durationCycles: number | null; durationInterval: "weekly" | "monthly" | "quarterly" | "yearly" | null; startsAt: string | null; endsAt: string | null; price: number }>; appliesTo: { type: "plan_price"; id: string } | { type: "addon"; id: string } | { type: "credit_pack"; id: string } }; object: "plan_change"; livemode: boolean }`

### PlanFeature

- `planId` (`string`, required)
- `featureId` (`string`, required)
- `enabled` (`boolean`, required)
- `includedAmount` (`number`, required)
- `unlimited` (`boolean`, required)
- `overage` (`{ enabled: boolean; unitPrice: number }`, required)
- `creditsPerUnit` (`number | null`, required)
- `pricingMode` (`"fixed" | "ai_model"`, required)
- `margin` (`number | null`, required)
- `object` (`"plan_feature"`, required)
- `livemode` (`boolean`, required)

### PlanGrant

- `id` (`string`, required)
- `customerId` (`string`, required)
- `subscriptionId` (`string`, required)
- `planId` (`string`, required)
- `planPriceId` (`string`, required)
- `billingInterval` (`"weekly" | "monthly" | "quarterly" | "yearly"`, required)
- `status` (`"active" | "expired" | "revoked"`, required)
- `duration` (`"cycles" | "until_date" | "until_revoked"`, required)
- `durationCycles` (`number | null`, required)
- `startsAt` (`string`, required)
- `expiresAt` (`string | null`, required)
- `reason` (`string`, required)
- `source` (`"dashboard" | "api"`, required)
- `revokedAt` (`string | null`, required)
- `createdAt` (`string`, required)
- `updatedAt` (`string`, required)
- `events` (`Array<{ id: string; type: "created" | "updated" | "expired" | "revoked"; reason: string; source: "dashboard" | "api" | "system"; previousExpiresAt: string | null; expiresAt: string | null; duration: "cycles" | "until_date" | "until_revoked" | null; durationCycles: number | null; requestedExpiresAt: string | null; createdAt: string }>`, required)
- `object` (`"plan_grant"`, required)
- `livemode` (`boolean`, required)

### PlanGroup

- `id` (`string`, required)
- `name` (`string`, required)
- `description` (`string | null`, required)
- `isPublic` (`boolean`, required)
- `createdAt` (`string`, required)
- `updatedAt` (`string`, required)
- `object` (`"plan_group"`, required)
- `livemode` (`boolean`, required)

### PlanGroupDetail

- `id` (`string`, required)
- `name` (`string`, required)
- `description` (`string | null`, required)
- `isPublic` (`boolean`, required)
- `createdAt` (`string`, required)
- `updatedAt` (`string`, required)
- `plans` (`Array<{ id: string; name: string; sortOrder: number }>`, required)
- `object` (`"plan_group"`, required)
- `livemode` (`boolean`, required)

### PlanPrice

- `id` (`string`, required) — Public plan price ID.
- `planId` (`string`, required)
- `billingInterval` (`BillingInterval`, required)
- `price` (`number`, required) — Price in the currency's minor unit (for example, cents for USD).
- `isDefault` (`boolean`, required)
- `trialDays` (`number`, required)
- `includedBalance` (`number | null`, required)
- `includedCredits` (`number | null`, required)
- `offerId` (`string | null`, required) — Automatic introductory offer for this price.
- `inheritsFromPriceId` (`string | null`, required) — Public base price ID for a market price variant, or null for a base price.
- `metadata` (`Record<string, unknown>`, required) — Application metadata. Variant display names may use metadata.name.
- `marketPrices` (`Array<{ marketGroupId: string; currency: string; price: number }>`, required) — Country-market overrides. Variants inherit their base price for every market not listed.
- `createdAt` (`string`, required)
- `updatedAt` (`string`, required)
- `object` (`"plan_price"`, required)
- `livemode` (`boolean`, required)

### PlanRegionalPricing

- `priceId` (`string`, required)
- `overrides` (`Array<{ currency: string; price: number; includedBalance?: number }>`, required)
- `object` (`"plan_regional_pricing"`, required)
- `livemode` (`boolean`, required)

### PlanRegionalPricingResult

- `planId` (`string`, required)
- `currency` (`string`, required)
- `exchangeRate` (`number`, required)
- `pricesConfigured` (`number`, required)
- `featuresConfigured` (`number`, required)
- `object` (`"plan_regional_pricing"`, required)
- `livemode` (`boolean`, required)

### PortalAccess

- `portalUrl` (`string`, required)
- `object` (`"portal_session"`, required)
- `livemode` (`boolean`, required)

### PreviewChange

- `currency` (`string`, required)
- `currentPlanCredit` (`number`, required)
- `newPlanCharge` (`number`, required)
- `estimatedTotal` (`number`, required)
- `effectiveDate` (`string`, required)
- `daysRemaining` (`number`, required)
- `totalDays` (`number`, required)
- `isUpgrade` (`boolean`, required)
- `offerApplication` (`{ id: string; offerId: string; name: string; currency: string; subtotal: number; discountAmount: number; total: number; phases: Array<{ type: "free_trial"; durationDays: number; startsAt: string | null; endsAt: string | null } | { type: "percentage"; durationCycles: number | null; durationInterval: "weekly" | "monthly" | "quarterly" | "yearly" | null; startsAt: string | null; endsAt: string | null; percentage: number } | { type: "amount_off"; durationCycles: number | null; durationInterval: "weekly" | "monthly" | "quarterly" | "yearly" | null; startsAt: string | null; endsAt: string | null; amount: number } | { type: "fixed_price"; durationCycles: number | null; durationInterval: "weekly" | "monthly" | "quarterly" | "yearly" | null; startsAt: string | null; endsAt: string | null; price: number }>; appliesTo: { type: "plan_price"; id: string } | { type: "addon"; id: string } | { type: "credit_pack"; id: string } }`, optional)
- `object` (`"plan_change_preview"`, required)
- `livemode` (`boolean`, required)

### PromoCode

- `id` (`string`, required)
- `code` (`string`, required)
- `offerId` (`string`, required)
- `billingInterval` (`BillingInterval | null`, required)
- `maxRedemptions` (`number | null`, required)
- `expiresAt` (`string | null`, required)
- `isActive` (`boolean`, required)
- `redemptionCount` (`number`, required)
- `createdAt` (`string`, required)
- `updatedAt` (`string`, required)
- `object` (`"promo_code"`, required)
- `livemode` (`boolean`, required)

### ReactivatedSubscription

- `subscriptionId` (`string`, required)
- `invoiceId` (`string`, required)
- `status` (`"processing" | "succeeded"`, required)
- `offerApplication` (`{ id: string; offerId: string; name: string; currency: string; subtotal: number; discountAmount: number; total: number; phases: Array<{ type: "free_trial"; durationDays: number; startsAt: string | null; endsAt: string | null } | { type: "percentage"; durationCycles: number | null; durationInterval: "weekly" | "monthly" | "quarterly" | "yearly" | null; startsAt: string | null; endsAt: string | null; percentage: number } | { type: "amount_off"; durationCycles: number | null; durationInterval: "weekly" | "monthly" | "quarterly" | "yearly" | null; startsAt: string | null; endsAt: string | null; amount: number } | { type: "fixed_price"; durationCycles: number | null; durationInterval: "weekly" | "monthly" | "quarterly" | "yearly" | null; startsAt: string | null; endsAt: string | null; price: number }>; appliesTo: { type: "plan_price"; id: string } | { type: "addon"; id: string } | { type: "credit_pack"; id: string } }`, optional)
- `object` (`"subscription_reactivation"`, required)
- `livemode` (`boolean`, required)

### RecoveryLink

- `url` (`string`, required)
- `token` (`string`, required)
- `object` (`"recovery_link"`, required)
- `livemode` (`boolean`, required)

### Refund

- `id` (`string`, required)
- `transactionId` (`string`, required)
- `amount` (`number`, required)
- `currency` (`string`, required)
- `chargeId` (`string | null`, required)
- `status` (`"pending" | "requires_action" | "succeeded" | "failed" | "canceled"`, required)
- `reason` (`"duplicate" | "fraudulent" | "requested_by_customer" | null`, required)
- `object` (`"refund"`, required)
- `livemode` (`boolean`, required)

### RemovedPlanFeature

- `id` (`string`, required)
- `removed` (`true`, required)
- `object` (`"plan_feature"`, required)
- `livemode` (`boolean`, required)

### RemovedPlanFromGroup

- `id` (`string`, required)
- `removed` (`boolean`, required)
- `object` (`"plan_group_membership"`, required)
- `livemode` (`boolean`, required)

### ReorderedPlans

- `reordered` (`boolean`, required)
- `object` (`"plan_group_order"`, required)
- `livemode` (`boolean`, required)

### SeatBalance

- `current` (`number`, required)
- `asOf` (`string`, required)
- `object` (`"seat_balance"`, required)
- `livemode` (`boolean`, required)

### SeatBalanceCollection

- `balances` (`Record<string, { current: number; asOf: string }>`, required)
- `object` (`"seat_balance_collection"`, required)
- `livemode` (`boolean`, required)

### SeatEvent

- `id` (`string`, required)
- `customerId` (`string`, required)
- `featureCode` (`string`, required)
- `previousBalance` (`number`, required)
- `newBalance` (`number`, required)
- `ts` (`string`, required)
- `createdAt` (`string`, required)
- `object` (`"seat_event"`, required)
- `livemode` (`boolean`, required)

### SentInvoice

- `sent` (`boolean`, required)
- `sentAt` (`string`, required)
- `object` (`"invoice_delivery"`, required)
- `livemode` (`boolean`, required)

### Subscription

- `id` (`string`, required)
- `customerId` (`string`, required)
- `plan` (`{ id: string; name: string; basePrice: number }`, required)
- `name` (`string`, required)
- `description` (`string | null`, required)
- `status` (`SubscriptionStatus`, required)
- `billingInterval` (`BillingInterval | null`, required)
- `trialEndsAt` (`string | null`, required)
- `currentPeriod` (`{ start: string; end: string; daysRemaining: number } | null`, required)
- `cancellation` (`{ scheduledAt: string; reason: string | null; effectiveAt: string } | null`, required)
- `cancelAtPeriodEnd` (`boolean`, required)
- `scheduledPlanChange` (`{ changeType: "plan_downgrade" | "interval_change"; newPlanId: string | null; newPlanName: string | null; newBillingInterval: string | null; scheduledFor: string } | null`, required)
- `startDate` (`string`, required)
- `endDate` (`string | null`, required)
- `billingDayOfMonth` (`number | null`, required)
- `nextBillingDate` (`string | null`, required)
- `checkoutUrl` (`string | null`, required)
- `createdAt` (`string`, required)
- `updatedAt` (`string`, required)
- `offerApplications` (`Array<SubscriptionOfferApplication>`, required)
- `consumptionModel` (`ConsumptionModel | null`, required)
- `features` (`Array<{ code: string; name: string; type: "boolean"; enabled: boolean } | { code: string; name: string; type: "usage"; usage?: { current: number; included: number; overageQuantity: number; overageUnitPrice?: number } } | { code: string; name: string; type: "seats"; usage: { current: number; included: number; overageQuantity: number; overageUnitPrice?: number } } | { code: string; name: string; type: "quota" }>`, required)
- `credits` (`{ remaining: number; included: number; purchased: number } | null`, required)
- `balance` (`{ remaining: number; included: number; currency: string } | null`, required)
- `priceId` (`string | null`, required)
- `object` (`"subscription"`, required)
- `livemode` (`boolean`, required)

### SubscriptionAddon

- `addonId` (`string`, required)
- `status` (`"active"`, required)
- `proratedCharge` (`number`, required)
- `object` (`"subscription_addon"`, required)
- `livemode` (`boolean`, required)

### SubscriptionOfferApplication

- `id` (`string`, required)
- `name` (`string`, required)
- `appliesTo` (`{ type: "plan_price"; id: string } | { type: "addon"; id: string } | { type: "credit_pack"; id: string }`, required)
- `offerId` (`string | null`, required)
- `source` (`"direct" | "introductory" | "promo_code" | "card_promotion" | "custom"`, required)
- `status` (`"quoted" | "applied" | "failed" | "expired"`, required)
- `currency` (`string | null`, required)
- `subtotal` (`number | null`, required)
- `discountAmount` (`number | null`, required)
- `total` (`number | null`, required)
- `phases` (`Array<SubscriptionOfferApplicationPhase>`, required)
- `quotedAt` (`string`, required)
- `expiresAt` (`string | null`, required)
- `appliedAt` (`string | null`, required)

### SubscriptionOfferApplicationPhase

Variants:

- `{ type: "free_trial"; durationDays: number; durationInterval: "weekly" | "monthly" | "quarterly" | "yearly" | null; startsAt: string | null; endsAt: string | null }`
- `{ type: "percentage"; durationCycles: number | null; durationInterval: "weekly" | "monthly" | "quarterly" | "yearly" | null; percentage: number; startsAt: string | null; endsAt: string | null }`
- `{ type: "amount_off"; durationCycles: number | null; durationInterval: "weekly" | "monthly" | "quarterly" | "yearly" | null; amount: number; startsAt: string | null; endsAt: string | null }`
- `{ type: "fixed_price"; durationCycles: number | null; durationInterval: "weekly" | "monthly" | "quarterly" | "yearly" | null; price: number; startsAt: string | null; endsAt: string | null }`

### SubscriptionSummary

- `id` (`string`, required)
- `customerId` (`string`, required)
- `plan` (`{ id: string; name: string }`, required)
- `name` (`string`, required)
- `description` (`string | null`, required)
- `status` (`SubscriptionStatus`, required)
- `billingInterval` (`BillingInterval | null`, required)
- `trialEndsAt` (`string | null`, required)
- `currentPeriod` (`{ start: string; end: string; daysRemaining: number } | null`, required)
- `cancellation` (`{ scheduledAt: string; reason: string | null; effectiveAt: string } | null`, required)
- `cancelAtPeriodEnd` (`boolean`, required)
- `scheduledPlanChange` (`{ changeType: "plan_downgrade" | "interval_change"; newPlanId: string | null; newPlanName: string | null; newBillingInterval: string | null; scheduledFor: string } | null`, required)
- `startDate` (`string`, required)
- `endDate` (`string | null`, required)
- `billingDayOfMonth` (`number | null`, required)
- `nextBillingDate` (`string | null`, required)
- `checkoutUrl` (`string | null`, required)
- `createdAt` (`string`, required)
- `updatedAt` (`string`, required)
- `offerApplications` (`Array<SubscriptionOfferApplication>`, required)
- `priceId` (`string | null`, required)
- `object` (`"subscription"`, required)
- `livemode` (`boolean`, required)

### TestClock

- `simulatedTime` (`string | null`, required)
- `isActive` (`boolean`, required)
- `now` (`string`, required)
- `latestRun` (`{ id: string; status: "pending" | "running" | "completed" | "failed"; startedAtTime: string; targetTime: string; estimatedDeadlineCount: number; completedDeadlineCount: number; failedDeadlineCount: number; error: string | null; items: Array<{ kind: "billing_cycle" | "dunning_retry"; status: "pending" | "processing" | "completed" | "failed"; dueAt: string; subscriptionId: string; customerName: string | null; invoiceNumber: string | null; invoiceId: string | null; outcome: string | null; detail: string | null; error: string | null }> } | null`, required)
- `object` (`"test_clock"`, required)
- `livemode` (`boolean`, required)

### TestClockRun

- `id` (`string`, required)
- `status` (`"pending" | "running" | "completed" | "failed"`, required)
- `startedAtTime` (`string`, required)
- `targetTime` (`string`, required)
- `estimatedDeadlineCount` (`number`, required)
- `completedDeadlineCount` (`number`, required)
- `failedDeadlineCount` (`number`, required)
- `error` (`string | null`, required)
- `items` (`Array<{ kind: "billing_cycle" | "dunning_retry"; status: "pending" | "processing" | "completed" | "failed"; dueAt: string; subscriptionId: string; customerName: string | null; invoiceNumber: string | null; invoiceId: string | null; outcome: string | null; detail: string | null; error: string | null }>`, required)
- `object` (`"test_clock_run"`, required)
- `livemode` (`boolean`, required)

### Transaction

- `id` (`string`, required)
- `invoiceId` (`string | null`, required)
- `grossAmount` (`number | null`, required) — Gross amount in USD cents. Null when the provider has not reported an honest USD figure; see presentmentAmount.
- `subtotal` (`number | null`, required) — Subtotal in USD cents (gross minus tax). Null when grossAmount is null.
- `taxAmount` (`number | null`, required)
- `presentmentAmount` (`number | null`, required) — Amount in the charge currency's smallest unit, as presented to the customer. Set for non-USD charges; null when the charge was made in USD.
- `currency` (`string`, required)
- `provider` (`PaymentProvider`, required) — The payment provider the charge was routed to: stripe, commet, or dlocal.
- `status` (`TransactionStatus`, required)
- `customerEmail` (`string | null`, required)
- `customerName` (`string | null`, required)
- `paidAt` (`string | null`, required)
- `createdAt` (`string`, required)
- `updatedAt` (`string`, required)
- `availableAt` (`string | null`, required)
- `object` (`"transaction"`, required)
- `livemode` (`boolean`, required)

### TransactionListItem

- `id` (`string`, required)
- `invoiceId` (`string | null`, required)
- `grossAmount` (`number | null`, required) — Gross amount in USD cents. Null when the provider has not reported an honest USD figure; see presentmentAmount.
- `subtotal` (`number | null`, required) — Subtotal in USD cents (gross minus tax). Null when grossAmount is null.
- `taxAmount` (`number | null`, required)
- `presentmentAmount` (`number | null`, required) — Amount in the charge currency's smallest unit, as presented to the customer. Set for non-USD charges; null when the charge was made in USD.
- `currency` (`string`, required)
- `provider` (`PaymentProvider`, required) — The payment provider the charge was routed to: stripe, commet, or dlocal.
- `status` (`TransactionStatus`, required)
- `customerEmail` (`string | null`, required)
- `customerName` (`string | null`, required)
- `paidAt` (`string | null`, required)
- `createdAt` (`string`, required)
- `updatedAt` (`string`, required)
- `object` (`"transaction"`, required)
- `livemode` (`boolean`, required)

### TransactionRetry

- `originalTransactionId` (`string`, required)
- `invoiceId` (`string`, required)
- `status` (`"processing" | "succeeded"`, required)
- `object` (`"transaction_retry"`, required)
- `livemode` (`boolean`, required)

### UsageAdjustment

- `id` (`string`, required)
- `value` (`number`, required)
- `previousValue` (`number`, required)
- `adjustment` (`number`, required)
- `customerId` (`string`, required)
- `reason` (`string | null`, required)
- `ts` (`string`, required)
- `createdAt` (`string`, required)
- `featureCode` (`string`, required)
- `object` (`"usage_adjustment"`, required)
- `livemode` (`boolean`, required)

### UsageCheck

Variants:

- `{ allowed: boolean; subscriptionStatus: string; featureCode: string; quantity: number; reason?: string; message?: string; consumptionModel: "metered"; current: number; remaining: number; unlimited: boolean; included: number; overageEnabled: boolean; overageUnitPrice: number | null; object: "usage_check"; livemode: boolean }`
- `{ allowed: boolean; subscriptionStatus: string; featureCode: string; quantity: number; reason?: string; message?: string; consumptionModel: "credits"; creditsPerUnit: number; estimatedCredits: number; planCredits: number; purchasedCredits: number; totalCredits: number; object: "usage_check"; livemode: boolean }`
- `{ allowed: boolean; subscriptionStatus: string; featureCode: string; quantity: number; reason?: string; message?: string; consumptionModel: "balance"; unitPrice: number; estimatedAmount: number; currentBalance: number; blockOnExhaustion: boolean; currency: string; object: "usage_check"; livemode: boolean }`

### UsageEvent

- `id` (`string`, required)
- `featureCode` (`string`, required)
- `value` (`number`, required)
- `customerId` (`string`, required)
- `eventId` (`string | null`, required)
- `ts` (`string`, required)
- `createdAt` (`string`, required)
- `properties` (`Array<{ property: string; value: string }>`, required)
- `consumption` (`{ model: "credits" | "balance"; deducted: number; remaining: number; blocked: boolean }`, optional)
- `object` (`"usage_event"`, required)
- `livemode` (`boolean`, required)

### UsageQuota

- `featureCode` (`string`, required)
- `current` (`number`, required)
- `included` (`number`, required)
- `remaining` (`number | null`, required)
- `billedQuantity` (`number`, required)
- `unlimited` (`boolean`, required)
- `overageEnabled` (`boolean`, required)
- `asOf` (`string | null`, required)
- `object` (`"usage_quota"`, required)
- `livemode` (`boolean`, required)

### UsageQuotaEvent

- `id` (`string`, required)
- `customerId` (`string`, required)
- `featureCode` (`string`, required)
- `previousBalance` (`number`, required)
- `newBalance` (`number`, required)
- `ts` (`string`, required)
- `createdAt` (`string`, required)
- `object` (`"usage_quota_event"`, required)
- `livemode` (`boolean`, required)

### Webhook

- `id` (`string`, required)
- `url` (`string`, required)
- `events` (`Array<string>`, required)
- `description` (`string | null`, required)
- `isActive` (`boolean`, required)
- `apiVersion` (`string | null`, required)
- `createdAt` (`string`, required)
- `object` (`"webhook"`, required)
- `livemode` (`boolean`, required)

### WebhookAddonRef

- `id` (`string`, required)
- `name` (`string`, required)

### WebhookBalance

- `currentBalance` (`number`, required)

### WebhookBankRef

- `bankName` (`string | null`, required)
- `last4` (`string`, required)

### WebhookCardInfo

- `brand` (`string`, required)
- `last4` (`string`, required)
- `expMonth` (`number`, required)
- `expYear` (`number`, required)

### WebhookCreditsBalance

- `planCredits` (`number`, required)
- `purchasedCredits` (`number`, required)
- `totalCredits` (`number`, required)

### WebhookPlanRef

- `id` (`string`, required)
- `name` (`string`, required)

### WebhookSeatSummary

- `code` (`string`, required)
- `current` (`number | null`, required)
- `included` (`number | null`, required)
- `remaining` (`number | null`, required)
- `unlimited` (`boolean | null`, required)

### WebhookTest

- `success` (`boolean`, required)
- `deliveryId` (`string`, required)
- `deliveredAt` (`string`, required)
- `object` (`"webhook_delivery"`, required)
- `livemode` (`boolean`, required)
