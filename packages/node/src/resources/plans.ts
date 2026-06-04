import type { ApiResponse, ListParams, RequestOptions } from "../types/common";
import type { CommetHTTPClient } from "../utils/http";

export type PlanID = `plan_${string}`;
export type BillingInterval =
  | "weekly"
  | "monthly"
  | "quarterly"
  | "yearly"
  | "one_time";
export type FeatureType = "boolean" | "usage" | "seats" | "quota";
export type ConsumptionModel = "metered" | "credits" | "balance";
export type DiscountType = "percentage" | "amount";

export interface PlanPrice {
  billingInterval: BillingInterval;
  price: number; // in cents
  isDefault: boolean;
  trialDays: number;
}

export interface PlanFeature {
  code: string;
  name: string;
  type: FeatureType;
  unitName: string | null;
  enabled?: boolean;
  includedAmount?: number;
  unlimited?: boolean;
  overageEnabled?: boolean;
  overageUnitPrice?: number;
}

export interface Plan {
  id: PlanID;
  object: "plan";
  livemode: boolean;
  code: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  isFree: boolean;
  isDefault: boolean;
  sortOrder: number;
  prices: PlanPrice[];
  features: PlanFeature[];
  createdAt: string;
}

export interface PlanDetailPrice {
  billingInterval: BillingInterval;
  price: number;
  isDefault: boolean;
  trialDays: number;
  introOffer: {
    enabled: boolean;
    discountType: DiscountType | null;
    discountValue: number | null;
    durationCycles: number | null;
  } | null;
}

export interface PlanDetailFeature extends PlanFeature {
  overage: {
    enabled: boolean;
    model: "per_unit" | null;
    unitPrice: number | null;
  } | null;
}

export interface PlanDetail {
  id: PlanID;
  object: "plan";
  livemode: boolean;
  code: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  isDefault: boolean;
  sortOrder: number;
  prices: PlanDetailPrice[];
  features: PlanDetailFeature[];
  createdAt: string;
  updatedAt: string;
}

export interface ListPlansParams extends ListParams {
  includePrivate?: boolean;
}

export interface PlanManage {
  id: string;
  object: "plan";
  livemode: boolean;
  name: string;
  code: string;
  description: string | null;
  consumptionModel: ConsumptionModel | null;
  isPublic: boolean;
  isDefault: boolean;
  isFree: boolean;
  blockOnExhaustion: boolean;
  sortOrder: number;
  planGroupId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

interface PlanFeatureManageBase {
  planId: string;
  featureId: string;
  enabled: boolean;
  includedAmount: number | null;
  unlimited: boolean;
  overageEnabled: boolean;
  creditsPerUnit: number | null;
}

export interface FixedPricingFeatureManage extends PlanFeatureManageBase {
  pricingMode: "fixed";
  overageUnitPrice: number | null;
  margin: null;
}

export interface AiModelPricingFeatureManage extends PlanFeatureManageBase {
  pricingMode: "ai_model";
  margin: number;
  overageUnitPrice: null;
}

export type PlanFeatureManage =
  | FixedPricingFeatureManage
  | AiModelPricingFeatureManage;

export interface PlanPriceManage {
  id: string;
  object: "plan_price";
  livemode: boolean;
  planId: string;
  billingInterval: BillingInterval;
  price: number;
  isDefault: boolean;
  trialDays: number;
  includedBalance: number | null;
  includedCredits: number | null;
  introOfferEnabled: boolean;
  introOfferDiscountType: DiscountType | null;
  introOfferDiscountValue: number | null;
  introOfferDurationCycles: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface RegionalPriceResult {
  priceId: string;
  overrides: Array<{ currency: string; price: number }>;
}

export interface DeleteResult {
  id: string;
  deleted: true;
}

export interface RemoveResult {
  id: string;
  removed: true;
}

export interface CreatePlanParams {
  name: string;
  code: string;
  description?: string;
  consumptionModel?: ConsumptionModel;
  isPublic?: boolean;
  isFree?: boolean;
  blockOnExhaustion?: boolean;
  planGroupId?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdatePlanParams {
  id: string;
  name?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  isPublic?: boolean;
}

export interface DeletePlanParams {
  id: string;
}

export interface SetVisibilityParams {
  id: string;
  isPublic: boolean;
}

interface AddPlanFeatureBase {
  planId: string;
  featureId: string;
  enabled?: boolean;
  includedAmount?: number;
  unlimited?: boolean;
  overageEnabled?: boolean;
  creditsPerUnit?: number | null;
}

export interface AddFixedPricingFeatureParams extends AddPlanFeatureBase {
  pricingMode?: "fixed";
  overageUnitPrice?: number;
}

export interface AddAiModelPricingFeatureParams extends AddPlanFeatureBase {
  pricingMode: "ai_model";
  margin: number;
}

export type AddPlanFeatureParams =
  | AddFixedPricingFeatureParams
  | AddAiModelPricingFeatureParams;

interface UpdatePlanFeatureBase {
  planId: string;
  featureId: string;
  enabled?: boolean;
  includedAmount?: number;
  unlimited?: boolean;
  overageEnabled?: boolean;
  creditsPerUnit?: number | null;
}

export interface UpdateFixedPricingFeatureParams extends UpdatePlanFeatureBase {
  pricingMode?: "fixed";
  overageUnitPrice?: number;
}

export interface UpdateAiModelPricingFeatureParams
  extends UpdatePlanFeatureBase {
  pricingMode: "ai_model";
  margin?: number;
}

export type UpdatePlanFeatureParams =
  | UpdateFixedPricingFeatureParams
  | UpdateAiModelPricingFeatureParams;

export interface RemovePlanFeatureParams {
  planId: string;
  featureId: string;
}

export interface AddPlanPriceParams {
  planId: string;
  billingInterval: BillingInterval;
  price: number;
  trialDays?: number;
  isDefault?: boolean;
  includedBalance?: number;
  includedCredits?: number;
  introOfferEnabled?: boolean;
  introOfferDiscountType?: "percentage" | "amount";
  introOfferDiscountValue?: number;
  introOfferDurationCycles?: number;
}

export interface UpdatePlanPriceParams {
  planId: string;
  priceId: string;
  price?: number;
  isDefault?: boolean;
  trialDays?: number;
  includedBalance?: number;
  includedCredits?: number;
  introOfferEnabled?: boolean;
  introOfferDiscountType?: "percentage" | "amount" | null;
  introOfferDiscountValue?: number | null;
  introOfferDurationCycles?: number | null;
}

export interface DeletePlanPriceParams {
  planId: string;
  priceId: string;
}

export interface SetDefaultPriceParams {
  planId: string;
  priceId: string;
}

export interface SetRegionalPricesParams {
  planId: string;
  priceId: string;
  overrides: Array<{ currency: string; price: number }>;
}

export interface DeleteRegionalPricesParams {
  planId: string;
  priceId: string;
}

export class PlansResource {
  constructor(private httpClient: CommetHTTPClient) {}

