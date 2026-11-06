import type { RequestOptions } from "../types/common";
import type {
  DeletedObject,
  DeletedPlanRegionalPricing,
  KeptOnVersion,
  Plan,
  PlanDraft,
  PlanDraftPublication,
  PlanExperiment,
  PlanExperimentArchive,
  PlanFeature,
  PlanMove,
  PlanPrice,
  PlanRegionalPricing,
  PlanRegionalPricingResult,
  PlanVersion,
  PlanVersionComparison,
  RemovedPlanFeature,
  SubscriberNeedingAChange,
} from "../types/models";
import type { CommetHTTPClient } from "../utils/http";

export type PublishPlanDraftParams =
  | {
      id: string;
      draftId: string;
      /** current sells the draft to every new buyer. */
      publishAs: "current";
      /** What happens to subscribers of earlier versions: keep them, move them at their next renewal, or move them now (features and balance change today, the price at renewal). Nobody moves unless every one of them fits or has a change below. */
      move?: "keep" | "period_end" | "now";
      /** Per-subscriber changes that make each one fit, applied at its renewal. */
      changes?: Array<{
        subscriptionId: string;
        /** Leave this subscriber on its version. */
        keepOnVersion?: true;
        billingInterval?:
          | "weekly"
          | "monthly"
          | "quarterly"
          | "semiannual"
          | "yearly";
        /** Lower its seats to the version's limit at renewal. */
        seatLimit?: true;
        /** Add-ons it stops paying at renewal. */
        removeAddonIds?: Array<string>;
      }>;
      /** Check everything without publishing. */
      preview?: boolean;
    }
  | {
      id: string;
      draftId: string;
      /** experiment starts an experiment with experimentCode, sold with planCode plan:code. Starting an experiment moves nobody, so it takes no move or changes. */
      publishAs: "experiment";
      /** The experiment's own code, after the plan's code. */
      experimentCode: string;
      /** Check everything without publishing. */
      preview?: boolean;
    }
  | {
      id: string;
      draftId: string;
      /** experiment_version publishes the next version of the experiment the draft started from. */
      publishAs: "experiment_version";
      /** What happens to subscribers of earlier versions: keep them, move them at their next renewal, or move them now (features and balance change today, the price at renewal). Nobody moves unless every one of them fits or has a change below. */
      move?: "keep" | "period_end" | "now";
      /** Per-subscriber changes that make each one fit, applied at its renewal. */
      changes?: Array<{
        subscriptionId: string;
        /** Leave this subscriber on its version. */
        keepOnVersion?: true;
        billingInterval?:
          | "weekly"
          | "monthly"
          | "quarterly"
          | "semiannual"
          | "yearly";
        /** Lower its seats to the version's limit at renewal. */
        seatLimit?: true;
        /** Add-ons it stops paying at renewal. */
        removeAddonIds?: Array<string>;
      }>;
      /** Check everything without publishing. */
      preview?: boolean;
    };

export interface GetPlanDraftParams {
  id: string;
  draftId: string;
}

export interface UpdatePlanDraftParams {
  id: string;
  draftId: string;
  /** Every interval the draft sells. An interval the draft sold and this list leaves out is removed from the draft. */
  prices?: Array<{
    billingInterval:
      | "weekly"
      | "monthly"
      | "quarterly"
      | "semiannual"
      | "yearly"
      | "one_time";
    /** USD price in cents. */
    price: number;
    includedCredits?: number | null;
    includedBalance?: number | null;
    /** Days of trial on this price. Null removes the trial. */
    trialDays?: number | null;
    trialRequiresPaymentMethod?: boolean;
    /** Show this interval first at checkout and in pricing tables. */
    isDefault?: boolean;
  }>;
  /** Every country with its own currency or prices. A country the draft sold and this list leaves out is removed. A country missing a price blocks publishing. */
  countries?: Array<{
    /** ISO country code. */
    country: string;
    /** The currency the country pays in, USD included. */
    currency: string;
    /** Local units per USD for prices that follow the USD base. USD defaults to 1. */
    exchangeRate?: number | null;
    prices: Array<
      | {
          billingInterval:
            | "weekly"
            | "monthly"
            | "quarterly"
            | "semiannual"
            | "yearly"
            | "one_time";
          /** The price set by hand, in the currency's minor unit. */
          price: number;
          /** The balance included each period in this country, in the currency's minor unit. Required when the plan's price includes a balance. */
          includedBalance?: number;
        }
      | {
          billingInterval:
            | "weekly"
            | "monthly"
            | "quarterly"
            | "semiannual"
            | "yearly"
            | "one_time";
          /** Follow the USD base at the exchange rate. */
          followBase: true;
        }
    >;
    /** Smallest balance top-up in this country, in the currency's minor unit. Null follows the USD minimum at the exchange rate; left out keeps it. */
    topUpMinimum?: number | null;
    /** Most unused plan balance that rolls over in this country. Null follows the USD cap at the exchange rate; left out keeps it. */
    maxPlanBalance?: number | null;
    /** Most plan balance spent per limit interval in this country. Null follows the USD limit at the exchange rate; left out keeps it. */
    planBalanceLimit?: number | null;
    /** What the country pays for each add-on the draft sells. Left out keeps the country's add-on prices; sent, it replaces them, and add-ons not listed follow the USD price. */
    addonPrices?: Array<
      | {
          addonId: string;
          /** The add-on's price set by hand, in the currency's minor unit. */
          price: number;
        }
      | {
          addonId: string;
          /** Follow the add-on's USD price at the exchange rate. */
          followBase: true;
        }
    >;
    /** What the country pays for each credit pack the draft sells. Left out keeps the country's pack prices; sent, it replaces them, and packs not listed follow the USD price. */
    creditPackPrices?: Array<
      | {
          creditPackId: string;
          /** The pack's price set by hand, in the currency's minor unit. */
          price: number;
        }
      | {
          creditPackId: string;
          /** Follow the pack's USD price at the exchange rate. */
          followBase: true;
        }
    >;
  }>;
  /** Credit or balance rules; fields left out stay as they are. */
  rules?: {
    /** Credits a free plan includes each month. */
    freeIncludedCredits?: number | null;
    /** Balance a free plan includes each month, in cents. */
    freeIncludedBalance?: number | null;
    unusedPlanCredits?: "expire" | "roll_over";
    maxPlanCredits?: number | null;
    planCreditLimit?: number | null;
    planCreditLimitInterval?: "day" | "week" | null;
    unusedPlanBalance?: "expire" | "roll_over";
    maxPlanBalance?: number | null;
    planBalanceLimit?: number | null;
    planBalanceLimitInterval?: "day" | "week" | null;
    blockOnExhaustion?: boolean;
    purchasesEnabled?: boolean;
    creditPurchaseUnitPrice?: number | null;
    creditPurchaseMinimum?: number | null;
    topUpMinimum?: number | null;
  };
  /** Change keys to put back as the version the draft started from had them. */
  undo?: Array<string>;
}

