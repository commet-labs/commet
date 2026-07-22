import type {
  BillingInterval,
  ConsumptionModel,
  DiscountType,
  FeatureType,
  InvoiceType,
  PaymentProvider,
  SubscriptionStatus,
  TransactionStatus,
} from "./enums";

export interface ActiveAddon {
  slug: string;
  name: string;
  basePrice: number;
  featureCode: string;
  featureName: string;
  featureType: FeatureType;
  consumptionModel: "boolean" | "metered" | "credits" | "balance";
  /** @format date-time */
  activatedAt: string;
  object: "addon";
  livemode: boolean;
}

export interface AddedPlanToGroup {
  success: boolean;
  object: "plan_group";
  livemode: boolean;
}

export interface Addon {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  basePrice: number;
  consumptionModel: "boolean" | "metered" | "credits" | "balance";
  featureCode: string;
  featureName: string;
  includedUnits: number | null;
  overageRate: number | null;
  creditCost: number | null;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  object: "addon";
  livemode: boolean;
}

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  expiresAt: string | null;
  lastUsedAt: string | null;
  /** @format date-time */
  createdAt: string;
  object: "api_key";
  livemode: boolean;
}

export interface BalanceAdjustment {
  amount: number;
  newBalance: number;
  reason: string | null;
  object: "subscription";
  livemode: boolean;
}

export interface BalanceTopup {
  amount: number;
  object: "subscription";
  livemode: boolean;
}

export interface BulkSeatUpdate {
  id: string;
  featureCode: string;
  previousBalance: number;
  newBalance: number;
  /** @format date-time */
  ts: string;
  /** @format date-time */
  createdAt: string;
  object: "seat";
  livemode: boolean;
}

export interface CanceledSubscription {
  id: string;
  customerId: string;
  status: SubscriptionStatus;
  /** @format date-time */
  canceledAt: string;
  cancelReason: string | null;
  /** @format date-time */
  scheduledCancellationDate: string;
  /** @format date-time */
  updatedAt: string;
  object: "subscription";
  livemode: boolean;
}

export interface ClaimLink {
  url: string;
  /** @format date-time */
  expiresAt: string;
  object: "claim_link";
  livemode: boolean;
}

export interface CreatedApiKey {
  id: string;
  name: string;
  apiKey: string;
  prefix: string;
  /** @format date-time */
  expiresAt: string;
  /** @format date-time */
  createdAt: string;
  object: "api_key";
  livemode: boolean;
}

export interface CreatedInvoice {
  id: string;
  customerId: string;
  invoiceNumber: string;
  status: "draft" | "outstanding" | "paid" | "void" | "uncollectible";
  invoiceType: InvoiceType;
  currency: string;
  subtotal: number;
  taxAmount: number;
  total: number;
  /** @format date-time */
  issueDate: string;
  /** @format date-time */
  dueDate: string;
  memo: string | null;
  metadata: Record<string, unknown>;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  object: "invoice";
  livemode: boolean;
}

export interface CreditGrant {
  credits: number;
  object: "subscription";
  livemode: boolean;
}

export interface CreditPack {
  id: string;
  name: string;
  description: string | null;
  credits: number;
  price: number;
  currency?: string;
  isActive?: boolean;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
  object: "credit_pack";
  livemode: boolean;
}

export interface Customer {
  id: string;
  externalId: string | null;
  fullName: string | null;
  email: string;
  taxDocument: string | null;
  documentType: string | null;
  timezone: string | null;
  metadata: Record<string, unknown> | null;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  object: "customer";
  livemode: boolean;
}

export interface CustomerBatch {
  successful: Array<{
    id: string;
    externalId: string | null;
    email: string;
  }>;
  failed: Array<{
    index: number;
    error: string;
    data: {
      id?: string;
      externalId?: string;
      email: string;
      fullName?: string | null;
      taxDocument?: string | null;
      timezone?: string;
      metadata?: Record<string, unknown> | null;
      address?: {
        line1: string;
        line2?: string;
        city: string;
        state?: string;
        postalCode: string;
        country: string;
        region?: string;
      };
    };
  }>;
  object: "customer";
  livemode: boolean;
}

