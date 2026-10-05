import type { RequestOptions } from "../types/common";
import type {
  DeletedObject,
  DeletedPlanRegionalPricing,
  Plan,
  PlanFeature,
  PlanPrice,
  PlanRegionalPricing,
  PlanRegionalPricingResult,
  PlanVersion,
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
        | "yearly"
        | "one_time";
      metadata?: Record<string, unknown>;
      price: number;
      trialDays?: number;
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
}

export interface DeletePlanParams {
  id: string;
}

export interface PromotePlanVersionParams {
  id: string;
  versionId: string;
  expectedMainVersionId: string;
}

export interface PublishPlanVersionParams {
  id: string;
  versionId: string;
  expectedRevision: number;
  target: "main" | "test";
  expectedMainVersionId: string;
}

export interface RetirePlanVersionParams {
  id: string;
  versionId: string;
  expectedMainVersionId: string;
}

export interface GetPlanVersionParams {
  id: string;
  versionId: string;
}

export interface UpdatePlanVersionParams {
  id: string;
  versionId: string;
  blockOnExhaustion?: boolean;
  freeIncludedCredits?: number | null;
  freeIncludedBalance?: number | null;
  prices?: Array<{
    id?: string;
    billingInterval: "weekly" | "monthly" | "quarterly" | "yearly" | "one_time";
    price: number;
    isDefault: boolean;
    includedBalance: number | null;
    includedCredits: number | null;
    inheritsFromPriceId: string | null;
    offerId: string | null;
    countries: Array<{
      countryCode: string;
      price: number;
      includedBalance: number | null;
      autoSynced: boolean;
    }>;
  }>;
  features?: Array<{
    featureId: string;
    enabled: boolean;
    includedAmount: number | null;
    unlimited: boolean;
    overageEnabled: boolean;
    overageUnitPrice: number | null;
    overageModel: "per_unit" | null;
    creditsPerUnit: number | null;
    pricingMode: "fixed" | "ai_model";
    margin: number | null;
    discountType: "percentage" | "amount" | null;
    discountValue: number | null;
    countries: Array<{
      countryCode: string;
      overageUnitPrice: number;
      autoSynced: boolean;
    }>;
  }>;
  countries?: Array<{
    countryCode: string;
    currency: string;
    exchangeRateCents: number | null;
  }>;
  addons?: Array<{
    id?: string;
    featureId: string;
    name: string;
    consumptionModel: "boolean" | "metered" | "credits" | "balance";
    includedUnits: number | null;
    creditCost: number | null;
    prices: Array<{
      currency: string;
      price: number;
      overageRate: number | null;
    }>;
  }>;
  creditPacks?: Array<{
    id?: string;
    name: string;
    credits: number;
    prices: Array<{
      currency: string;
      price: number;
    }>;
  }>;
  expectedRevision: number;
}

export interface DiscardPlanVersionParams {
  id: string;
  versionId: string;
  expectedRevision: number;
}

export interface ListPlanVersionsParams {
  id: string;
}

export interface CreatePlanVersionParams {
  id: string;
  sourceVersionId?: string;
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

  /** Choose a sellable publication as the default for new subscriptions. Existing subscriptions are not moved. */
  async promoteVersion(
    params: PromotePlanVersionParams,
    options?: RequestOptions,
  ): Promise<PlanVersion> {
    const { id, versionId, ...rest } = params;
    return this.httpClient.post(
      `/plans/${id}/versions/${versionId}/promote`,
      rest,
      options,
    );
  }

  /** Validate all commercial terms and publish as the main version or a parallel test. Existing subscriptions are not moved. */
  async publishVersion(
    params: PublishPlanVersionParams,
    options?: RequestOptions,
  ): Promise<PlanVersion> {
    const { id, versionId, ...rest } = params;
    return this.httpClient.post(
      `/plans/${id}/versions/${versionId}/publish`,
      rest,
      options,
    );
  }

  /** Stop selling this version while preserving existing subscriptions. Replace the main version before retiring it. */
  async retireVersion(
    params: RetirePlanVersionParams,
    options?: RequestOptions,
  ): Promise<PlanVersion> {
    const { id, versionId, ...rest } = params;
    return this.httpClient.post(
      `/plans/${id}/versions/${versionId}/retire`,
      rest,
      options,
    );
  }

  /** Read the complete commercial terms of a draft or published version. */
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

  /** Update an unpublished draft using its current revision. Each supplied array replaces that collection. Free/paid status and the consumption model are fixed at plan creation. Publishing separately validates completeness. */
  async updateVersion(
    params: UpdatePlanVersionParams,
    options?: RequestOptions,
  ): Promise<PlanVersion> {
    const { id, versionId, ...rest } = params;
    return this.httpClient.patch(
      `/plans/${id}/versions/${versionId}`,
      rest,
      options,
    );
  }

  /** Delete an unpublished draft. Published versions must be retired instead. */
  async discardVersion(
    params: DiscardPlanVersionParams,
    options?: RequestOptions,
  ): Promise<DeletedObject> {
    const { id, versionId, ...rest } = params;
    return this.httpClient.delete(
      `/plans/${id}/versions/${versionId}`,
      rest,
      options,
    );
  }

  /** List complete publications and drafts. Existing subscribers retain their accepted version. */
  async listVersions(
    params: ListPlanVersionsParams,
    options?: RequestOptions,
  ): Promise<{
    object: "list";
    data: Array<PlanVersion>;
    hasMore: boolean;
    nextCursor?: string;
  }> {
    const { id } = params;
    return this.httpClient.get(`/plans/${id}/versions`, undefined, options);
  }

  /** Copy a published version into an editable draft. Omit sourceVersionId to copy the main version. This does not change availability or any subscription. */
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

  /** Create a new plan with optional consumption model, visibility, and plan group assignment. */
  async create(
    params: CreatePlanParams,
    options?: RequestOptions,
  ): Promise<Plan> {
    return this.httpClient.post("/plans", params, options);
  }
}