export interface DeletePlanDraftParams {
  id: string;
  draftId: string;
}

export interface ListPlanDraftsParams {
  id: string;
}

export interface CreatePlanDraftParams {
  id: string;
  /** The version to start from: the current version, an experiment's version or an older version. Defaults to the current version. */
  fromVersionId?: string;
}

export interface ArchivePlanExperimentParams {
  id: string;
  code: string;
  /** What happens to the experiment's subscribers: keep them on its versions, move them to the plan's current version at their next renewal, or move them now. Nobody moves, and the experiment keeps running, unless every one of them fits or has a change. */
  subscribers?: "keep" | "period_end" | "now";
  /** Per-subscriber changes that make each one fit, applied at its renewal. */
  changes?: Array<{
    subscriptionId: string;
    /** Leave this subscriber on its version. */
    keepOnVersion?: true;
    billingInterval?:
      | "weekly"
      | "monthly"
      | "quarterly"
      | "semiannual"
      | "yearly";
    /** Lower its seats to the version's limit at renewal. */
    seatLimit?: true;
    /** Add-ons it stops paying at renewal. */
    removeAddonIds?: Array<string>;
  }>;
  /** Check the archive and the move without changing anything. */
  preview?: boolean;
}

export interface MakePlanExperimentCurrentParams {
  id: string;
  code: string;
}

export interface GetPlanExperimentParams {
  id: string;
  code: string;
}

export interface CreatePlanExperimentVersionParams {
  id: string;
  code: string;
  prices?: Array<{
    /** An interval the plan already sells. Prices not listed are copied unchanged from the current version. */
    billingInterval:
      | "weekly"
      | "monthly"
      | "quarterly"
      | "semiannual"
      | "yearly"
      | "one_time";
    /** USD price in the currency's minor unit (cents). */
    price: number;
    includedCredits?: number | null;
    includedBalance?: number | null;
    /** Per-currency amounts. A currency the current version does not sell also needs its exchangeRate in currencies; its amounts not listed here are derived from the USD price. */
    regionalPrices?: Array<{
      currency: string;
      price: number;
      includedBalance?: number | null;
    }>;
  }>;
  /** Currencies the current version does not sell, with the exchange rate (local units per USD) used for the amounts not listed, credit purchases, add-ons and overage. */
  currencies?: Array<{
    currency: string;
    exchangeRate: number;
  }>;
  /** Credits plans that roll over unused credits: the most plan credits a subscription can hold. Null removes the cap. */
  maxPlanCredits?: number | null;
  /** Balance plans that roll over unused balance: the most plan balance a subscription can hold, in USD cents. Other currencies convert it with the plan's exchange rate unless the dashboard sets a custom amount for that currency. Null removes the cap. */
  maxPlanBalance?: number | null;
}

export interface ListPlanExperimentsParams {
  id: string;
}

export interface CreatePlanExperimentParams {
  id: string;
  prices?: Array<{
    /** An interval the plan already sells. Prices not listed are copied unchanged from the current version. */
    billingInterval:
      | "weekly"
      | "monthly"
      | "quarterly"
      | "semiannual"
      | "yearly"
      | "one_time";
    /** USD price in the currency's minor unit (cents). */
    price: number;
    includedCredits?: number | null;
    includedBalance?: number | null;
    /** Per-currency amounts. A currency the current version does not sell also needs its exchangeRate in currencies; its amounts not listed here are derived from the USD price. */
    regionalPrices?: Array<{
      currency: string;
      price: number;
      includedBalance?: number | null;
    }>;
  }>;
  /** Currencies the current version does not sell, with the exchange rate (local units per USD) used for the amounts not listed, credit purchases, add-ons and overage. */
  currencies?: Array<{
    currency: string;
    exchangeRate: number;
  }>;
  /** Credits plans that roll over unused credits: the most plan credits a subscription can hold. Null removes the cap. */
  maxPlanCredits?: number | null;
  /** Balance plans that roll over unused balance: the most plan balance a subscription can hold, in USD cents. Other currencies convert it with the plan's exchange rate unless the dashboard sets a custom amount for that currency. Null removes the cap. */
  maxPlanBalance?: number | null;
  /** The experiment's own code: lowercase letters, numbers, hyphens and underscores. It is sold as planCode `<plan code>:<code>` and is never reused in the plan. */
  code: string;
}