export interface DefaultPlanPrice {
  id: string;
  isDefault: true;
  object: "plan";
  livemode: boolean;
}

export interface DeletedObject {
  id: string;
  deleted: true;
  object: string;
  livemode: boolean;
}

export interface DeletedPlanRegionalPricing {
  deleted: true;
  object: "plan";
  livemode: boolean;
}

export interface DeletedSubscriptionAddon {
  id: string;
  status: "inactive";
  deactivatedAt: string | null;
  object: "subscription";
  livemode: boolean;
}

export interface Feature {
  id: string;
  name: string;
  code: string;
  type: FeatureType;
  description: string | null;
  unitName: string | null;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  object: "feature";
  livemode: boolean;
}

export interface FeatureAccess {
  code: string;
  name: string;
  type: FeatureType;
  allowed: boolean;
  enabled?: boolean;
  current?: number;
  included?: number;
  remaining?: number;
  overageQuantity?: number;
  overageUnitPrice?: number;
  unlimited?: boolean;
  overageEnabled?: boolean;
  billedQuantity?: number;
  object: "feature";
  livemode: boolean;
}

export interface FeatureLookup {
  allowed: boolean;
  code?: string;
  name?: string;
  type?: FeatureType;
  enabled?: boolean;
  current?: number;
  included?: number;
  remaining?: number;
  overageQuantity?: number;
  overageUnitPrice?: number;
  unlimited?: boolean;
  overageEnabled?: boolean;
  billedQuantity?: number;
  willBeCharged?: boolean;
  reason?: string;
  object: "feature";
  livemode: boolean;
}

export interface Invoice {
  id: string;
  customerId: string;
  subscriptionId: string | null;
  invoiceNumber: string;
  status: "draft" | "outstanding" | "paid" | "void" | "uncollectible";
  invoiceType: InvoiceType;
  currency: string;
  subtotal: number;
  discountAmount: number;
  creditApplied?: number;
  taxAmount: number;
  total: number;
  /** @format date-time */
  periodStart: string;
  /** @format date-time */
  periodEnd: string;
  /** @format date-time */
  issueDate: string;
  /** @format date-time */
  dueDate: string;
  planName?: string | null;
  memo: string | null;
  poNumber?: string | null;
  reference?: string | null;
  metadata: Record<string, unknown>;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  lineItems?: Array<{
    lineType:
      | "plan_base"
      | "feature_overage"
      | "feature_seats"
      | "feature_quota"
      | "discount"
      | "promo_code_discount"
      | "credit"
      | "balance_overage"
      | "addon_base"
      | "one_time";
    featureName: string | null;
    description: string;
    quantity: number;
    unitAmount: number;
    amount: number;
    includedAmount: number | null;
    usedAmount: number | null;
    overageAmount: number | null;
    discountType: string | null;
    discountValue: number | null;
    discountName: string | null;
    chargeType: "standard" | "advance" | "true_up";
  }>;
  object: "invoice";
  livemode: boolean;
}

export interface InvoiceDownload {
  url: string;
  /** @format date-time */
  expiresAt: string;
  object: "invoice";
  livemode: boolean;
}

export interface InvoiceStatus {
  id: string;
  status: "draft" | "outstanding" | "paid" | "void" | "uncollectible";
  /** @format date-time */
  updatedAt: string;
  object: "invoice";
  livemode: boolean;
}

export interface Payment {
  id: string;
  customerId: string | null;
  kind: "link" | "charge";
  status:
    | "pending"
    | "processing"
    | "succeeded"
    | "requires_action"
    | "failed"
    | "canceled";
  provider: PaymentProvider;
  amountSubtotal: number;
  taxAmount: number;
  amountTotal: number;
  currency: string;
  description: string;
  metadata: Record<string, unknown> | null;
  url: string | null;
  expiresAt: string | null;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  object: "payment";
  livemode: boolean;
}

export interface PaymentMethodUpdateCheckout {
  checkoutUrl: string;
  object: "subscription";
  livemode: boolean;
}

