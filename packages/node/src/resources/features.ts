import type { ApiResponse, CustomerID, RequestOptions } from "../types/common";
import type { CommetHTTPClient } from "../utils/http";

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
  type: "boolean" | "usage" | "seats";
  allowed: boolean;
  enabled?: boolean;
  current?: number;
  included?: number;
  remaining?: number;
  overage?: number;
  overageUnitPrice?: number;
  unlimited?: boolean;
  overageEnabled?: boolean;
}

export interface CanUseResult {
  allowed: boolean;
  willBeCharged: boolean;
  reason?: string;
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
}