export interface UpdatePlanFeatureParams {
  id: string;
  featureId: string;
  enabled?: boolean;
  includedAmount?: number;
  unlimited?: boolean;
  overage?: {
    enabled?: boolean;
    unitPrice?: number;
  };
  creditsPerUnit?: number | null;
}

export interface RemovePlanFeatureParams {
  id: string;
  featureId: string;
}

export interface AddPlanFeatureParams {
  id: string;
  featureId: string;
  enabled?: boolean;
  includedAmount?: number;
  unlimited?: boolean;
  overage?: {
    enabled?: boolean;
    unitPrice?: number;
  };
  creditsPerUnit?: number | null;
  pricingMode?: "fixed" | "ai_model";
  margin?: number | null;
}

export interface CancelPlanMoveParams {
  id: string;
  moveId: string;
}

export interface GetPlanMoveParams {
  id: string;
  moveId: string;
}

export interface CancelPlanMoveSubscriptionParams {
  id: string;
  moveId: string;
  subscriptionId: string;
}

export interface ListPlanMovesParams {
  id: string;
}

export type CreatePlanMoveParams =
  | {
      id: string;
      /** Public IDs of the subscriptions to move. */
      subscriptionIds: Array<string>;
      /** The version subscribers move to. */
      toVersionId: string;
      /** now changes features and the included amount today and the price at renewal; period_end moves each subscriber at its next renewal. */
      effective: "now" | "period_end";
      /** Per-subscriber changes that make each one fit, applied at its renewal. */
      changes?: Array<{
        subscriptionId: string;
        /** Leave this subscriber on its version. */
        keepOnVersion?: true;
        billingInterval?:
          | "weekly"
          | "monthly"
          | "quarterly"
          | "semiannual"
          | "yearly";
        /** Lower its seats to the version's limit at renewal. */
        seatLimit?: true;
        /** Add-ons it stops paying at renewal. */
        removeAddonIds?: Array<string>;
      }>;
      /** Check every subscriber without moving anyone. */
      preview?: boolean;
    }
  | {
      id: string;
      /** Move every active, trialing and past due subscription on this version of the plan. */
      fromVersionId: string;
      /** The version subscribers move to. */
      toVersionId: string;
      /** now changes features and the included amount today and the price at renewal; period_end moves each subscriber at its next renewal. */
      effective: "now" | "period_end";
      /** Per-subscriber changes that make each one fit, applied at its renewal. */
      changes?: Array<{
        subscriptionId: string;
        /** Leave this subscriber on its version. */
        keepOnVersion?: true;
        billingInterval?:
          | "weekly"
          | "monthly"
          | "quarterly"
          | "semiannual"
          | "yearly";
        /** Lower its seats to the version's limit at renewal. */
        seatLimit?: true;
        /** Add-ons it stops paying at renewal. */
        removeAddonIds?: Array<string>;
      }>;
      /** Check every subscriber without moving anyone. */
      preview?: boolean;
    };

export interface KeepPlanSubscriberOnVersionParams {
  id: string;
  subscriptionId: string;
}

export interface ListPlanSubscribersNeedingAChangeParams {
  id: string;
}

export interface SetDefaultPlanPriceParams {
  id: string;
  priceId: string;
}

export interface UpsertRegionalPricesParams {
  id: string;
  priceId: string;
  overrides: Array<{
    currency: string;
    price: number;
    includedBalance?: number;
  }>;
}

export interface DeleteRegionalPricesParams {
  id: string;
  priceId: string;
}

export interface UpdatePlanPriceParams {
  id: string;
  priceId: string;
  price?: number;
  isDefault?: boolean;
  trialDays?: number;
  /** Set to false so the price's free trial starts without a payment method. Requires trialDays on the price. */
  trialRequiresPaymentMethod?: boolean;
  includedBalance?: number | null;
  includedCredits?: number | null;
  /** Metadata keys to merge into the existing price metadata. */
  metadata?: Record<string, unknown>;
  marketPrices?: Array<{
    marketGroupId: string;
    currency:
      | "usd"
      | "ars"
      | "brl"
      | "clp"
      | "cop"
      | "pen"
      | "uyu"
      | "pyg"
      | "bob"
      | "mxn"
      | "cad"
      | "eur"
      | "gbp"
      | "jpy"
      | "cny"
      | "krw"
      | "hkd"
      | "sgd"
      | "twd"
      | "inr"
      | "thb";
    price: number;
  }>;
}

export interface DeletePlanPriceParams {
  id: string;
  priceId: string;
}