export interface Payout {
  id: string;
  status: "pending" | "in_transit" | "paid" | "failed" | "canceled";
  amount: number;
  fee: number;
  netAmount: number;
  currency: string;
  description: string | null;
  providerTransferId: string;
  /** @format date-time */
  createdAt: string;
  object: "payout";
  livemode: boolean;
}

export interface PayoutBankAccount {
  id: string;
  providerExternalAccountId: string | null;
  holderName: string;
  last4: string;
  bankName: string | null;
  country: string;
  currency: string;
  accountType: "checking" | "savings" | null;
  isDefault: boolean;
  status: "active" | "errored";
  /** @format date-time */
  createdAt: string;
  object: "payout_bank_account";
  livemode: boolean;
}

export interface PayoutVerification {
  providerAccountId: string;
  status: "pending_verification" | "verified" | "restricted" | "disabled";
  transfersEnabled: boolean;
  alreadyExists?: boolean;
  businessType?: "individual" | "company";
  country?: string;
  object: "payout_account";
  livemode: boolean;
}

export interface Plan {
  id: string;
  name: string;
  code: string;
  description: string | null;
  consumptionModel: ConsumptionModel | null;
  isPublic: boolean;
  isDefault: boolean;
  isFree: boolean;
  blockOnExhaustion: boolean | null;
  sortOrder: number;
  planGroupId: string | null;
  metadata: Record<string, unknown> | null;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  features?: Array<{
    code: string;
    name: string;
    type: FeatureType;
    unitName: string | null;
    enabled: boolean;
    includedAmount: number | null;
    unlimited: boolean;
    overage: {
      enabled: boolean;
      model: "per_unit" | null;
      unitPrice: number | null;
    } | null;
    regionalPrices?: Array<{
      currency: string;
      overageUnitPrice: number | null;
      autoSynced: boolean;
    }>;
  }>;
  prices?: Array<{
    billingInterval: BillingInterval;
    price: number;
    isDefault: boolean;
    trialDays: number;
    includedBalance: number | null;
    includedCredits: number | null;
    introOffer: {
      enabled: boolean;
      discountType: DiscountType | null;
      discountValue: number | null;
      durationCycles: number | null;
    } | null;
    regionalPrices?: Array<{
      currency: string;
      price: number;
      includedBalance: number | null;
      autoSynced: boolean;
    }>;
  }>;
  exchangeRates?: Array<{
    currency: string;
    exchangeRate: number;
  }>;
  object: "plan";
  livemode: boolean;
}

export interface PlanChange {
  requiresCheckout?: boolean;
  checkoutUrl?: string;
  id?: string;
  scheduled?: boolean;
  /** @format date-time */
  scheduledFor?: string;
  changeType?:
    | "subscription.plan_downgrade"
    | "subscription.interval_change"
    | "subscription.cancel";
  customerId?: string;
  newPlanId?: string;
  newPlanName?: string;
  newBillingInterval?: string;
  previousPlan?: {
    id: string;
    name: string;
  };
  currentPlan?: {
    id: string;
    name: string;
    price: number;
  };
  billingInterval?: string;
  billing?: {
    credit: number;
    creditsApplied: number;
    charge: number;
    taxAmount: number;
    netAmount: number;
    totalCharged: number;
    remainingCreditBalance: number;
  };
  invoiceId?: string;
  seatLimitWarning?: {
    featureCode: string;
    featureName: string;
    currentSeats: number;
    included: number;
    newPlanName: string;
    /** @format date-time */
    effectiveDate: string;
  };
  object: "subscription";
  livemode: boolean;
}

export interface PlanFeature {
  planId: string;
  featureId: string;
  enabled: boolean;
  includedAmount: number;
  unlimited: boolean;
  overage: {
    enabled: boolean;
    unitPrice: number;
  };
  creditsPerUnit: number | null;
  pricingMode: "fixed" | "ai_model";
  margin: number | null;
  object: "plan";
  livemode: boolean;
}

export interface PlanGroup {
  id: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  plans?: Array<{
    id: string;
    name: string;
    sortOrder: number;
  }>;
  object: "plan_group";
  livemode: boolean;
}

