import type { RequestOptions } from "../types/common";
import type {
  DeletedObject,
  DeletedPlanRegionalPricing,
  Plan,
  PlanFeature,
  PlanPrice,
  PlanRegionalPricing,
  PlanRegionalPricingResult,
  RemovedPlanFeature,
} from "../types/models";
import type { CommetHTTPClient } from "../utils/http";

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
  /** Credits plans only. What happens to unused plan credits at each reset. Existing subscriptions apply it from their next reset. */
  unusedPlanCredits?:
    | {
        type: "expire";
      }
    | {
        type: "roll_over";
        /** The most plan credits a subscription holds after a reset, including the credits that reset grants; credits above it expire. At least the included credits of every price. null means no limit other than the largest storable balance, 2,147,483,647 plan credits. */
        maxPlanCredits: number | null;
      };
  /** Credits plans only. The most plan credits a subscription spends per day or per week; null removes the limit. Raising or removing it applies to existing subscriptions at once; lowering it, adding it or changing its interval applies from their next period. */
  planCreditLimit?: {
    /** The most plan credits a subscription spends in one window. */
    credits: number;
    /** The window length: `day` is 24 hours and `week` is 7 days, starting at the time of day of the subscription's billing anchor. */
    interval: "day" | "week";
  } | null;
  /** Balance plans only. What happens to unused plan balance at each reset. Existing subscriptions apply it from their next reset. */
  unusedPlanBalance?:
    | {
        type: "expire";
      }
    | {
        type: "roll_over";
        /** The most plan balance a subscription holds after a reset, in USD cents, including the balance that reset grants; balance above it expires. At least the included balance of every price. Other currencies convert it with the plan's exchange rate unless the dashboard sets a custom amount for that currency. null means no limit other than the largest storable amount, 2,147,483,647 cents. */
        maxPlanBalance: number | null;
      };
  /** Balance plans only. The most plan balance a subscription spends per day or per week, in USD cents; null removes the limit. Raising or removing it applies to existing subscriptions at once; lowering it, adding it or changing its interval applies from their next period. */
  planBalanceLimit?: {
    /** The most plan balance a subscription spends in one window, in USD cents. Other currencies convert it with the plan's exchange rate unless the dashboard sets a custom amount for that currency. */
    amount: number;
    /** The window length: `day` is 24 hours and `week` is 7 days, starting at the time of day of the subscription's billing anchor. */
    interval: "day" | "week";
  } | null;
  /** Credits and balance plans only. false lets usage continue past the plan and purchased amounts and bills the missing amount as overage at the next renewal; a credits plan bills it at the price per credit and needs one. Trials and free plans always stop, so free plans accept only true. Existing subscriptions apply it from their next reset. */
  blockOnExhaustion?: boolean;
  /** Make this plan the default plan of its plan group: customers created with that planGroupId start on it, and a paid plan of the group that ends from the customer portal, a revoked payment authorization or exhausted dunning moves to it instead of canceling. Requires a free plan in a plan group; replaces the group's previous default plan. false unmarks it. */
  isDefault?: boolean;
}

export interface DeletePlanParams {
  id: string;
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

  /** Archive a price for new subscriptions. Existing subscriptions that selected it continue using its current catalog value. */
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