export type AddPlanPriceParams =
  | {
      id: string;
      billingInterval:
        | "weekly"
        | "monthly"
        | "quarterly"
        | "semiannual"
        | "yearly"
        | "one_time";
      metadata?: Record<string, unknown>;
      price: number;
      trialDays?: number;
      /** Set to false so the price's free trial starts without a payment method. Requires trialDays on the price. */
      trialRequiresPaymentMethod?: boolean;
      isDefault?: boolean;
      includedBalance?: number | null;
      includedCredits?: number | null;
      marketPrices?: Array<{
        /** Public ID of a reusable pricing market group. */
        marketGroupId: string;
        /** Presentment currency configured for this plan and market. */
        currency:
          | "usd"
          | "ars"
          | "brl"
          | "clp"
          | "cop"
          | "pen"
          | "uyu"
          | "pyg"
          | "bob"
          | "mxn"
          | "cad"
          | "eur"
          | "gbp"
          | "jpy"
          | "cny"
          | "krw"
          | "hkd"
          | "sgd"
          | "twd"
          | "inr"
          | "thb";
        /** Market price in the currency's minor unit. */
        price: number;
      }>;
    }
  | {
      id: string;
      billingInterval:
        | "weekly"
        | "monthly"
        | "quarterly"
        | "semiannual"
        | "yearly"
        | "one_time";
      metadata?: Record<string, unknown>;
      inheritsFromPriceId: string;
      marketPrices: Array<{
        /** Public ID of a reusable pricing market group. */
        marketGroupId: string;
        /** Presentment currency configured for this plan and market. */
        currency:
          | "usd"
          | "ars"
          | "brl"
          | "clp"
          | "cop"
          | "pen"
          | "uyu"
          | "pyg"
          | "bob"
          | "mxn"
          | "cad"
          | "eur"
          | "gbp"
          | "jpy"
          | "cny"
          | "krw"
          | "hkd"
          | "sgd"
          | "twd"
          | "inr"
          | "thb";
        /** Market price in the currency's minor unit. */
        price: number;
      }>;
    };

export interface SetPlanRegionalPricingParams {
  id: string;
  currency:
    | "usd"
    | "ars"
    | "brl"
    | "clp"
    | "cop"
    | "pen"
    | "uyu"
    | "pyg"
    | "bob"
    | "mxn"
    | "cad"
    | "eur"
    | "gbp"
    | "jpy"
    | "cny"
    | "krw"
    | "hkd"
    | "sgd"
    | "twd"
    | "inr"
    | "thb";
  exchangeRate: number;
  prices?: Array<{
    priceId: string;
    price: number;
    includedBalance?: number;
  }>;
  features?: Array<{
    featureId: string;
    overageUnitPrice: number;
  }>;
}

export interface GetPlanParams {
  id: string;
}

export interface UpdatePlanParams {
  id: string;
  name?: string;
  description?: string | null;
  metadata?: Record<string, unknown>;
  isPublic?: boolean;
  /** Credits plans only. What happens to unused plan credits at each reset. Changing it publishes a new version of the plan; each subscription stays on its version until moved. */
  unusedPlanCredits?:
    | {
        type: "expire";
      }
    | {
        type: "roll_over";
        /** The most plan credits a subscription holds after a reset, including the credits that reset grants; credits above it expire. At least the included credits of every price. null means no limit other than the largest storable balance, 2,147,483,647 plan credits. */
        maxPlanCredits: number | null;
      };
  /** Credits plans only. The most plan credits a subscription spends per day or per week; null removes the limit. Changing it publishes a new version of the plan; each subscription stays on its version until moved. */
  planCreditLimit?: {
    /** The most plan credits a subscription spends in one window. */
    credits: number;
    /** The window length: `day` is 24 hours and `week` is 7 days, starting at the time of day of the subscription's billing anchor. */
    interval: "day" | "week";
  } | null;
  /** Balance plans only. What happens to unused plan balance at each reset. Changing it publishes a new version of the plan; each subscription stays on its version until moved. */
  unusedPlanBalance?:
    | {
        type: "expire";
      }
    | {
        type: "roll_over";
        /** The most plan balance a subscription holds after a reset, in USD cents, including the balance that reset grants; balance above it expires. At least the included balance of every price. Other currencies convert it with the plan's exchange rate unless the dashboard sets a custom amount for that currency. null means no limit other than the largest storable amount, 2,147,483,647 cents. */
        maxPlanBalance: number | null;
      };
  /** Balance plans only. The most plan balance a subscription spends per day or per week, in USD cents; null removes the limit. Changing it publishes a new version of the plan; each subscription stays on its version until moved. */
  planBalanceLimit?: {
    /** The most plan balance a subscription spends in one window, in USD cents. Other currencies convert it with the plan's exchange rate unless the dashboard sets a custom amount for that currency. */
    amount: number;
    /** The window length: `day` is 24 hours and `week` is 7 days, starting at the time of day of the subscription's billing anchor. */
    interval: "day" | "week";
  } | null;
  /** Credits and balance plans only. false lets usage continue past the plan and purchased amounts and bills the missing amount as overage at the next renewal; a credits plan bills it at the price per credit and needs one. Trials and free plans always stop, so free plans accept only true. Changing it publishes a new version of the plan; each subscription stays on its version until moved. */
  blockOnExhaustion?: boolean;
  /** Make this plan the default plan of its plan group: customers created with that planGroupId start on it, and a paid plan of the group that ends from the customer portal, a revoked payment authorization or exhausted dunning moves to it instead of canceling. Requires a free plan in a plan group; replaces the group's previous default plan. false unmarks it. */
  isDefault?: boolean;
}