export interface PlanPrice {
  id: string;
  planId: string;
  billingInterval: BillingInterval;
  price: number;
  isDefault: boolean;
  trialDays: number;
  includedBalance: number | null;
  includedCredits: number | null;
  introOffer: {
    enabled: boolean;
    discountType: DiscountType | null;
    discountValue: number | null;
    durationCycles: number | null;
  } | null;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  object: "plan";
  livemode: boolean;
}

export interface PlanRegionalPricing {
  priceId: string;
  overrides: Array<{
    currency: string;
    price: number;
    includedBalance?: number;
  }>;
  object: "plan";
  livemode: boolean;
}

export interface PlanRegionalPricingResult {
  planId: string;
  currency: string;
  exchangeRate: number;
  pricesConfigured: number;
  featuresConfigured: number;
  object: "plan";
  livemode: boolean;
}

export interface PlanVisibility {
  id: string;
  isPublic: boolean;
  object: "plan";
  livemode: boolean;
}

export interface PortalAccess {
  portalUrl: string;
  object: "portal_session";
  livemode: boolean;
}

export interface PreviewChange {
  currency: string;
  currentPlanCredit: number;
  newPlanCharge: number;
  estimatedTotal: number;
  /** @format date-time */
  effectiveDate: string;
  daysRemaining: number;
  totalDays: number;
  isUpgrade: boolean;
  object: "subscription";
  livemode: boolean;
}

export interface PromoCode {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  durationCycles: number | null;
  billingInterval: BillingInterval | null;
  maxRedemptions: number | null;
  expiresAt: string | null;
  isActive: boolean;
  redemptionCount: number;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  object: "promo_code";
  livemode: boolean;
}

export interface ReactivatedSubscription {
  id: string;
  retryInitiated: boolean;
  object: "subscription";
  livemode: boolean;
}

export interface RecoveryLink {
  url: string;
  token: string;
  object: "subscription";
  livemode: boolean;
}

export interface RemovedPlanFeature {
  id: string;
  removed: true;
  object: "plan";
  livemode: boolean;
}

export interface RemovedPlanFromGroup {
  id: string;
  removed: boolean;
  object: "plan_group";
  livemode: boolean;
}

export interface ReorderedPlans {
  reordered: boolean;
  object: "plan_group";
  livemode: boolean;
}

export interface SeatBalance {
  current: number;
  /** @format date-time */
  asOf: string;
  object: "seat";
  livemode: boolean;
}

export interface SeatBalanceListItem {
  object: "seat";
  livemode: boolean;
}

export interface SeatEvent {
  id: string;
  customerId: string;
  featureCode: string;
  previousBalance: number;
  newBalance: number;
  /** @format date-time */
  ts: string;
  /** @format date-time */
  createdAt: string;
  object: "seat";
  livemode: boolean;
}

export interface SentInvoice {
  sent: boolean;
  /** @format date-time */
  sentAt: string;
  object: "invoice";
  livemode: boolean;
}

export interface Subscription {
  id: string;
  customerId: string;
  plan: {
    id: string;
    name: string;
    basePrice?: number;
  };
  name: string;
  description: string | null;
  status: SubscriptionStatus;
  billingInterval: BillingInterval | null;
  consumptionModel?: ConsumptionModel | null;
  trialEndsAt: string | null;
  currentPeriod: {
    /** @format date-time */
    start: string;
    /** @format date-time */
    end: string;
    daysRemaining: number;
  } | null;
  features?: Array<{
    code: string;
    name: string;
    type: FeatureType;
    enabled?: boolean;
    usage?: {
      current: number;
      included: number;
      overageQuantity: number;
      overageUnitPrice?: number;
    };
  }>;
  credits?: {
    remaining: number;
    included: number;
    purchased: number;
  } | null;
  balance?: {
    remaining: number;
    included: number;
    currency: string;
  } | null;
  cancellation: {
    /** @format date-time */
    scheduledAt: string;
    reason: string | null;
    /** @format date-time */
    effectiveAt: string;
  } | null;
  cancelAtPeriodEnd: boolean;
  scheduledPlanChange: {
    changeType: "plan_downgrade" | "interval_change";
    newPlanId: string | null;
    newPlanName: string | null;
    newBillingInterval: string | null;
    /** @format date-time */
    scheduledFor: string;
  } | null;
  discount: {
    type: DiscountType;
    value: number;
    name: string | null;
    endsAt: string | null;
  } | null;
  /** @format date-time */
  startDate: string;
  endDate: string | null;
  billingDayOfMonth: number | null;
  nextBillingDate: string | null;
  checkoutUrl: string | null;
  /** Payment provider resolved for this checkout when the subscription response was created. This is an informational snapshot and may differ when the checkout is loaded if its country or the organization's routing changes. */
  checkoutProvider?: PaymentProvider | null;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  object: "subscription";
  livemode: boolean;
}

