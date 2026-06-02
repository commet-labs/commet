import type { ApiResponse, CustomerID, RequestOptions } from "../types/common";
import type { CommetHTTPClient } from "../utils/http";
import type { FeatureType } from "./plans";

export interface GetFeatureParams {
  customerId: CustomerID;
  code: string;
}

export interface CanUseFeatureParams {
  customerId: CustomerID;
  code: string;
}

export interface ListFeaturesParams {
  customerId: CustomerID;
}

export interface FeatureAccess {
  object: "feature";
  livemode: boolean;
  code: string;
  name: string;
  type: FeatureType;
  allowed: boolean;
  enabled?: boolean;
  current?: number;
  included?: number;
  remaining?: number;
  overage?: number;
  overageUnitPrice?: number;
  billedQuantity?: number;
  unlimited?: boolean;
  overageEnabled?: boolean;
}

export interface CanUseResult {
  allowed: boolean;
  willBeCharged: boolean;
  reason?: string;
}

export interface Feature {
  id: string;
  object: "feature";
  livemode: boolean;
  name: string;
  code: string;
  type: FeatureType;
  description: string | null;
  unitName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeatureParams {
  code: string;
  name: string;
  type: FeatureType;
  description?: string;
  unitName?: string;
}

export interface UpdateFeatureParams {
  code: string;
  name?: string;
  description?: string;
  unitName?: string;
}

export interface DeleteFeatureParams {
  code: string;
}

export class FeaturesResource {
  constructor(private httpClient: CommetHTTPClient) {}

  async get(
    params: GetFeatureParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<FeatureAccess>> {
    return this.httpClient.get(
      `/features/${params.code}`,
      { customerId: params.customerId },
      options,
    );
  }

  /** Checks if the customer can consume one more unit — returns billing impact and reason if blocked. */
  async canUse(
    params: CanUseFeatureParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<CanUseResult>> {
    return this.httpClient.get(
      `/features/${params.code}`,
      { customerId: params.customerId, action: "canUse" },
      options,
    );
  }

  async list(
    params: ListFeaturesParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<FeatureAccess[]>> {
    return this.httpClient.get(
      "/features",
      { customerId: params.customerId },
      options,
    );
  }

  async create(
    params: CreateFeatureParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Feature>> {
    return this.httpClient.post("/features/manage", params, options);
  }

  async update(
    params: UpdateFeatureParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Feature>> {
    const { code, ...body } = params;
    return this.httpClient.put(`/features/${code}/manage`, body, options);
  }

  /** Fails if feature is attached to active plans or has an active addon. */
  async delete(
    params: DeleteFeatureParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<{ id: string; deleted: true }>> {
    const { code } = params;
    return this.httpClient.delete(
      `/features/${code}/manage`,
      undefined,
      options,
    );
  }
}