export interface DeletePlanParams {
  id: string;
}

export interface ComparePlanVersionsParams {
  id: string;
  versionId: string;
  against: string;
}

export interface GetPlanVersionParams {
  id: string;
  versionId: string;
}

export interface ListPlanVersionsParams {
  id: string;
  cursor?: string;
  limit?: number;
}

export interface CreatePlanVersionParams {
  id: string;
  prices?: Array<{
    /** An interval the plan already sells. Prices not listed are copied unchanged from the current version. */
    billingInterval:
      | "weekly"
      | "monthly"
      | "quarterly"
      | "semiannual"
      | "yearly"
      | "one_time";
    /** USD price in the currency's minor unit (cents). */
    price: number;
    includedCredits?: number | null;
    includedBalance?: number | null;
    /** Per-currency amounts. A currency the current version does not sell also needs its exchangeRate in currencies; its amounts not listed here are derived from the USD price. */
    regionalPrices?: Array<{
      currency: string;
      price: number;
      includedBalance?: number | null;
    }>;
  }>;
  /** Currencies the current version does not sell, with the exchange rate (local units per USD) used for the amounts not listed, credit purchases, add-ons and overage. */
  currencies?: Array<{
    currency: string;
    exchangeRate: number;
  }>;
  /** Credits plans that roll over unused credits: the most plan credits a subscription can hold. Null removes the cap. */
  maxPlanCredits?: number | null;
  /** Balance plans that roll over unused balance: the most plan balance a subscription can hold, in USD cents. Other currencies convert it with the plan's exchange rate unless the dashboard sets a custom amount for that currency. Null removes the cap. */
  maxPlanBalance?: number | null;
}

export interface SetPlanVisibilityParams {
  id: string;
  isPublic: boolean;
}

export interface ListPlansParams {
  includePrivate?: boolean;
}

export interface CreatePlanParams {
  name: string;
  code: string;
  description?: string;
  consumptionModel?: "metered" | "credits" | "balance";
  isPublic?: boolean;
  isFree?: boolean;
  /** Credits and balance plans. Omitted, credits plans and free plans stop usage when the plan and purchased amounts run out, and paid balance plans bill the missing balance as overage. A new credits plan always stops usage: it allows overage only with a price per credit, which is set after creation, and then `PATCH /v1/plans/{id}` turns overage on. */
  blockOnExhaustion?: boolean;
  /** Credits plans only. What happens to unused plan credits at each reset; omitted means they expire. */
  unusedPlanCredits?:
    | {
        type: "expire";
      }
    | {
        type: "roll_over";
        /** The most plan credits a subscription holds after a reset, including the credits that reset grants; credits above it expire. At least the included credits of every price. null means no limit other than the largest storable balance, 2,147,483,647 plan credits. */
        maxPlanCredits: number | null;
      };
  /** Credits plans only. The most plan credits a subscription spends per day or per week; omitted or null means no limit. */
  planCreditLimit?: {
    /** The most plan credits a subscription spends in one window. */
    credits: number;
    /** The window length: `day` is 24 hours and `week` is 7 days, starting at the time of day of the subscription's billing anchor. */
    interval: "day" | "week";
  } | null;
  /** Balance plans only. What happens to unused plan balance at each reset; omitted means it expires. */
  unusedPlanBalance?:
    | {
        type: "expire";
      }
    | {
        type: "roll_over";
        /** The most plan balance a subscription holds after a reset, in USD cents, including the balance that reset grants; balance above it expires. At least the included balance of every price. Other currencies convert it with the plan's exchange rate unless the dashboard sets a custom amount for that currency. null means no limit other than the largest storable amount, 2,147,483,647 cents. */
        maxPlanBalance: number | null;
      };
  /** Balance plans only. The most plan balance a subscription spends per day or per week, in USD cents; omitted or null means no limit. */
  planBalanceLimit?: {
    /** The most plan balance a subscription spends in one window, in USD cents. Other currencies convert it with the plan's exchange rate unless the dashboard sets a custom amount for that currency. */
    amount: number;
    /** The window length: `day` is 24 hours and `week` is 7 days, starting at the time of day of the subscription's billing anchor. */
    interval: "day" | "week";
  } | null;
  planGroupId?: string;
  /** Make this plan the default plan of its plan group: customers created with that planGroupId start on it, and a paid plan of the group that ends from the customer portal, a revoked payment authorization or exhausted dunning moves to it instead of canceling. Requires a free plan with a planGroupId; replaces the group's previous default plan. */
  isDefault?: boolean;
  metadata?: Record<string, unknown>;
}