export interface SubscriptionAddon {
  addonId: string;
  status: "active";
  proratedCharge: number;
  object: "subscription";
  livemode: boolean;
}

export interface TestClock {
  simulatedTime: string | null;
  isActive: boolean;
  /** @format date-time */
  now: string;
  object: "test_clock";
  livemode: boolean;
}

export interface TestClockBilling {
  customersFound: number;
  enqueued: number;
  failed: number;
  dunningRetried: number;
  dunningFailed: number;
  object: "test_clock";
  livemode: boolean;
}

export interface Transaction {
  id: string;
  invoiceId: string | null;
  /** Gross amount in USD cents. Null when the charge never settled in USD — a failed non-USD attempt has no exchange rate, so no USD figure exists; see presentmentAmount. */
  grossAmount: number | null;
  /** Subtotal in USD cents (gross minus tax). Null when grossAmount is null. */
  subtotal: number | null;
  taxAmount: number | null;
  /** Amount in the charge currency's smallest unit, as presented to the customer. Set for non-USD charges; null when the charge was made in USD. */
  presentmentAmount: number | null;
  currency: string;
  /** The payment provider the charge was routed to: stripe, commet, or dlocal. */
  provider: PaymentProvider;
  status: TransactionStatus;
  customerEmail: string | null;
  customerName: string | null;
  paidAt: string | null;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  availableAt?: string | null;
  object: "transaction";
  livemode: boolean;
}

export interface TransactionRefund {
  id: string;
  status: "refunded";
  object: "transaction";
  livemode: boolean;
}

export interface TransactionRetry {
  id: string;
  status: "processing";
  object: "transaction";
  livemode: boolean;
}

export interface UncanceledSubscription {
  id: string;
  customerId: string;
  status: SubscriptionStatus;
  /** @format date-time */
  updatedAt: string;
  object: "subscription";
  livemode: boolean;
}

export interface UsageQuota {
  featureCode: string;
  current: number;
  included: number;
  remaining: number | null;
  billedQuantity: number;
  unlimited: boolean;
  overageEnabled: boolean;
  asOf: string | null;
  object: "usage_quota";
  livemode: boolean;
}

export interface UsageQuotaEvent {
  id: string;
  customerId: string;
  featureCode: string;
  previousBalance: number;
  newBalance: number;
  /** @format date-time */
  ts: string;
  /** @format date-time */
  createdAt: string;
  object: "usage_quota";
  livemode: boolean;
}

export interface WebhookAddonRef {
  id: string;
  name: string;
}

export interface WebhookBalance {
  currentBalance: number;
}

export interface WebhookBankRef {
  bankName: string | null;
  last4: string;
}

export interface WebhookCardInfo {
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
}

export interface WebhookCreditsBalance {
  planCredits: number;
  purchasedCredits: number;
  totalCredits: number;
}

export interface WebhookFeatureAccess {
  code: string;
  name: string;
  type: string;
  allowed: boolean;
  enabled: boolean | null;
  current: number | null;
  included: number | null;
  remaining: number | null;
  overageQuantity: number | null;
  overageUnitPrice: number | null;
  unlimited: boolean | null;
  overageEnabled: boolean | null;
  billedQuantity: number | null;
}

export interface WebhookPlanRef {
  id: string;
  name: string;
}

export interface WebhookSeatSummary {
  code: string;
  current: number | null;
  included: number | null;
  remaining: number | null;
  unlimited: boolean | null;
}