  async list(params?: ListPlansParams): Promise<ApiResponse<Plan[]>> {
    return this.httpClient.get("/plans", params);
  }

  async get(params: { id: string }): Promise<ApiResponse<PlanDetail>> {
    return this.httpClient.get(`/plans/${params.id}`);
  }

  async create(
    params: CreatePlanParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<PlanManage>> {
    return this.httpClient.post("/plans/manage", params, options);
  }

  async update(
    params: UpdatePlanParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<PlanManage>> {
    const { id, ...body } = params;
    return this.httpClient.put(`/plans/${id}/manage`, body, options);
  }

  async delete(
    params: DeletePlanParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<DeleteResult>> {
    return this.httpClient.delete(
      `/plans/${params.id}/manage`,
      undefined,
      options,
    );
  }

  async setVisibility(
    params: SetVisibilityParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<PlanManage>> {
    const { id, ...body } = params;
    return this.httpClient.put(`/plans/${id}/visibility`, body, options);
  }

  async addFeature(
    params: AddPlanFeatureParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<PlanFeatureManage>> {
    const { planId, ...body } = params;
    return this.httpClient.post(`/plans/${planId}/features`, body, options);
  }

  async updateFeature(
    params: UpdatePlanFeatureParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<PlanFeatureManage>> {
    const { planId, featureId, ...body } = params;
    return this.httpClient.put(
      `/plans/${planId}/features/${featureId}`,
      body,
      options,
    );
  }

  async removeFeature(
    params: RemovePlanFeatureParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<RemoveResult>> {
    const { planId, featureId } = params;
    return this.httpClient.delete(
      `/plans/${planId}/features/${featureId}`,
      undefined,
      options,
    );
  }

  async addPrice(
    params: AddPlanPriceParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<PlanPriceManage>> {
    const { planId, ...body } = params;
    return this.httpClient.post(`/plans/${planId}/prices`, body, options);
  }

  async updatePrice(
    params: UpdatePlanPriceParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<PlanPriceManage>> {
    const { planId, priceId, ...body } = params;
    return this.httpClient.put(
      `/plans/${planId}/prices/${priceId}`,
      body,
      options,
    );
  }

  async deletePrice(
    params: DeletePlanPriceParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<DeleteResult>> {
    const { planId, priceId } = params;
    return this.httpClient.delete(
      `/plans/${planId}/prices/${priceId}`,
      undefined,
      options,
    );
  }

  async setDefaultPrice(
    params: SetDefaultPriceParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<PlanPriceManage>> {
    const { planId, priceId } = params;
    return this.httpClient.put(
      `/plans/${planId}/prices/${priceId}/default`,
      {},
      options,
    );
  }

  async setRegionalPrices(
    params: SetRegionalPricesParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<RegionalPriceResult>> {
    const { planId, priceId, ...body } = params;
    return this.httpClient.put(
      `/plans/${planId}/prices/${priceId}/regional`,
      body,
      options,
    );
  }

  async deleteRegionalPrices(
    params: DeleteRegionalPricesParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<DeleteResult>> {
    const { planId, priceId } = params;
    return this.httpClient.delete(
      `/plans/${planId}/prices/${priceId}/regional`,
      undefined,
      options,
    );
  }
}
