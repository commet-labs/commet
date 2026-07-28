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
  includedBalance?: number | null;
  includedCredits?: number | null;
}

export interface DeletePlanPriceParams {
  id: string;
  priceId: string;
}

export interface AddPlanPriceParams {
  id: string;
  billingInterval: "weekly" | "monthly" | "quarterly" | "yearly" | "one_time";
  price: number;
  trialDays?: number;
  isDefault?: boolean;
  includedBalance?: number | null;
  includedCredits?: number | null;
}

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
  blockOnExhaustion?: boolean;
  planGroupId?: string;
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

  /** Remove all regional currency overrides for a plan price. */
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

  /** Update an existing price on a plan. Offer terms are managed through Offers. */
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

  /** Remove a price from a plan. */
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

  /** Add a billing interval price to a plan. Configure introductory and promotional benefits through Offers. */
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

  /** Update a plan's name, description, visibility, or metadata. */
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

  /** Create a new plan with optional consumption model, visibility, and plan group assignment. */
  async create(
    params: CreatePlanParams,
    options?: RequestOptions,
  ): Promise<Plan> {
    return this.httpClient.post("/plans", params, options);
  }
}
