import type { ApiResponse, RequestOptions } from "../types/common";
import type { FeatureAccess, FeatureLookup } from "../types/models";
import type { CommetHTTPClient } from "../utils/http";

export interface ListFeatureAccessParams {
  customerId: string;
}

export interface GetFeatureAccessParams {
  code: string;
  customerId: string;
  action?: string;
}

export interface CanUseFeatureParams {
  code: string;
  customerId: string;
}

export class FeatureAccessResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /** List all features for a customer's active subscription, scoped by the customerId query parameter. */
  async list(
    params: ListFeatureAccessParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Array<FeatureAccess>>> {
    return this.httpClient.get("/feature-access", params, options);
  }

  /** Get feature access details for a customer. Use action=canUse to check if the customer can consume one more unit. */
  async get(
    params: GetFeatureAccessParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<FeatureLookup>> {
    const { code, ...rest } = params;
    return this.httpClient.get(`/feature-access/${code}`, rest, options);
  }

  /** Get feature access details for a customer. Use action=canUse to check if the customer can consume one more unit. */
  async canUse(
    params: CanUseFeatureParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<FeatureLookup>> {
    const { code, ...rest } = params;
    return this.httpClient.get(
      `/feature-access/${code}`,
      { ...rest, action: "canUse" },
      options,
    );
  }
}