export class PlansResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /** Publish a draft as the plan's current version, as a new experiment with its own code, or as the next version of the experiment it started from. A country missing a price, or removing the signup trial of the plan's group from the current version, stops the publication. With move, subscribers of earlier versions move at their renewal or now; if any of them does not fit the new version, nothing is published and the response lists each one with what would make it fit, to send back in changes. Paused subscribers stay where they are. Send preview to check without publishing. */
  async publishDraft(
    params: PublishPlanDraftParams,
    options?: RequestOptions,
  ): Promise<PlanDraftPublication> {
    const { id, draftId, ...rest } = params;
    return this.httpClient.post(
      `/plans/${id}/drafts/${draftId}/publish`,
      rest,
      options,
    );
  }

  /** Retrieve a draft with the version it started from and what it changes. */
  async getDraft(
    params: GetPlanDraftParams,
    options?: RequestOptions,
  ): Promise<PlanDraft> {
    const { id, draftId } = params;
    return this.httpClient.get(
      `/plans/${id}/drafts/${draftId}`,
      undefined,
      options,
    );
  }

  /** Change a draft's prices per interval, trials, the interval shown first, countries with their currency and prices, and credit or balance rules, or undo single changes. Each block sent replaces that block; blocks left out stay as they are. Buyers and subscribers see nothing until the draft is published. */
  async updateDraft(
    params: UpdatePlanDraftParams,
    options?: RequestOptions,
  ): Promise<PlanDraft> {
    const { id, draftId, ...rest } = params;
    return this.httpClient.patch(
      `/plans/${id}/drafts/${draftId}`,
      rest,
      options,
    );
  }

  /** Discard a draft. Nothing it changed was ever sold. */
  async deleteDraft(
    params: DeletePlanDraftParams,
    options?: RequestOptions,
  ): Promise<DeletedObject> {
    const { id, draftId } = params;
    return this.httpClient.delete(
      `/plans/${id}/drafts/${draftId}`,
      undefined,
      options,
    );
  }

  /** List the plan's open drafts, oldest first, each with the version it started from and what it changes. Drafts sell nothing until published. */
  async listDrafts(
    params: ListPlanDraftsParams,
    options?: RequestOptions,
  ): Promise<{
    object: "list";
    data: Array<PlanDraft>;
    hasMore: boolean;
    nextCursor?: string;
  }> {
    const { id } = params;
    return this.httpClient.get(`/plans/${id}/drafts`, undefined, options);
  }

  /** Start a draft from a version of the plan: the current one, an experiment's version or an older one. A plan can have any number of drafts. Edit it, then publish it as the current version, as an experiment or as an experiment's next version; nothing changes for buyers or subscribers until then. */
  async createDraft(
    params: CreatePlanDraftParams,
    options?: RequestOptions,
  ): Promise<PlanDraft> {
    const { id, ...rest } = params;
    return this.httpClient.post(`/plans/${id}/drafts`, rest, options);
  }

  /** Stop selling the experiment. Its code sells the plan's current version from then on, so links already shared keep working. Choose what happens to its subscribers: keep them on its versions, or move them to the current version at their renewal or now. If any of them does not fit, nothing changes and the response lists each one with what would make it fit, to send back in changes. */
  async archiveExperiment(
    params: ArchivePlanExperimentParams,
    options?: RequestOptions,
  ): Promise<PlanExperimentArchive> {
    const { id, code, ...rest } = params;
    return this.httpClient.post(
      `/plans/${id}/experiments/${code}/archive`,
      rest,
      options,
    );
  }

  /** Make the experiment's latest version the plan's current version, with exactly its content and the next version number. New buyers get it; its subscribers are already on it. The experiment closes, and its code sells the plan's current version from then on. Nobody else moves. */
  async makeExperimentCurrent(
    params: MakePlanExperimentCurrentParams,
    options?: RequestOptions,
  ): Promise<PlanVersion> {
    const { id, code } = params;
    return this.httpClient.post(
      `/plans/${id}/experiments/${code}/make-current`,
      {},
      options,
    );
  }

  /** Get one experiment of a plan by its own code, with the version it sells and how many subscriptions are on it. */
  async getExperiment(
    params: GetPlanExperimentParams,
    options?: RequestOptions,
  ): Promise<PlanExperiment> {
    const { id, code } = params;
    return this.httpClient.get(
      `/plans/${id}/experiments/${code}`,
      undefined,
      options,
    );
  }

  /** Publish the experiment's next version from its latest version with the changes given. Its code sells the new version from now on; subscribers on its earlier versions stay where they are until moved. */
  async createExperimentVersion(
    params: CreatePlanExperimentVersionParams,
    options?: RequestOptions,
  ): Promise<PlanVersion> {
    const { id, code, ...rest } = params;
    return this.httpClient.post(
      `/plans/${id}/experiments/${code}/versions`,
      rest,
      options,
    );
  }

  /** List a plan's experiments, newest first, with the version each one sells and how many subscriptions are on them. */
  async listExperiments(
    params: ListPlanExperimentsParams,
    options?: RequestOptions,
  ): Promise<{
    object: "list";
    data: Array<PlanExperiment>;
    hasMore: boolean;
    nextCursor?: string;
  }> {
    const { id } = params;
    return this.httpClient.get(`/plans/${id}/experiments`, undefined, options);
  }

  /** Start an experiment from the plan's current version with the changes given. It is sold only through its code (planCode `<plan code>:<code>`); new buyers of the plan keep getting the current version. */
  async createExperiment(
    params: CreatePlanExperimentParams,
    options?: RequestOptions,
  ): Promise<PlanExperiment> {
    const { id, ...rest } = params;
    return this.httpClient.post(`/plans/${id}/experiments`, rest, options);
  }

  /** Update limits, overage, or enabled status of a feature on a plan. */
  async updateFeature(
    params: UpdatePlanFeatureParams,
    options?: RequestOptions,
  ): Promise<PlanFeature> {
    const { id, featureId, ...rest } = params;
    return this.httpClient.patch(
      `/plans/${id}/features/${featureId}`,
      rest,
      options,
    );
  }

  /** Detach a feature from a plan. */
  async removeFeature(
    params: RemovePlanFeatureParams,
    options?: RequestOptions,
  ): Promise<RemovedPlanFeature> {
    const { id, featureId } = params;
    return this.httpClient.delete(
      `/plans/${id}/features/${featureId}`,
      undefined,
      options,
    );
  }

  /** Attach a feature to a plan with limits, overage, and credits configuration. */
  async addFeature(
    params: AddPlanFeatureParams,
    options?: RequestOptions,
  ): Promise<PlanFeature> {
    const { id, ...rest } = params;
    return this.httpClient.post(`/plans/${id}/features`, rest, options);
  }

  /** Cancel a move for every subscriber who has not moved yet. They stay on their version; those already moved stay moved. */
  async cancelMove(
    params: CancelPlanMoveParams,
    options?: RequestOptions,
  ): Promise<PlanMove> {
    const { id, moveId } = params;
    return this.httpClient.post(
      `/plans/${id}/moves/${moveId}/cancel`,
      {},
      options,
    );
  }

  /** Read a move of subscribers between plan versions with each subscriber's status: moving, moved, needs a change, left out, canceled or kept on its version. */
  async getMove(
    params: GetPlanMoveParams,
    options?: RequestOptions,
  ): Promise<PlanMove> {
    const { id, moveId } = params;
    return this.httpClient.get(
      `/plans/${id}/moves/${moveId}`,
      undefined,
      options,
    );
  }

  /** Cancel a move for one subscriber who has not moved yet. It stays on its version; the rest of the move continues. */
  async cancelMoveSubscription(
    params: CancelPlanMoveSubscriptionParams,
    options?: RequestOptions,
  ): Promise<PlanMove> {
    const { id, moveId, subscriptionId } = params;
    return this.httpClient.post(
      `/plans/${id}/moves/${moveId}/subscriptions/${subscriptionId}/cancel`,
      {},
      options,
    );
  }

  /** List a plan's latest moves of subscribers between versions, newest first, with how many are moving, moved, need a change, were left out, canceled or kept on their version. */
  async listMoves(
    params: ListPlanMovesParams,
    options?: RequestOptions,
  ): Promise<{
    object: "list";
    data: Array<PlanMove>;
    hasMore: boolean;
    nextCursor?: string;
  }> {
    const { id } = params;
    return this.httpClient.get(`/plans/${id}/moves`, undefined, options);
  }

  /** Move a list of subscriptions, or every subscription of another version, to a newer version of the plan, at their next renewal or now. Nobody moves unless every one of them fits or has a change in changes; otherwise the response lists each one with what would make it fit. Only active, trialing and past due subscriptions move. Paused ones, and listed subscriptions in another status or already on the destination, are left out. Send preview to check without moving anyone. */
  async createMove(
    params: CreatePlanMoveParams,
    options?: RequestOptions,
  ): Promise<PlanMove> {
    const { id, ...rest } = params;
    return this.httpClient.post(`/plans/${id}/moves`, rest, options);
  }

  /** Leave a subscriber that needs a change on its version. It stops appearing among the subscribers that need a change; move it later like any other subscriber. */
  async keepSubscriberOnVersion(
    params: KeepPlanSubscriberOnVersionParams,
    options?: RequestOptions,
  ): Promise<KeptOnVersion> {
    const { id, subscriptionId } = params;
    return this.httpClient.post(
      `/plans/${id}/needs-a-change/${subscriptionId}/keep`,
      {},
      options,
    );
  }

  /** List the plan's subscribers whose move could not complete, with the version they stay on, the one they could not move to and why. Move them again with a change, or keep them on their version so they leave this list. */
  async listSubscribersNeedingAChange(
    params: ListPlanSubscribersNeedingAChangeParams,
    options?: RequestOptions,
  ): Promise<{
    object: "list";
    data: Array<SubscriberNeedingAChange>;
    hasMore: boolean;
    nextCursor?: string;
  }> {
    const { id } = params;
    return this.httpClient.get(
      `/plans/${id}/needs-a-change`,
      undefined,
      options,
    );
  }

  /** Set a specific price as the default and return the updated plan price. */
  async setDefaultPrice(
    params: SetDefaultPlanPriceParams,
    options?: RequestOptions,
  ): Promise<PlanPrice> {
    const { id, priceId } = params;
    return this.httpClient.put(
      `/plans/${id}/prices/${priceId}/default`,
      {},
      options,
    );
  }

  /** Create or update regional currency price overrides for a plan price. */
  async setRegionalPrices(
    params: UpsertRegionalPricesParams,
    options?: RequestOptions,
  ): Promise<PlanRegionalPricing> {
    const { id, priceId, ...rest } = params;
    return this.httpClient.put(
      `/plans/${id}/prices/${priceId}/regional`,
      rest,
      options,
    );
  }

  /** Remove all regional currency overrides for a plan price. The request is rejected while billable subscriptions depend on an override. */
  async deleteRegionalPrices(
    params: DeleteRegionalPricesParams,
    options?: RequestOptions,
  ): Promise<DeletedPlanRegionalPricing> {
    const { id, priceId } = params;
    return this.httpClient.delete(
      `/plans/${id}/prices/${priceId}/regional`,
      undefined,
      options,
    );
  }

  /** Update a base price or market price variant. Removing a base market override is rejected while a variant depends on it. Offer terms are managed through Offers. */
  async updatePrice(
    params: UpdatePlanPriceParams,
    options?: RequestOptions,
  ): Promise<PlanPrice> {
    const { id, priceId, ...rest } = params;
    return this.httpClient.patch(
      `/plans/${id}/prices/${priceId}`,
      rest,
      options,
    );
  }

  /** Archive a price for new subscriptions. This publishes a new version of the plan; existing subscriptions that selected the price keep paying it on their version until moved. */
  async deletePrice(
    params: DeletePlanPriceParams,
    options?: RequestOptions,
  ): Promise<DeletedObject> {
    const { id, priceId } = params;
    return this.httpClient.delete(
      `/plans/${id}/prices/${priceId}`,
      undefined,
      options,
    );
  }

  /** Add a base price or a selectable market price variant. Variants inherit their base price outside the markets they override. Configure introductory and promotional benefits through Offers. */
  async addPrice(
    params: AddPlanPriceParams,
    options?: RequestOptions,
  ): Promise<PlanPrice> {
    const { id, ...rest } = params;
    return this.httpClient.post(`/plans/${id}/prices`, rest, options);
  }

  /** Configure regional prices and feature overage values for one currency. Currency-specific offer terms are managed through Offers. */
  async setRegionalPricing(
    params: SetPlanRegionalPricingParams,
    options?: RequestOptions,
  ): Promise<PlanRegionalPricingResult> {
    const { id, ...rest } = params;
    return this.httpClient.put(`/plans/${id}/regional`, rest, options);
  }

  /** Get a plan with public price IDs and their automatic introductory offer IDs. */
  async get(params: GetPlanParams, options?: RequestOptions): Promise<Plan> {
    const { id } = params;
    return this.httpClient.get(`/plans/${id}`, undefined, options);
  }

  /** Update a plan's name, description, visibility, default status, metadata, overage behavior, what happens to its unused plan credits or plan balance, or its plan credit or plan balance limit. */
  async update(
    params: UpdatePlanParams,
    options?: RequestOptions,
  ): Promise<Plan> {
    const { id, ...rest } = params;
    return this.httpClient.patch(`/plans/${id}`, rest, options);
  }

  /** Soft-delete a plan. */
  async delete(
    params: DeletePlanParams,
    options?: RequestOptions,
  ): Promise<DeletedObject> {
    const { id } = params;
    return this.httpClient.delete(`/plans/${id}`, undefined, options);
  }

  /** List what changes from one version of a plan to another: prices, trials, features, rules, add-ons, credit packs and countries. */
  async compareVersions(
    params: ComparePlanVersionsParams,
    options?: RequestOptions,
  ): Promise<PlanVersionComparison> {
    const { id, versionId, ...rest } = params;
    return this.httpClient.get(
      `/plans/${id}/versions/${versionId}/changes`,
      rest,
      options,
    );
  }

  /** Get one published version of a plan with its prices and how many subscriptions are on it. */
  async getVersion(
    params: GetPlanVersionParams,
    options?: RequestOptions,
  ): Promise<PlanVersion> {
    const { id, versionId } = params;
    return this.httpClient.get(
      `/plans/${id}/versions/${versionId}`,
      undefined,
      options,
    );
  }

  /** List a plan's published versions, newest first, with their prices and how many subscriptions are on each. Versions published before Commet recorded every term are not listed. */
  async listVersions(
    params: ListPlanVersionsParams,
    options?: RequestOptions,
  ): Promise<{
    object: "list";
    data: Array<PlanVersion>;
    hasMore: boolean;
    nextCursor?: string;
  }> {
    const { id, ...rest } = params;
    return this.httpClient.get(`/plans/${id}/versions`, rest, options);
  }

  /** Publish a new current version of the plan from its current version, changing prices per interval, included credits or balance, per-currency amounts and the rollover cap. New buyers get it; every subscriber stays on its version until moved. To try changes without selling them to everyone, create an experiment instead. */
  async createVersion(
    params: CreatePlanVersionParams,
    options?: RequestOptions,
  ): Promise<PlanVersion> {
    const { id, ...rest } = params;
    return this.httpClient.post(`/plans/${id}/versions`, rest, options);
  }

  /** Set a plan's public visibility and return the updated plan. */
  async setVisibility(
    params: SetPlanVisibilityParams,
    options?: RequestOptions,
  ): Promise<Plan> {
    const { id, ...rest } = params;
    return this.httpClient.put(`/plans/${id}/visibility`, rest, options);
  }

  /** List plans with public price IDs and their automatic introductory offer IDs. */
  async list(
    params?: ListPlansParams,
    options?: RequestOptions,
  ): Promise<{
    object: "list";
    data: Array<Plan>;
    hasMore: boolean;
    nextCursor?: string;
  }> {
    return this.httpClient.get("/plans", params, options);
  }

  /** Create a new plan with optional consumption model, visibility, plan group assignment, overage behavior, and the rollover and spend limit of its plan credits or plan balance. */
  async create(
    params: CreatePlanParams,
    options?: RequestOptions,
  ): Promise<Plan> {
    return this.httpClient.post("/plans", params, options);
  }
}
