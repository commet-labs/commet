import type {
  BillingInterval,
  ConsumptionModel,
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
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  offerApplications: Array<SubscriptionOfferApplication>;
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
        type: "free_trial";
        durationDays: number;
      }
    | {
        type: "percentage";
        durationCycles: number | null;
        /** Discount in basis points. 5000 means 50%. */
        percentage: number;
      }
    | {
        type: "amount_off";
        durationCycles: number | null;
        amounts: Array<{
          currency: string;
          /** Amount in the currency's minor unit (for example, cents for USD). */
          amount: number;
        }>;
      }
    | {
        type: "fixed_price";
        durationCycles: number | null;
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
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  object: "offer";
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

export type PayoutVerification =
  | {
      providerAccountId: string;
      status: "pending_verification" | "verified" | "restricted" | "disabled";
      transfersEnabled: boolean;
      outcome: "existing";
      object: "payout_account";
      livemode: boolean;
    }
  | {
      providerAccountId: string;
      status: "pending_verification" | "verified" | "restricted" | "disabled";
      transfersEnabled: boolean;
      outcome: "created";
      businessType: "individual" | "company";
      country: string;
      object: "payout_account";
      livemode: boolean;
    };

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
              startsAt: string | null;
              endsAt: string | null;
              /** Discount in basis points. 5000 means 50%. */
              percentage: number;
            }
          | {
              type: "amount_off";
              durationCycles: number | null;
              startsAt: string | null;
              endsAt: string | null;
              /** Discount in the application currency's minor unit. */
              amount: number;
            }
          | {
              type: "fixed_price";
              durationCycles: number | null;
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
              startsAt: string | null;
              endsAt: string | null;
              /** Discount in basis points. 5000 means 50%. */
              percentage: number;
            }
          | {
              type: "amount_off";
              durationCycles: number | null;
              startsAt: string | null;
              endsAt: string | null;
              /** Discount in the application currency's minor unit. */
              amount: number;
            }
          | {
              type: "fixed_price";
              durationCycles: number | null;
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

export interface PlanPrice {
  /** Public plan price ID. */
  id: string;
  planId: string;
  billingInterval: BillingInterval;
  /** Price in the currency's minor unit (for example, cents for USD). */
  price: number;
  isDefault: boolean;
  trialDays: number;
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
          startsAt: string | null;
          endsAt: string | null;
          /** Discount in basis points. 5000 means 50%. */
          percentage: number;
        }
      | {
          type: "amount_off";
          durationCycles: number | null;
          startsAt: string | null;
          endsAt: string | null;
          /** Discount in the application currency's minor unit. */
          amount: number;
        }
      | {
          type: "fixed_price";
          durationCycles: number | null;
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
          startsAt: string | null;
          endsAt: string | null;
          /** Discount in basis points. 5000 means 50%. */
          percentage: number;
        }
      | {
          type: "amount_off";
          durationCycles: number | null;
          startsAt: string | null;
          endsAt: string | null;
          /** Discount in the application currency's minor unit. */
          amount: number;
        }
      | {
          type: "fixed_price";
          durationCycles: number | null;
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
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  offerApplications: Array<SubscriptionOfferApplication>;
  consumptionModel: ConsumptionModel | null;
  features: Array<
    | {
        code: string;
        name: string;
        type: "boolean";
        enabled: boolean;
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
        };
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
        };
      }
    | {
        code: string;
        name: string;
        type: "quota";
      }
  >;
  credits: {
    remaining: number;
    included: number;
    purchased: number;
  } | null;
  balance: {
    remaining: number;
    included: number;
    currency: string;
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
  source: "direct" | "introductory" | "promo_code" | "custom";
  status: "quoted" | "applied" | "failed" | "expired";
  currency: string | null;
  subtotal: number | null;
  discountAmount: number | null;
  total: number | null;
  phases: Array<SubscriptionOfferApplicationPhase>;
  /** @format date-time */
  quotedAt: string;
  appliedAt: string | null;
}

export type SubscriptionOfferApplicationPhase =
  | {
      type: "free_trial";
      durationDays: number;
      startsAt: string | null;
      endsAt: string | null;
    }
  | {
      type: "percentage";
      durationCycles: number | null;
      percentage: number;
      startsAt: string | null;
      endsAt: string | null;
    }
  | {
      type: "amount_off";
      durationCycles: number | null;
      amount: number;
      startsAt: string | null;
      endsAt: string | null;
    }
  | {
      type: "fixed_price";
      durationCycles: number | null;
      price: number;
      startsAt: string | null;
      endsAt: string | null;
    };

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
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  offerApplications: Array<SubscriptionOfferApplication>;
  priceId: string | null;
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
  object: "test_clock_run";
  livemode: boolean;
}

export interface Transaction {
  id: string;
  invoiceId: string | null;
  /** Gross amount in USD cents. Null when the provider has not reported an honest USD figure; see presentmentAmount. */
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
  availableAt: string | null;
  object: "transaction";
  livemode: boolean;
}

export interface TransactionListItem {
  id: string;
  invoiceId: string | null;
  /** Gross amount in USD cents. Null when the provider has not reported an honest USD figure; see presentmentAmount. */
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
      currentBalance: number;
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
