import type {
  BillingInterval,
  ConsumptionModel,
  FeatureType,
  InvoiceType,
  PaymentMethod,
  PaymentProvider,
  SubPaymentMethod,
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
  object: "subscription_addon";
  livemode: boolean;
}

export interface AddedPlanToGroup {
  success: boolean;
  object: "plan_group_membership";
  livemode: boolean;
}

export interface Addon {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  basePrice: number;
  featureCode: string;
  featureName: string;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  consumptionModel: "boolean" | "metered" | "credits" | "balance";
  includedUnits: number | null;
  overageRate: number | null;
  creditCost: number | null;
  /** Plans that sell the add-on. */
  planIds: Array<string>;
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
  object: "balance_transaction";
  livemode: boolean;
}

export interface BalanceTopup {
  amount: number;
  object: "balance_topup";
  livemode: boolean;
}

export interface BusinessTaxId {
  country: string;
  type: string;
  value: string;
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

export interface CreatedSubscription {
  id: string;
  customerId: string;
  plan: {
    id: string;
    name: string;
  };
  name: string;
  description: string | null;
  status: SubscriptionStatus;
  billingInterval: BillingInterval | null;
  trialEndsAt: string | null;
  currentPeriod: {
    /** @format date-time */
    start: string;
    /** @format date-time */
    end: string;
    daysRemaining: number;
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
  /** @format date-time */
  startDate: string;
  endDate: string | null;
  billingDayOfMonth: number | null;
  nextBillingDate: string | null;
  checkoutUrl: string | null;
  /** Whether Commet can charge this subscription on its own at its next charge (the trial end or the renewal). A trial that started without a payment method reports false until the customer adds one for this subscription; a payment method saved for another subscription does not count. A subscription on a free plan reports false. */
  hasPaymentMethod: boolean;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  /** The plan version whose terms the subscription has now. It keeps paying and receiving everything from this version until it is moved. */
  planVersion: {
    /** Public plan version ID. */
    id: string;
    /** Main versions are 1, 2, 3; an experiment's versions carry its own code, like price-test 2. */
    label: string;
  } | null;
  offerApplications: Array<SubscriptionOfferApplication>;
  pause:
    | {
        status: "scheduled";
        mode: "period_end";
        /** @format date-time */
        requestedAt: string;
        /** @format date-time */
        effectiveAt: string;
        resumeAt: string | null;
      }
    | {
        status: "active";
        mode: "immediate" | "period_end";
        /** @format date-time */
        requestedAt: string;
        /** @format date-time */
        effectiveAt: string;
        resumeAt: string | null;
      }
    | null;
  /** Payment provider resolved for this checkout when the subscription response was created. This is an informational snapshot and may differ when the checkout is loaded if its country or the organization's routing changes. */
  checkoutProvider: PaymentProvider | null;
  priceId: string | null;
  object: "subscription";
  livemode: boolean;
}

export interface CreatedWebhook {
  id: string;
  url: string;
  events: Array<string>;
  description: string | null;
  isActive: boolean;
  apiVersion: string | null;
  /** @format date-time */
  createdAt: string;
  secretKey: string;
  object: "webhook";
  livemode: boolean;
}

export interface CreditGrant {
  credits: number;
  object: "credit_grant";
  livemode: boolean;
}

export interface CreditPack {
  id: string;
  name: string;
  description: string | null;
  credits: number;
  price: number;
  /** Plans that sell the credit pack. */
  planIds: Array<string>;
  isActive: boolean;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  object: "credit_pack";
  livemode: boolean;
}

export interface CreditPackListItem {
  id: string;
  name: string;
  description: string | null;
  credits: number;
  price: number;
  /** Plans that sell the credit pack. */
  planIds: Array<string>;
  currency: string;
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
  businessTaxId: BusinessTaxId | null;
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
  object: "customer_batch";
  livemode: boolean;
}

export interface CustomerCredit {
  id: string;
  /** Original grant amount in the currency's smallest unit. */
  amount: number;
  appliedAmount: number;
  reversedAmount: number;
  revokedAmount: number;
  remainingAmount: number;
  currency: string;
  reason: string;
  source: "dashboard" | "api" | "plan_change" | "migration";
  expiresAt: string | null;
  /** @format date-time */
  createdAt: string;
  object: "customer_credit";
  livemode: boolean;
}

export interface CustomerCreditRevocation {
  id: string;
  remainingAmount: number;
  revokedAmount: number;
  currency: string;
  object: "customer_credit";
  livemode: boolean;
}

export interface DeletedObject {
  id: string;
  deleted: true;
  object: string;
  livemode: boolean;
}

export interface DeletedOffer {
  deleted: true;
  object: "offer";
  livemode: boolean;
}

export interface DeletedPlanRegionalPricing {
  deleted: true;
  object: "plan_regional_pricing";
  livemode: boolean;
}

export interface DeletedSubscriptionAddon {
  id: string;
  status: "inactive";
  deactivatedAt: string | null;
  object: "subscription_addon";
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

export type FeatureAccess =
  | {
      /** Unique feature code. */
      code: string;
      /** Display name of the feature. */
      name: string;
      /** Display name for one product unit, or null when not applicable. */
      unitName: string | null;
      /** Whether the customer can currently access or consume the feature. */
      allowed: boolean;
      type: "boolean";
      /** Whether the feature is enabled. */
      enabled: boolean;
      baseAccess?: {
        enabled: boolean;
      } | null;
      object: "feature_access";
      livemode: boolean;
    }
  | {
      /** Unique feature code. */
      code: string;
      /** Display name of the feature. */
      name: string;
      /** Display name for one product unit, or null when not applicable. */
      unitName: string | null;
      /** Whether the customer can currently access or consume the feature. */
      allowed: boolean;
      type: "usage";
      consumption:
        | {
            /** Usage is measured against an included allowance and overage. */
            model: "metered";
            /** Time range used to calculate this feature's consumption. */
            period: {
              /**
               * Inclusive usage period start.
               * @format date-time
               */
              start: string;
              /**
               * Exclusive usage period end.
               * @format date-time
               */
              end: string;
            };
            /** Product units recorded during the period. */
            unitsUsed: number;
            /** Product units included in the subscription for the period. */
            includedUnits: number;
            /** Included units not yet consumed. Absent when usage is unlimited. */
            remainingUnits?: number;
            /** Whether the feature has no usage limit. */
            unlimited: boolean;
            overage: {
              /** Whether usage above the included amount is allowed and billed. */
              enabled: boolean;
              /** Units consumed above the included amount. */
              units: number;
              /** Price for one additional product unit. */
              unitPrice?: {
                /** Integer rate amount. Divide by scale to obtain the price. */
                amount: number;
                /** Lowercase ISO 4217 currency code. */
                currency: string;
                /** Divide amount by scale to obtain the major-unit price. */
                scale: 10000;
              };
            };
          }
        | {
            /** Product usage consumes credits from a shared pool. */
            model: "credits";
            /** Time range used to calculate this feature's consumption. */
            period: {
              /**
               * Inclusive usage period start.
               * @format date-time
               */
              start: string;
              /**
               * Exclusive usage period end.
               * @format date-time
               */
              end: string;
            };
            /** Product units recorded during the period. */
            unitsUsed: number;
            /** Credits deducted for each product unit. */
            creditsPerUnit: number;
            /** Actual credits deducted by this feature during the period. */
            creditsConsumed: number;
            /** Additional product units available from the current shared credit pool at this feature's conversion rate. */
            availableUnits: number;
          }
        | {
            /** Product usage deducts money from a shared balance. */
            model: "balance";
            /** Time range used to calculate this feature's consumption. */
            period: {
              /**
               * Inclusive usage period start.
               * @format date-time
               */
              start: string;
              /**
               * Exclusive usage period end.
               * @format date-time
               */
              end: string;
            };
            /** Product units recorded during the period. */
            unitsUsed: number;
            /** Actual money deducted for this feature during the period. */
            spent: {
              /** Amount in the currency's smallest unit. */
              amount: number;
              /** Lowercase ISO 4217 currency code. */
              currency: string;
            };
            /** Estimated additional units available from the current shared balance at this feature's fixed price. Absent for dynamic pricing. */
            availableUnits?: number;
            /** Price for one additional product unit. */
            unitPrice?: {
              /** Integer rate amount. Divide by scale to obtain the price. */
              amount: number;
              /** Lowercase ISO 4217 currency code. */
              currency: string;
              /** Divide amount by scale to obtain the major-unit price. */
              scale: 10000;
            };
          };
      baseAccess?: {
        includedUnits: number;
        unlimited: boolean;
      } | null;
      object: "feature_access";
      livemode: boolean;
    }
  | {
      /** Unique feature code. */
      code: string;
      /** Display name of the feature. */
      name: string;
      /** Display name for one product unit, or null when not applicable. */
      unitName: string | null;
      /** Whether the customer can currently access or consume the feature. */
      allowed: boolean;
      type: "seats";
      usage: {
        /** Time range used to calculate this feature's consumption. */
        period: {
          /**
           * Inclusive usage period start.
           * @format date-time
           */
          start: string;
          /**
           * Exclusive usage period end.
           * @format date-time
           */
          end: string;
        };
        /** Current units assigned or in use. */
        unitsUsed: number;
        /** Units included in the subscription for the period. */
        includedUnits: number;
        /** Included units still available. Absent when usage is unlimited. */
        remainingUnits?: number;
        /** Whether the feature has no usage limit. */
        unlimited: boolean;
        overage: {
          /** Whether usage above the included amount is allowed and billed. */
          enabled: boolean;
          /** Units consumed above the included amount. */
          units: number;
          /** Price for one additional product unit. */
          unitPrice?: {
            /** Integer rate amount. Divide by scale to obtain the price. */
            amount: number;
            /** Lowercase ISO 4217 currency code. */
            currency: string;
            /** Divide amount by scale to obtain the major-unit price. */
            scale: 10000;
          };
        };
      };
      baseAccess?: {
        includedUnits: number;
        unlimited: boolean;
      } | null;
      object: "feature_access";
      livemode: boolean;
    }
  | {
      /** Unique feature code. */
      code: string;
      /** Display name of the feature. */
      name: string;
      /** Display name for one product unit, or null when not applicable. */
      unitName: string | null;
      /** Whether the customer can currently access or consume the feature. */
      allowed: boolean;
      type: "quota";
      usage: {
        /** Time range used to calculate this feature's consumption. */
        period: {
          /**
           * Inclusive usage period start.
           * @format date-time
           */
          start: string;
          /**
           * Exclusive usage period end.
           * @format date-time
           */
          end: string;
        };
        /** Current units assigned or in use. */
        unitsUsed: number;
        /** Units included in the subscription for the period. */
        includedUnits: number;
        /** Included units still available. Absent when usage is unlimited. */
        remainingUnits?: number;
        /** Whether the feature has no usage limit. */
        unlimited: boolean;
        overage: {
          /** Whether usage above the included amount is allowed and billed. */
          enabled: boolean;
          /** Units consumed above the included amount. */
          units: number;
          /** Price for one additional product unit. */
          unitPrice?: {
            /** Integer rate amount. Divide by scale to obtain the price. */
            amount: number;
            /** Lowercase ISO 4217 currency code. */
            currency: string;
            /** Divide amount by scale to obtain the major-unit price. */
            scale: 10000;
          };
        };
        /** Highest quota reached during the period and used for billing. */
        billedUnits: number;
      };
      baseAccess?: {
        includedUnits: number;
        unlimited: boolean;
      } | null;
      object: "feature_access";
      livemode: boolean;
    };

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
  memo: string | null;
  metadata: Record<string, unknown>;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  creditApplied: number;
  planName: string | null;
  poNumber: string | null;
  reference: string | null;
  lineItems: Array<{
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
      | "one_time"
      | "prepaid_period";
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
  object: "invoice_download_link";
  livemode: boolean;
}

export interface InvoiceListItem {
  id: string;
  customerId: string;
  subscriptionId: string | null;
  invoiceNumber: string;
  status: "draft" | "outstanding" | "paid" | "void" | "uncollectible";
  invoiceType: InvoiceType;
  currency: string;
  subtotal: number;
  discountAmount: number;
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
  memo: string | null;
  metadata: Record<string, unknown>;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  object: "invoice";
  livemode: boolean;
}

export interface KeptOnVersion {
  subscriptionId: string;
  keptOnVersion: true;
  object: "kept_on_version";
  livemode: boolean;
}

export type ManagedBy = "dub" | null;

export interface Market {
  id: string;
  name: string;
  countryCodes: Array<string>;
  metadata: Record<string, unknown>;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  object: "market";
  livemode: boolean;
}

export interface Offer {
  id: string;
  name: string;
  phases: Array<
    | {
        type: "percentage";
        durationCycles: number | null;
        /** Unit the phase duration is counted in. Only a fixed-price phase may set it, because its amount is declared rather than derived from the plan. Defaults to the plan's own billing interval. */
        durationInterval:
          | "weekly"
          | "monthly"
          | "quarterly"
          | "semiannual"
          | "yearly"
          | null;
        /** Discount in basis points. 5000 means 50%. */
        percentage: number;
      }
    | {
        type: "amount_off";
        durationCycles: number | null;
        /** Unit the phase duration is counted in. Only a fixed-price phase may set it, because its amount is declared rather than derived from the plan. Defaults to the plan's own billing interval. */
        durationInterval:
          | "weekly"
          | "monthly"
          | "quarterly"
          | "semiannual"
          | "yearly"
          | null;
        amounts: Array<{
          currency: string;
          /** Amount in the currency's minor unit (for example, cents for USD). */
          amount: number;
        }>;
      }
    | {
        type: "fixed_price";
        durationCycles: number | null;
        /** Unit the phase duration is counted in. Only a fixed-price phase may set it, because its amount is declared rather than derived from the plan. Defaults to the plan's own billing interval. */
        durationInterval:
          | "weekly"
          | "monthly"
          | "quarterly"
          | "semiannual"
          | "yearly"
          | null;
        prices: Array<{
          currency: string;
          /** Amount in the currency's minor unit (for example, cents for USD). */
          amount: number;
        }>;
      }
  >;
  metadata: Record<string, unknown>;
  startsAt: string | null;
  endsAt: string | null;
  active: boolean;
  /** Integration that manages this record, or null when the merchant does. While an integration manages it, its terms change only in that integration and edits answer 409 managed_by_integration. */
  managedBy: ManagedBy;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  object: "offer";
  livemode: boolean;
}

export interface Payment {
  /** Charge context captured for new payments. Null for historical payments with no captured context. */
  paymentContext: {
    /** The original reason for the charge. Recovery never replaces this reason. */
    reason:
      | "first_subscription_payment"
      | "trial_conversion"
      | "recurring_billing"
      | "plan_change"
      | "reactivation"
      | "subscription_resume"
      | "one_time_payment"
      | "overage"
      | "adjustment"
      | "addon_activation"
      | "prepayment";
    /** The public payment link ID, independently of the reason, or null when no payment link originated the charge. */
    paymentLinkId: string | null;
    recovery:
      | {
          type: "payment_recovery";
        }
      | {
          type: "dunning_retry";
          /** Current retry, starting at 1. The original decline is not a retry. */
          attempt: number;
          /** Total retries applicable to this charge's dunning schedule. */
          maxAttempts: number;
        }
      | null;
  } | null;
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
  provider: "stripe" | "commet" | "dlocal";
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
  object: "checkout_session";
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

export interface Plan {
  id: string;
  name: string;
  code: string;
  description: string | null;
  consumptionModel: ConsumptionModel | null;
  isPublic: boolean;
  isDefault: boolean;
  isFree: boolean;
  /** Credits and balance plans: true stops usage when the plan and purchased amounts run out; false lets usage continue and bills the missing amount as overage at the next renewal (credits at the price per credit). Trials and free plans always stop. */
  blockOnExhaustion: boolean | null;
  /** Credits plans only; null for other consumption models. What happens to unused plan credits at each reset. Purchased credits never expire and never count toward maxPlanCredits. */
  unusedPlanCredits:
    | {
        type: "expire";
      }
    | {
        type: "roll_over";
        /** The most plan credits a subscription holds after a reset, including the credits that reset grants; credits above it expire. At least the included credits of every price. null means no limit other than the largest storable balance, 2,147,483,647 plan credits. */
        maxPlanCredits: number | null;
      }
    | null;
  /** Credits plans only. The most plan credits a subscription spends per day or per week; null means no limit. */
  planCreditLimit: {
    /** The most plan credits a subscription spends in one window. */
    credits: number;
    /** The window length: `day` is 24 hours and `week` is 7 days, starting at the time of day of the subscription's billing anchor. */
    interval: "day" | "week";
  } | null;
  /** Balance plans only; null for other consumption models. What happens to unused plan balance at each reset. Purchased balance never expires and never counts toward maxPlanBalance. */
  unusedPlanBalance:
    | {
        type: "expire";
      }
    | {
        type: "roll_over";
        /** The most plan balance a subscription holds after a reset, in USD cents, including the balance that reset grants; balance above it expires. At least the included balance of every price. Other currencies convert it with the plan's exchange rate unless the dashboard sets a custom amount for that currency. null means no limit other than the largest storable amount, 2,147,483,647 cents. */
        maxPlanBalance: number | null;
      }
    | null;
  /** Balance plans only. The most plan balance a subscription spends per day or per week, in USD cents; null means no limit. */
  planBalanceLimit: {
    /** The most plan balance a subscription spends in one window, in USD cents. Other currencies convert it with the plan's exchange rate unless the dashboard sets a custom amount for that currency. */
    amount: number;
    /** The window length: `day` is 24 hours and `week` is 7 days, starting at the time of day of the subscription's billing anchor. */
    interval: "day" | "week";
  } | null;
  sortOrder: number;
  planGroupId: string | null;
  metadata: Record<string, unknown> | null;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  features: Array<{
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
    regionalPrices: Array<{
      currency: string;
      overageUnitPrice: number | null;
      autoSynced: boolean;
    }>;
  }>;
  prices: Array<{
    /** Public plan price ID. */
    id: string;
    billingInterval: BillingInterval;
    /** Price in the currency's minor unit (for example, cents for USD). */
    price: number;
    isDefault: boolean;
    trialDays: number;
    /** Whether the price's free trial needs a payment method to start. When false, a new subscription starts trialing right away without checkout; without a payment method added by the trial end, the customer moves to the plan group's default plan, or the subscription is canceled when there is none. Null when the price has no trial. */
    trialRequiresPaymentMethod: boolean | null;
    includedBalance: number | null;
    includedCredits: number | null;
    /** Automatic introductory offer for this price. Pass a Promotional Offer ID when creating a subscription to override it. */
    offerId: string | null;
    /** Public base price ID for a market price variant, or null for a base price. */
    inheritsFromPriceId: string | null;
    /** Application metadata. Variant display names may use metadata.name. */
    metadata: Record<string, unknown>;
    /** Country-market overrides. An empty array means currency pricing and then the global USD price remain the fallback. */
    marketPrices: Array<{
      /** Public pricing market group ID. */
      marketGroupId: string;
      /** Presentment currency for this market. */
      currency: string;
      /** Market price in the currency's minor unit. */
      price: number;
    }>;
    regionalPrices: Array<{
      currency: string;
      price: number;
      includedBalance: number | null;
      autoSynced: boolean;
    }>;
  }>;
  exchangeRates: Array<{
    currency: string;
    exchangeRate: number;
  }>;
  /** Countries with their own currency or prices in the current version. Buyers from any other country pay the USD prices. */
  countries: Array<{
    /** ISO country code. */
    country: string;
    /** The currency buyers from the country pay, USD included. */
    currency: string;
    prices: Array<{
      billingInterval: BillingInterval;
      /** The country's price in the currency's minor unit. */
      price: number;
      /** True when set by hand; false when it follows the USD base at the exchange rate. */
      manual: boolean;
    }>;
    /** Every add-on the version sells, priced for the country. */
    addons: Array<{
      addonId: string;
      /** What buyers from the country pay for the add-on, in the currency's minor unit. */
      price: number;
      /** True when set by hand; false when it follows the add-on's USD price at the exchange rate. */
      manual: boolean;
    }>;
    /** Every credit pack the version sells, priced for the country. */
    creditPacks: Array<{
      creditPackId: string;
      /** What buyers from the country pay for the pack, in the currency's minor unit. */
      price: number;
      /** True when set by hand; false when it follows the pack's USD price at the exchange rate. */
      manual: boolean;
    }>;
  }>;
  object: "plan";
  livemode: boolean;
}

export type PlanChange =
  | {
      outcome: "requires_checkout";
      requiresCheckout: true;
      checkoutUrl: string;
      offerApplication?: {
        id: string;
        offerId: string;
        name: string;
        currency: string;
        /** Subtotal in the currency's minor unit. */
        subtotal: number;
        /** Discount in the currency's minor unit. */
        discountAmount: number;
        /** Total in the currency's minor unit. */
        total: number;
        phases: Array<
          | {
              type: "free_trial";
              durationDays: number;
              startsAt: string | null;
              endsAt: string | null;
            }
          | {
              type: "percentage";
              durationCycles: number | null;
              durationInterval:
                | "weekly"
                | "monthly"
                | "quarterly"
                | "semiannual"
                | "yearly"
                | null;
              startsAt: string | null;
              endsAt: string | null;
              /** Discount in basis points. 5000 means 50%. */
              percentage: number;
            }
          | {
              type: "amount_off";
              durationCycles: number | null;
              durationInterval:
                | "weekly"
                | "monthly"
                | "quarterly"
                | "semiannual"
                | "yearly"
                | null;
              startsAt: string | null;
              endsAt: string | null;
              /** Discount in the application currency's minor unit. */
              amount: number;
            }
          | {
              type: "fixed_price";
              durationCycles: number | null;
              durationInterval:
                | "weekly"
                | "monthly"
                | "quarterly"
                | "semiannual"
                | "yearly"
                | null;
              startsAt: string | null;
              endsAt: string | null;
              /** Fixed price in the application currency's minor unit. */
              price: number;
            }
        >;
        appliesTo:
          | {
              type: "plan_price";
              id: string;
            }
          | {
              type: "addon";
              id: string;
            }
          | {
              type: "credit_pack";
              id: string;
            };
      };
      object: "plan_change";
      livemode: boolean;
    }
  | {
      outcome: "scheduled";
      id: string;
      scheduled: true;
      /** @format date-time */
      scheduledFor: string;
      changeType:
        | "subscription.plan_downgrade"
        | "subscription.interval_change"
        | "subscription.cancel";
      customerId: string;
      newPlanId?: string;
      newPlanName?: string;
      newBillingInterval?: string;
      seatLimitWarning?: {
        featureCode: string;
        featureName: string;
        currentSeats: number;
        included: number;
        newPlanName: string;
        /** @format date-time */
        effectiveDate: string;
      };
      object: "plan_change";
      livemode: boolean;
    }
  | {
      outcome: "completed";
      id: string;
      scheduled: false;
      customerId: string;
      previousPlan: {
        id: string;
        name: string;
      };
      currentPlan: {
        id: string;
        name: string;
        price: number;
      };
      billingInterval: string;
      billing: {
        credit: number;
        creditsApplied: number;
        charge: number;
        taxAmount: number;
        netAmount: number;
        totalCharged: number;
        remainingCreditBalance: number;
      };
      invoiceId?: string;
      offerApplication?: {
        id: string;
        offerId: string;
        name: string;
        currency: string;
        /** Subtotal in the currency's minor unit. */
        subtotal: number;
        /** Discount in the currency's minor unit. */
        discountAmount: number;
        /** Total in the currency's minor unit. */
        total: number;
        phases: Array<
          | {
              type: "free_trial";
              durationDays: number;
              startsAt: string | null;
              endsAt: string | null;
            }
          | {
              type: "percentage";
              durationCycles: number | null;
              durationInterval:
                | "weekly"
                | "monthly"
                | "quarterly"
                | "semiannual"
                | "yearly"
                | null;
              startsAt: string | null;
              endsAt: string | null;
              /** Discount in basis points. 5000 means 50%. */
              percentage: number;
            }
          | {
              type: "amount_off";
              durationCycles: number | null;
              durationInterval:
                | "weekly"
                | "monthly"
                | "quarterly"
                | "semiannual"
                | "yearly"
                | null;
              startsAt: string | null;
              endsAt: string | null;
              /** Discount in the application currency's minor unit. */
              amount: number;
            }
          | {
              type: "fixed_price";
              durationCycles: number | null;
              durationInterval:
                | "weekly"
                | "monthly"
                | "quarterly"
                | "semiannual"
                | "yearly"
                | null;
              startsAt: string | null;
              endsAt: string | null;
              /** Fixed price in the application currency's minor unit. */
              price: number;
            }
        >;
        appliesTo:
          | {
              type: "plan_price";
              id: string;
            }
          | {
              type: "addon";
              id: string;
            }
          | {
              type: "credit_pack";
              id: string;
            };
      };
      object: "plan_change";
      livemode: boolean;
    };

export interface PlanDraft {
  /** Public plan draft ID. */
  id: string;
  /** The version the draft started from. */
  fromVersionId: string;
  /** What the draft changes against the version it started from. */
  changes: Array<{
    /** Identifies the change; send it to undo just this change. */
    key: string;
    /** Where the change is: Price, Trial, a rules section, Add-ons, or a country. */
    section: string;
    /** ISO country code when the change belongs to one country. */
    country: string | null;
    /** What changed, such as Monthly price. */
    label: string;
    /** The value before, formatted. */
    before: string | null;
    /** The value now, formatted. */
    after: string | null;
  }>;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  object: "plan_draft";
  livemode: boolean;
}

export interface PlanDraftPublication {
  preview: boolean;
  /** The published version. Null for a preview. */
  version: {
    /** Public plan version ID. */
    id: string;
    /** The plan's versions are numbered 1, 2, 3; an experiment's own versions read with its code, such as price-test 2. */
    label: string;
    /** The plan's version number. Null for a version that only belongs to an experiment; an experiment version made current takes the next number. */
    number: number | null;
    /** The experiment this version belongs to, if any. */
    experiment: {
      /** The experiment's code, as sold with planCode. */
      code: string;
      /** Its number within the experiment. */
      version: number;
    } | null;
    /** Whether new buyers get this version. */
    isCurrent: boolean;
    /** The version this one was created from. */
    parentVersionId: string | null;
    /** Active, trialing, past due and paused subscriptions on it. */
    subscriptionCount: number;
    maxPlanCredits: number | null;
    maxPlanBalance: number | null;
    prices: Array<{
      /** Public plan price ID. */
      id: string;
      billingInterval:
        | "weekly"
        | "monthly"
        | "quarterly"
        | "semiannual"
        | "yearly"
        | "one_time";
      price: number;
      includedCredits: number | null;
      includedBalance: number | null;
      regionalPrices: Array<{
        currency: string;
        price: number;
        includedBalance: number | null;
      }>;
    }>;
    /** @format date-time */
    createdAt: string;
  } | null;
  /** The move of subscribers, if any. */
  moveId: string | null;
  subscribers: {
    moving: number;
    keptOnVersion: number;
    /** Left on their version because no change makes them fit; they show among the subscribers that need a change. */
    needsAChange: number;
    leftOut: Array<{
      subscriptionId: string;
      code: string;
      message: string;
    }>;
  } | null;
  object: "plan_draft_publication";
  livemode: boolean;
}

export interface PlanExperiment {
  /** Public plan experiment ID. */
  id: string;
  /** The code to sell it with as planCode, such as pro:price-test. It always sells the experiment's latest version while running, and the plan's current version once closed. */
  code: string;
  /** running sells its latest version; won became the plan's current version; archived stopped selling. */
  status: "running" | "won" | "archived";
  /** The plan's version that was current when it started. */
  startedFromVersionId: string;
  /** Its latest version. */
  latestVersionId: string;
  /** The version its code sells to new buyers today. */
  sellsVersionId: string;
  /** Active, trialing, past due and paused subscriptions on its versions. */
  subscriptionCount: number;
  /** @format date-time */
  createdAt: string;
  closedAt: string | null;
  object: "plan_experiment";
  livemode: boolean;
}

export interface PlanExperimentArchive {
  experiment: {
    /** Public plan experiment ID. */
    id: string;
    /** The code to sell it with as planCode, such as pro:price-test. It always sells the experiment's latest version while running, and the plan's current version once closed. */
    code: string;
    /** running sells its latest version; won became the plan's current version; archived stopped selling. */
    status: "running" | "won" | "archived";
    /** The plan's version that was current when it started. */
    startedFromVersionId: string;
    /** Its latest version. */
    latestVersionId: string;
    /** The version its code sells to new buyers today. */
    sellsVersionId: string;
    /** Active, trialing, past due and paused subscriptions on its versions. */
    subscriptionCount: number;
    /** @format date-time */
    createdAt: string;
    closedAt: string | null;
  };
  /** The move of its subscribers, or null when they stay. */
  moveId: string | null;
  object: "plan_experiment_archive";
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
  object: "plan_feature";
  livemode: boolean;
}

export interface PlanGrant {
  id: string;
  customerId: string;
  subscriptionId: string;
  basePlanId: string;
  planId: string;
  planReleaseId: string;
  status: "active" | "expired" | "revoked";
  duration: "cycles" | "until_date" | "until_revoked";
  durationCycles: number | null;
  /** @format date-time */
  startsAt: string;
  expiresAt: string | null;
  reason: string;
  source: "dashboard" | "api";
  revokedAt: string | null;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  events: Array<{
    id: string;
    type: "created" | "updated" | "expired" | "revoked";
    reason: string;
    source: "dashboard" | "api" | "system";
    previousExpiresAt: string | null;
    expiresAt: string | null;
    duration: "cycles" | "until_date" | "until_revoked" | null;
    durationCycles: number | null;
    requestedExpiresAt: string | null;
    /** @format date-time */
    createdAt: string;
  }>;
  object: "plan_grant";
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
  object: "plan_group";
  livemode: boolean;
}

export interface PlanGroupDetail {
  id: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  plans: Array<{
    id: string;
    name: string;
    sortOrder: number;
  }>;
  object: "plan_group";
  livemode: boolean;
}

export interface PlanMove {
  /** Public move ID. Null for a preview, which records nothing. */
  id: string | null;
  toVersionId: string;
  /** The versions its subscribers are moving from. */
  fromVersionIds: Array<string>;
  effective: "now" | "period_end";
  preview: boolean;
  /** checked is a preview where everyone fits; moving while subscribers wait for their move; completed once every move ran; canceled after it was canceled. */
  status:
    | "checking"
    | "blocked"
    | "checked"
    | "moving"
    | "completed"
    | "canceled";
  counts: {
    moving: number;
    moved: number;
    needsAChange: number;
    leftOut: number;
    canceled: number;
    keptOnVersion: number;
  };
  subscriptions: Array<{
    subscriptionId: string;
    /** moving waits for its renewal or is being moved; moved is on the destination; needs_a_change could not move and keeps its version until it is resolved or kept; left_out was not moved because it was not active, trialing or past due, such as a paused subscription (invalid_subscription_status), or because a listed subscription was already on the destination (no_change_requested); canceled was canceled before it moved; kept_on_version was left on its version by the merchant. */
    status:
      | "moving"
      | "moved"
      | "needs_a_change"
      | "left_out"
      | "canceled"
      | "kept_on_version";
    code: string | null;
    message: string | null;
  }>;
  createdAt: string | null;
  completedAt: string | null;
  canceledAt: string | null;
  object: "plan_move";
  livemode: boolean;
}

export interface PlanPrice {
  /** Public plan price ID. */
  id: string;
  planId: string;
  billingInterval: BillingInterval;
  /** Price in the currency's minor unit (for example, cents for USD). */
  price: number;
  isDefault: boolean;
  trialDays: number;
  /** Whether the price's free trial needs a payment method to start. When false, a new subscription starts trialing right away without checkout; without a payment method added by the trial end, the customer moves to the plan group's default plan, or the subscription is canceled when there is none. Null when the price has no trial. */
  trialRequiresPaymentMethod: boolean | null;
  includedBalance: number | null;
  includedCredits: number | null;
  /** Automatic introductory offer for this price. */
  offerId: string | null;
  /** Public base price ID for a market price variant, or null for a base price. */
  inheritsFromPriceId: string | null;
  /** Application metadata. Variant display names may use metadata.name. */
  metadata: Record<string, unknown>;
  /** Country-market overrides. Variants inherit their base price for every market not listed. */
  marketPrices: Array<{
    /** Public pricing market group ID. */
    marketGroupId: string;
    /** Presentment currency for this market. */
    currency: string;
    /** Market price in the currency's minor unit. */
    price: number;
  }>;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  object: "plan_price";
  livemode: boolean;
}

export interface PlanRegionalPricing {
  priceId: string;
  overrides: Array<{
    currency: string;
    price: number;
    includedBalance?: number;
  }>;
  object: "plan_regional_pricing";
  livemode: boolean;
}

export interface PlanRegionalPricingResult {
  planId: string;
  currency: string;
  exchangeRate: number;
  pricesConfigured: number;
  featuresConfigured: number;
  object: "plan_regional_pricing";
  livemode: boolean;
}

export interface PlanVersion {
  /** Public plan version ID. */
  id: string;
  /** The plan's versions are numbered 1, 2, 3; an experiment's own versions read with its code, such as price-test 2. */
  label: string;
  /** The plan's version number. Null for a version that only belongs to an experiment; an experiment version made current takes the next number. */
  number: number | null;
  /** The experiment this version belongs to, if any. */
  experiment: {
    /** The experiment's code, as sold with planCode. */
    code: string;
    /** Its number within the experiment. */
    version: number;
  } | null;
  /** Whether new buyers get this version. */
  isCurrent: boolean;
  /** The version this one was created from. */
  parentVersionId: string | null;
  /** Active, trialing, past due and paused subscriptions on it. */
  subscriptionCount: number;
  maxPlanCredits: number | null;
  maxPlanBalance: number | null;
  prices: Array<{
    /** Public plan price ID. */
    id: string;
    billingInterval:
      | "weekly"
      | "monthly"
      | "quarterly"
      | "semiannual"
      | "yearly"
      | "one_time";
    price: number;
    includedCredits: number | null;
    includedBalance: number | null;
    regionalPrices: Array<{
      currency: string;
      price: number;
      includedBalance: number | null;
    }>;
  }>;
  /** @format date-time */
  createdAt: string;
  object: "plan_version";
  livemode: boolean;
}

export interface PlanVersionComparison {
  /** The version the changes start from. */
  versionId: string;
  /** The version they end at. */
  againstVersionId: string;
  /** Every term that differs, the plan's first and then each country. */
  changes: Array<{
    /** Identifies the change; send it to undo just this change. */
    key: string;
    /** Where the change is: Price, Trial, a rules section, Add-ons, or a country. */
    section: string;
    /** ISO country code when the change belongs to one country. */
    country: string | null;
    /** What changed, such as Monthly price. */
    label: string;
    /** The value before, formatted. */
    before: string | null;
    /** The value now, formatted. */
    after: string | null;
  }>;
  object: "plan_version_comparison";
  livemode: boolean;
}

export interface PortalAccess {
  portalUrl: string;
  object: "portal_session";
  livemode: boolean;
}

export interface PrepaidPeriodsCheckout {
  checkoutUrl: string;
  object: "checkout_session";
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
  /** Active add-ons that the version the change moves the subscription to does not sell. The change deactivates them when it applies. */
  deactivatedAddons: Array<{
    addonId: string;
    name: string;
  }>;
  offerApplication?: {
    id: string;
    offerId: string;
    name: string;
    currency: string;
    /** Subtotal in the currency's minor unit. */
    subtotal: number;
    /** Discount in the currency's minor unit. */
    discountAmount: number;
    /** Total in the currency's minor unit. */
    total: number;
    phases: Array<
      | {
          type: "free_trial";
          durationDays: number;
          startsAt: string | null;
          endsAt: string | null;
        }
      | {
          type: "percentage";
          durationCycles: number | null;
          durationInterval:
            | "weekly"
            | "monthly"
            | "quarterly"
            | "semiannual"
            | "yearly"
            | null;
          startsAt: string | null;
          endsAt: string | null;
          /** Discount in basis points. 5000 means 50%. */
          percentage: number;
        }
      | {
          type: "amount_off";
          durationCycles: number | null;
          durationInterval:
            | "weekly"
            | "monthly"
            | "quarterly"
            | "semiannual"
            | "yearly"
            | null;
          startsAt: string | null;
          endsAt: string | null;
          /** Discount in the application currency's minor unit. */
          amount: number;
        }
      | {
          type: "fixed_price";
          durationCycles: number | null;
          durationInterval:
            | "weekly"
            | "monthly"
            | "quarterly"
            | "semiannual"
            | "yearly"
            | null;
          startsAt: string | null;
          endsAt: string | null;
          /** Fixed price in the application currency's minor unit. */
          price: number;
        }
    >;
    appliesTo:
      | {
          type: "plan_price";
          id: string;
        }
      | {
          type: "addon";
          id: string;
        }
      | {
          type: "credit_pack";
          id: string;
        };
  };
  object: "plan_change_preview";
  livemode: boolean;
}

export interface PromoCode {
  id: string;
  code: string;
  offerId: string;
  billingInterval: BillingInterval | null;
  maxRedemptions: number | null;
  expiresAt: string | null;
  isActive: boolean;
  redemptionCount: number;
  /** Whether the code only applies to a customer's first purchase: one with no paid invoice above zero and no paid subscription. */
  firstPurchaseOnly: boolean;
  /** Integration that manages this record, or null when the merchant does. While an integration manages it, its terms change only in that integration and edits answer 409 managed_by_integration. */
  managedBy: ManagedBy;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  object: "promo_code";
  livemode: boolean;
}

export interface ReactivatedSubscription {
  subscriptionId: string;
  invoiceId: string;
  status: "processing" | "succeeded";
  offerApplication?: {
    id: string;
    offerId: string;
    name: string;
    currency: string;
    /** Subtotal in the currency's minor unit. */
    subtotal: number;
    /** Discount in the currency's minor unit. */
    discountAmount: number;
    /** Total in the currency's minor unit. */
    total: number;
    phases: Array<
      | {
          type: "free_trial";
          durationDays: number;
          startsAt: string | null;
          endsAt: string | null;
        }
      | {
          type: "percentage";
          durationCycles: number | null;
          durationInterval:
            | "weekly"
            | "monthly"
            | "quarterly"
            | "semiannual"
            | "yearly"
            | null;
          startsAt: string | null;
          endsAt: string | null;
          /** Discount in basis points. 5000 means 50%. */
          percentage: number;
        }
      | {
          type: "amount_off";
          durationCycles: number | null;
          durationInterval:
            | "weekly"
            | "monthly"
            | "quarterly"
            | "semiannual"
            | "yearly"
            | null;
          startsAt: string | null;
          endsAt: string | null;
          /** Discount in the application currency's minor unit. */
          amount: number;
        }
      | {
          type: "fixed_price";
          durationCycles: number | null;
          durationInterval:
            | "weekly"
            | "monthly"
            | "quarterly"
            | "semiannual"
            | "yearly"
            | null;
          startsAt: string | null;
          endsAt: string | null;
          /** Fixed price in the application currency's minor unit. */
          price: number;
        }
    >;
    appliesTo:
      | {
          type: "plan_price";
          id: string;
        }
      | {
          type: "addon";
          id: string;
        }
      | {
          type: "credit_pack";
          id: string;
        };
  };
  object: "subscription_reactivation";
  livemode: boolean;
}

export interface RecoveryLink {
  url: string;
  token: string;
  object: "recovery_link";
  livemode: boolean;
}

export interface Refund {
  id: string;
  transactionId: string;
  amount: number;
  currency: string;
  chargeId: string | null;
  status: "pending" | "requires_action" | "succeeded" | "failed" | "canceled";
  reason: "duplicate" | "fraudulent" | "requested_by_customer" | null;
  object: "refund";
  livemode: boolean;
}

export interface RemovedPlanFeature {
  id: string;
  removed: true;
  object: "plan_feature";
  livemode: boolean;
}

export interface RemovedPlanFromGroup {
  id: string;
  removed: boolean;
  object: "plan_group_membership";
  livemode: boolean;
}

export interface ReorderedPlans {
  reordered: boolean;
  object: "plan_group_order";
  livemode: boolean;
}

export interface SeatBalance {
  current: number;
  /** @format date-time */
  asOf: string;
  object: "seat_balance";
  livemode: boolean;
}

export interface SeatBalanceCollection {
  balances: Record<
    string,
    {
      current: number;
      /** @format date-time */
      asOf: string;
    }
  >;
  object: "seat_balance_collection";
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
  object: "seat_event";
  livemode: boolean;
}

export interface SentInvoice {
  sent: boolean;
  /** @format date-time */
  sentAt: string;
  object: "invoice_delivery";
  livemode: boolean;
}

export interface SubscriberNeedingAChange {
  subscriptionId: string;
  /** The move it could not complete. */
  moveId: string;
  /** The version it stays on. */
  fromVersionId: string;
  /** The version it could not move to. */
  toVersionId: string;
  /** Why it could not move. */
  code: string;
  message: string;
  object: "subscriber_needing_a_change";
  livemode: boolean;
}

export interface Subscription {
  id: string;
  customerId: string;
  plan: {
    id: string;
    name: string;
    basePrice: number;
  };
  name: string;
  description: string | null;
  status: SubscriptionStatus;
  billingInterval: BillingInterval | null;
  trialEndsAt: string | null;
  currentPeriod: {
    /** @format date-time */
    start: string;
    /** @format date-time */
    end: string;
    daysRemaining: number;
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
  /** @format date-time */
  startDate: string;
  endDate: string | null;
  billingDayOfMonth: number | null;
  nextBillingDate: string | null;
  checkoutUrl: string | null;
  /** Whether Commet can charge this subscription on its own at its next charge (the trial end or the renewal). A trial that started without a payment method reports false until the customer adds one for this subscription; a payment method saved for another subscription does not count. A subscription on a free plan reports false. */
  hasPaymentMethod: boolean;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  /** The plan version whose terms the subscription has now. It keeps paying and receiving everything from this version until it is moved. */
  planVersion: {
    /** Public plan version ID. */
    id: string;
    /** Main versions are 1, 2, 3; an experiment's versions carry its own code, like price-test 2. */
    label: string;
  } | null;
  offerApplications: Array<SubscriptionOfferApplication>;
  pause:
    | {
        status: "scheduled";
        mode: "period_end";
        /** @format date-time */
        requestedAt: string;
        /** @format date-time */
        effectiveAt: string;
        resumeAt: string | null;
      }
    | {
        status: "active";
        mode: "immediate" | "period_end";
        /** @format date-time */
        requestedAt: string;
        /** @format date-time */
        effectiveAt: string;
        resumeAt: string | null;
      }
    | null;
  /** A move to another version of the plan pending for the next renewal. */
  scheduledVersionChange: {
    planVersionId: string;
    label: string;
    /** @format date-time */
    effectiveAt: string;
  } | null;
  planGrant?: {
    /** The active Plan Grant ID. */
    id: string;
    /** The higher plan whose access is temporarily applied. */
    plan: {
      id: string;
      name: string;
    };
    /** When the temporary access ends, or null when it lasts until revoked. */
    expiresAt: string | null;
  };
  consumptionModel: ConsumptionModel | null;
  features: Array<
    | {
        code: string;
        name: string;
        type: "boolean";
        enabled: boolean;
        baseAccess?: {
          enabled: boolean;
        } | null;
      }
    | {
        code: string;
        name: string;
        type: "usage";
        usage?: {
          current: number;
          included: number;
          overageQuantity: number;
          overageUnitPrice?: number;
          unlimited?: boolean;
        };
        baseAccess?: {
          included: number;
          unlimited: boolean;
        } | null;
      }
    | {
        code: string;
        name: string;
        type: "seats";
        usage: {
          current: number;
          included: number;
          overageQuantity: number;
          overageUnitPrice?: number;
          unlimited?: boolean;
        };
        baseAccess?: {
          included: number;
          unlimited: boolean;
        } | null;
      }
    | {
        code: string;
        name: string;
        type: "quota";
        usage?: {
          current: number;
          included: number;
          overageQuantity: number;
          overageUnitPrice?: number;
          unlimited?: boolean;
        };
        baseAccess?: {
          included: number;
          unlimited: boolean;
        } | null;
      }
  >;
  credits: {
    /** Plan credits left. Kept for compatibility; equal to `plan`. */
    remaining: number;
    included: number;
    /** Purchased credits: purchases and manual adjustments. Spent after plan credits and kept until the subscription ends. */
    purchased: number;
    /** Plan credits left this period. Spent first and replaced or rolled over at each reset; negative while overage is owed. */
    plan: number;
    /** Credits available: `plan` plus `purchased`. */
    total: number;
  } | null;
  balance: {
    /** Balance available in minor units of the subscription currency. Kept for compatibility; equal to `total`. */
    remaining: number;
    included: number;
    currency: string;
    /** Plan balance left this period, in minor units. Spent first and replaced or rolled over at each reset; negative while overage is owed. */
    plan: number;
    /** Purchased balance in minor units: top-ups and manual adjustments. Spent after the plan balance and kept until the subscription ends. */
    purchased: number;
    /** Balance available in minor units: `plan` plus `purchased`. */
    total: number;
  } | null;
  priceId: string | null;
  object: "subscription";
  livemode: boolean;
}

export interface SubscriptionAddon {
  addonId: string;
  status: "active";
  proratedCharge: number;
  object: "subscription_addon";
  livemode: boolean;
}

export interface SubscriptionAutoTopUp {
  /** Whether top-ups run automatically: credits bought on a credits plan, balance added on a balance plan. Always false when the plan does not sell credits or has balance top-ups turned off. */
  enabled: boolean;
  /** The available amount at or below which a top-up runs, or null when never configured: credits (plan plus purchased) on a credits plan, minor units of the subscription currency (plan plus purchased balance) on a balance plan. */
  threshold: number | null;
  /** Credits each top-up buys on a credits plan, or null when never configured or on a balance plan. */
  quantity: number | null;
  /** Minor units of the subscription currency each top-up adds on a balance plan, charged plus tax, or null when never configured or on a credits plan. */
  amount: number | null;
  /** Maximum top-ups per renewal period, or null when never configured. */
  maxPerPeriod: number | null;
  /** active tops up when the available amount reaches the threshold; paused stops after three consecutive failed top-ups, or after one whose charge could not be refunded, until the payment method changes, a credit purchase or balance top-up succeeds or it is saved enabled again; off tops up nothing. */
  status: "active" | "paused" | "off";
  /** Top-ups made in the current renewal period. */
  topUpsThisPeriod: number;
  /** When the top-up count of the period resets, or null before the subscription starts its first period. */
  periodResetsAt: string | null;
  /** The last top-up that failed, or null when none has failed. */
  lastFailure: {
    reason:
      | "payment_declined"
      | "no_payment_method"
      | "quantity_below_minimum"
      | "amount_below_minimum"
      | "purchase_failed";
    /** @format date-time */
    at: string;
  } | null;
  object: "subscription_auto_top_up";
  livemode: boolean;
}

export interface SubscriptionOfferApplication {
  id: string;
  name: string;
  appliesTo:
    | {
        type: "plan_price";
        id: string;
      }
    | {
        type: "addon";
        id: string;
      }
    | {
        type: "credit_pack";
        id: string;
      };
  offerId: string | null;
  source:
    | "direct"
    | "introductory"
    | "promo_code"
    | "card_promotion"
    | "custom";
  status: "quoted" | "applied" | "failed" | "expired";
  currency: string | null;
  subtotal: number | null;
  discountAmount: number | null;
  total: number | null;
  phases: Array<SubscriptionOfferApplicationPhase>;
  /** @format date-time */
  quotedAt: string;
  expiresAt: string | null;
  appliedAt: string | null;
}

export type SubscriptionOfferApplicationPhase =
  | {
      type: "free_trial";
      durationDays: number;
      durationInterval:
        | "weekly"
        | "monthly"
        | "quarterly"
        | "semiannual"
        | "yearly"
        | null;
      startsAt: string | null;
      endsAt: string | null;
    }
  | {
      type: "percentage";
      durationCycles: number | null;
      durationInterval:
        | "weekly"
        | "monthly"
        | "quarterly"
        | "semiannual"
        | "yearly"
        | null;
      percentage: number;
      startsAt: string | null;
      endsAt: string | null;
    }
  | {
      type: "amount_off";
      durationCycles: number | null;
      durationInterval:
        | "weekly"
        | "monthly"
        | "quarterly"
        | "semiannual"
        | "yearly"
        | null;
      amount: number;
      startsAt: string | null;
      endsAt: string | null;
    }
  | {
      type: "fixed_price";
      durationCycles: number | null;
      durationInterval:
        | "weekly"
        | "monthly"
        | "quarterly"
        | "semiannual"
        | "yearly"
        | null;
      price: number;
      startsAt: string | null;
      endsAt: string | null;
    };

export interface SubscriptionResume {
  subscriptionId: string;
  invoiceId: string | null;
  status: "processing" | "succeeded";
  object: "subscription_resume";
  livemode: boolean;
}

export interface SubscriptionSummary {
  id: string;
  customerId: string;
  plan: {
    id: string;
    name: string;
  };
  name: string;
  description: string | null;
  status: SubscriptionStatus;
  billingInterval: BillingInterval | null;
  trialEndsAt: string | null;
  currentPeriod: {
    /** @format date-time */
    start: string;
    /** @format date-time */
    end: string;
    daysRemaining: number;
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
  /** @format date-time */
  startDate: string;
  endDate: string | null;
  billingDayOfMonth: number | null;
  nextBillingDate: string | null;
  checkoutUrl: string | null;
  /** Whether Commet can charge this subscription on its own at its next charge (the trial end or the renewal). A trial that started without a payment method reports false until the customer adds one for this subscription; a payment method saved for another subscription does not count. A subscription on a free plan reports false. */
  hasPaymentMethod: boolean;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  /** The plan version whose terms the subscription has now. It keeps paying and receiving everything from this version until it is moved. */
  planVersion: {
    /** Public plan version ID. */
    id: string;
    /** Main versions are 1, 2, 3; an experiment's versions carry its own code, like price-test 2. */
    label: string;
  } | null;
  offerApplications: Array<SubscriptionOfferApplication>;
  pause:
    | {
        status: "scheduled";
        mode: "period_end";
        /** @format date-time */
        requestedAt: string;
        /** @format date-time */
        effectiveAt: string;
        resumeAt: string | null;
      }
    | {
        status: "active";
        mode: "immediate" | "period_end";
        /** @format date-time */
        requestedAt: string;
        /** @format date-time */
        effectiveAt: string;
        resumeAt: string | null;
      }
    | null;
  priceId: string | null;
  object: "subscription";
  livemode: boolean;
}

export interface TestClock {
  simulatedTime: string | null;
  isActive: boolean;
  /** @format date-time */
  now: string;
  latestRun: {
    id: string;
    status: "pending" | "running" | "completed" | "failed";
    /** @format date-time */
    startedAtTime: string;
    /** @format date-time */
    targetTime: string;
    estimatedDeadlineCount: number;
    completedDeadlineCount: number;
    failedDeadlineCount: number;
    error: string | null;
    items: Array<{
      kind: "billing_cycle" | "dunning_retry";
      status: "pending" | "processing" | "completed" | "failed";
      /** @format date-time */
      dueAt: string;
      subscriptionId: string;
      customerName: string | null;
      invoiceNumber: string | null;
      invoiceId: string | null;
      outcome: string | null;
      detail: string | null;
      error: string | null;
    }>;
  } | null;
  object: "test_clock";
  livemode: boolean;
}

export interface TestClockRun {
  id: string;
  status: "pending" | "running" | "completed" | "failed";
  /** @format date-time */
  startedAtTime: string;
  /** @format date-time */
  targetTime: string;
  estimatedDeadlineCount: number;
  completedDeadlineCount: number;
  failedDeadlineCount: number;
  error: string | null;
  items: Array<{
    kind: "billing_cycle" | "dunning_retry";
    status: "pending" | "processing" | "completed" | "failed";
    /** @format date-time */
    dueAt: string;
    subscriptionId: string;
    customerName: string | null;
    invoiceNumber: string | null;
    invoiceId: string | null;
    outcome: string | null;
    detail: string | null;
    error: string | null;
  }>;
  object: "test_clock_run";
  livemode: boolean;
}

export interface Transaction {
  /** Charge context captured for new payments. Null for historical payments with no captured context. */
  paymentContext: {
    /** The original reason for the charge. Recovery never replaces this reason. */
    reason:
      | "first_subscription_payment"
      | "trial_conversion"
      | "recurring_billing"
      | "plan_change"
      | "reactivation"
      | "subscription_resume"
      | "one_time_payment"
      | "overage"
      | "adjustment"
      | "addon_activation"
      | "prepayment";
    /** The public payment link ID, independently of the reason, or null when no payment link originated the charge. */
    paymentLinkId: string | null;
    recovery:
      | {
          type: "payment_recovery";
        }
      | {
          type: "dunning_retry";
          /** Current retry, starting at 1. The original decline is not a retry. */
          attempt: number;
          /** Total retries applicable to this charge's dunning schedule. */
          maxAttempts: number;
        }
      | null;
  } | null;
  id: string;
  invoiceId: string | null;
  /** Gross amount in USD cents. Null when the provider has not reported an honest USD figure; see presentmentAmount. */
  grossAmount: number | null;
  /** Subtotal in USD cents (gross minus tax). Null when grossAmount is null. */
  subtotal: number | null;
  taxAmount: number | null;
  /** Amount in the charge currency's smallest unit, as presented to the customer. Set for non-USD charges; null when the charge was made in USD. */
  presentmentAmount: number | null;
  /** Cumulative confirmed refunds in the payment currency’s smallest unit. */
  amountRefunded: number;
  currency: string;
  /** The payment provider the charge was routed to: stripe, commet, or dlocal. */
  provider: PaymentProvider;
  /** The method used for this charge: card, oxxo, or mercado_pago. Null when unknown. */
  paymentMethod: PaymentMethod | null;
  /** The source of funds for this charge, when reported by the provider. Null when unavailable or unknown. */
  subPaymentMethod: SubPaymentMethod | null;
  status: TransactionStatus;
  customerEmail: string | null;
  customerName: string | null;
  paidAt: string | null;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  availableAt: string | null;
  object: "transaction";
  livemode: boolean;
}

export interface TransactionListItem {
  /** Charge context captured for new payments. Null for historical payments with no captured context. */
  paymentContext: {
    /** The original reason for the charge. Recovery never replaces this reason. */
    reason:
      | "first_subscription_payment"
      | "trial_conversion"
      | "recurring_billing"
      | "plan_change"
      | "reactivation"
      | "subscription_resume"
      | "one_time_payment"
      | "overage"
      | "adjustment"
      | "addon_activation"
      | "prepayment";
    /** The public payment link ID, independently of the reason, or null when no payment link originated the charge. */
    paymentLinkId: string | null;
    recovery:
      | {
          type: "payment_recovery";
        }
      | {
          type: "dunning_retry";
          /** Current retry, starting at 1. The original decline is not a retry. */
          attempt: number;
          /** Total retries applicable to this charge's dunning schedule. */
          maxAttempts: number;
        }
      | null;
  } | null;
  id: string;
  invoiceId: string | null;
  /** Gross amount in USD cents. Null when the provider has not reported an honest USD figure; see presentmentAmount. */
  grossAmount: number | null;
  /** Subtotal in USD cents (gross minus tax). Null when grossAmount is null. */
  subtotal: number | null;
  taxAmount: number | null;
  /** Amount in the charge currency's smallest unit, as presented to the customer. Set for non-USD charges; null when the charge was made in USD. */
  presentmentAmount: number | null;
  /** Cumulative confirmed refunds in the payment currency’s smallest unit. */
  amountRefunded: number;
  currency: string;
  /** The payment provider the charge was routed to: stripe, commet, or dlocal. */
  provider: PaymentProvider;
  /** The method used for this charge: card, oxxo, or mercado_pago. Null when unknown. */
  paymentMethod: PaymentMethod | null;
  /** The source of funds for this charge, when reported by the provider. Null when unavailable or unknown. */
  subPaymentMethod: SubPaymentMethod | null;
  status: TransactionStatus;
  customerEmail: string | null;
  customerName: string | null;
  paidAt: string | null;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  object: "transaction";
  livemode: boolean;
}

export interface TransactionRetry {
  originalTransactionId: string;
  invoiceId: string;
  status: "processing" | "succeeded";
  object: "transaction_retry";
  livemode: boolean;
}

export interface UsageAdjustment {
  id: string;
  value: number;
  previousValue: number;
  adjustment: number;
  customerId: string;
  reason: string | null;
  /** @format date-time */
  ts: string;
  /** @format date-time */
  createdAt: string;
  featureCode: string;
  object: "usage_adjustment";
  livemode: boolean;
}

export type UsageCheck =
  | {
      allowed: boolean;
      subscriptionStatus: string;
      featureCode: string;
      quantity: number;
      reason?: string;
      message?: string;
      consumptionModel: "metered";
      current: number;
      remaining: number;
      unlimited: boolean;
      included: number;
      overageEnabled: boolean;
      overageUnitPrice: number | null;
      object: "usage_check";
      livemode: boolean;
    }
  | {
      allowed: boolean;
      subscriptionStatus: string;
      featureCode: string;
      quantity: number;
      reason?: string;
      message?: string;
      consumptionModel: "credits";
      creditsPerUnit: number;
      estimatedCredits: number;
      planCredits: number;
      purchasedCredits: number;
      totalCredits: number;
      planCreditLimit: {
        /** The most plan credits the subscription spends per window. */
        credits: number;
        /** The window length: 24 hours for `day`, 7 days for `week`. */
        interval: "day" | "week";
        /** Plan credits spent in the current window. */
        spent: number;
        /** Plan credits the subscription can still spend in the current window. Purchased credits are not limited. */
        remaining: number;
        /**
         * When the next window starts and spending resets.
         * @format date-time
         */
        resetsAt: string;
      } | null;
      /** Whether usage stops when plan and purchased credits run out. False only when the plan allows overage, which is billed at its price per credit; trials and free plans always stop. */
      blockOnExhaustion: boolean;
      object: "usage_check";
      livemode: boolean;
    }
  | {
      allowed: boolean;
      subscriptionStatus: string;
      featureCode: string;
      quantity: number;
      reason?: string;
      message?: string;
      consumptionModel: "balance";
      unitPrice: number;
      estimatedAmount: number;
      /** The available balance, plan plus purchased, in rate scale (10000 = 1.00 of the subscription currency). Equal to totalBalance. */
      currentBalance: number;
      /** The plan part of the balance in rate scale. Consumed first, replaced or rolled over at each reset, and negative while overage is owed. */
      planBalance: number;
      /** The purchased part of the balance in rate scale: top-ups and adjustments. Consumed after the plan part and kept until the subscription ends. */
      purchasedBalance: number;
      /** planBalance plus purchasedBalance, in rate scale. */
      totalBalance: number;
      planBalanceLimit: {
        /** The most plan balance the subscription spends per window, in rate scale (10000 = 1.00 of the subscription currency). */
        amount: number;
        /** The window length: 24 hours for `day`, 7 days for `week`. */
        interval: "day" | "week";
        /** Plan balance spent in the current window, in rate scale. */
        spent: number;
        /** Plan balance the subscription can still spend in the current window, in rate scale. Purchased balance is not limited. */
        remaining: number;
        /**
         * When the next window starts and spending resets.
         * @format date-time
         */
        resetsAt: string;
      } | null;
      blockOnExhaustion: boolean;
      currency: string;
      object: "usage_check";
      livemode: boolean;
    };

export interface UsageEvent {
  id: string;
  featureCode: string;
  value: number;
  customerId: string;
  eventId: string | null;
  /** @format date-time */
  ts: string;
  /** @format date-time */
  createdAt: string;
  properties: Array<{
    property: string;
    value: string;
  }>;
  consumption?: {
    model: "credits" | "balance";
    deducted: number;
    remaining: number;
    blocked: boolean;
    /** Credits consumption only, omitted for balance. The plan credit limit after this event; null when the plan has no limit. */
    planCreditLimit?: {
      /** The most plan credits the subscription spends per window. */
      credits: number;
      /** The window length: 24 hours for `day`, 7 days for `week`. */
      interval: "day" | "week";
      /** Plan credits spent in the current window. */
      spent: number;
      /** Plan credits the subscription can still spend in the current window. Purchased credits are not limited. */
      remaining: number;
      /**
       * When the next window starts and spending resets.
       * @format date-time
       */
      resetsAt: string;
    } | null;
    /** Balance consumption on a plan with a plan balance limit: the limit after this event. Omitted for credits and for plans without a limit. */
    planBalanceLimit?: {
      /** The most plan balance the subscription spends per window, in rate scale (10000 = 1.00 of the subscription currency). */
      amount: number;
      /** The window length: 24 hours for `day`, 7 days for `week`. */
      interval: "day" | "week";
      /** Plan balance spent in the current window, in rate scale. */
      spent: number;
      /** Plan balance the subscription can still spend in the current window, in rate scale. Purchased balance is not limited. */
      remaining: number;
      /**
       * When the next window starts and spending resets.
       * @format date-time
       */
      resetsAt: string;
    } | null;
  };
  object: "usage_event";
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
  object: "usage_quota_event";
  livemode: boolean;
}

export interface Webhook {
  id: string;
  url: string;
  events: Array<string>;
  description: string | null;
  isActive: boolean;
  apiVersion: string | null;
  /** @format date-time */
  createdAt: string;
  object: "webhook";
  livemode: boolean;
}

export interface WebhookAddonRef {
  id: string;
  name: string;
}

export interface WebhookBalance {
  /** The available balance, plan plus purchased, in rate scale. Equal to totalBalance. */
  currentBalance: number;
  /** The plan part in rate scale: spent first, replaced or rolled over at each reset, negative while overage is owed. */
  planBalance: number;
  /** The purchased part in rate scale: top-ups and manual adjustments, spent after the plan part and kept until the subscription ends. */
  purchasedBalance: number;
  /** planBalance plus purchasedBalance, in rate scale. */
  totalBalance: number;
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

export interface WebhookPlanGrantTimelineEvent {
  /** The public ID of this plan grant event. */
  id: string;
  /** The durable lifecycle transition recorded by this event. */
  type: "created" | "updated" | "expired" | "revoked";
  /** The reason recorded for this transition. */
  reason: string;
  /** Where this transition originated. */
  source: "dashboard" | "api" | "system";
  /** The prior expiration deadline for an update, otherwise null. */
  previousExpiresAt: string | null;
  /** The expiration deadline after this transition, if any. */
  expiresAt: string | null;
  /** The duration selected by a create or update event. */
  duration: "cycles" | "until_date" | "until_revoked" | null;
  /** The selected cycle count when duration is cycles. */
  durationCycles: number | null;
  /** The requested deadline when duration is until_date. */
  requestedExpiresAt: string | null;
  /**
   * When this transition occurred.
   * @format date-time
   */
  createdAt: string;
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

export interface WebhookTest {
  success: boolean;
  deliveryId: string;
  /** @format date-time */
  deliveredAt: string;
  object: "webhook_delivery";
  livemode: boolean;
}
