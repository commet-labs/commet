import type { ApiResponse, RequestOptions } from "../types/common";
import type { UsageQuota, UsageQuotaEvent } from "../types/models";
import type { CommetHTTPClient } from "../utils/http";

export interface AddQuotaParams {
  customerId?: string;
  externalId?: string;
  featureCode: string;
  count?: number;
  idempotencyKey?: string;
}

export interface SetQuotaParams {
  customerId?: string;
  externalId?: string;
  featureCode: string;
  count: number;
  idempotencyKey?: string;
}

export interface RemoveQuotaParams {
  customerId?: string;
  externalId?: string;
  featureCode: string;
  count?: number;
  idempotencyKey?: string;
}

export interface GetQuotaAllowanceParams {
  customerId: string;
  featureCode: string;
}

export interface GetAllQuotaAllowancesParams {
  customerId: string;
}

export class QuotaResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /** Add to a customer's quota allowance for a feature. Defaults to 1 if count is omitted. */
  async add(
    params: AddQuotaParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<UsageQuotaEvent>> {
    return this.httpClient.post("/usage/quota", params, options);
  }

  /** Set a customer's quota allowance for a feature to an exact value. */
  async set(
    params: SetQuotaParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<UsageQuotaEvent>> {
    return this.httpClient.put("/usage/quota", params, options);
  }

  /** Remove from a customer's quota allowance for a feature. Defaults to 1 if count is omitted. Returns 400 insufficient_balance if the balance would go negative. */
  async remove(
    params: RemoveQuotaParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<UsageQuotaEvent>> {
    return this.httpClient.delete("/usage/quota", params, options);
  }

  /** Get the current quota allowance (used vs included) for a specific feature. */
  async get(
    params: GetQuotaAllowanceParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<UsageQuota>> {
    return this.httpClient.get("/usage/quota", params, options);
  }

  /** Get all quota allowances for a customer across every quota feature in their plan. */
  async getAll(
    params: GetAllQuotaAllowancesParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Array<UsageQuota>>> {
    return this.httpClient.get("/usage/quota/all", params, options);
  }
}
