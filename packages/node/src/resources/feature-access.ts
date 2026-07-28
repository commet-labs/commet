import type { RequestOptions } from "../types/common";
import type { FeatureAccess } from "../types/models";
import type { CommetHTTPClient } from "../utils/http";

export interface GetFeatureAccessParams {
  code: string;
  customerId: string;
}

export interface ListFeatureAccessParams {
  customerId: string;
}

export class FeatureAccessResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /** Get one feature's access and current usage for a customer. To evaluate a prospective consumption, use POST /usage/check. */
  async get(
    params: GetFeatureAccessParams,
    options?: RequestOptions,
  ): Promise<FeatureAccess> {
    const { code, ...rest } = params;
    return this.httpClient.get(`/feature-access/${code}`, rest, options);
  }

  /** List a customer's feature access and current usage. */
  async list(
    params: ListFeatureAccessParams,
    options?: RequestOptions,
  ): Promise<{
    object: "list";
    data: Array<FeatureAccess>;
    hasMore: boolean;
    nextCursor?: string;
  }> {
    return this.httpClient.get("/feature-access", params, options);
  }
}
