import type { RequestOptions } from "../types/common";
import type { UsageQuota, UsageQuotaEvent } from "../types/models";
import type { CommetHTTPClient } from "../utils/http";

export interface GetAllQuotaAllowancesParams {
  customerId: string;
}

export type RemoveQuotaParams =
  | {
      featureCode: string;
      count?: number;
      customerId: string;
    }
  | {
      featureCode: string;
      count?: number;
      externalId: string;
    };

export interface GetQuotaAllowanceParams {
  customerId: string;
  featureCode: string;
}

export type AddQuotaParams =
  | {
      featureCode: string;
      count?: number;
      customerId: string;
    }
  | {
      featureCode: string;
      count?: number;
      externalId: string;
    };

export type SetQuotaParams =
  | {
      featureCode: string;
      count: number;
      customerId: string;
    }
  | {
      featureCode: string;
      count: number;
      externalId: string;
    };

export class QuotaResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /** Get all quota allowances for a customer across every quota feature in their plan. */
  async getAll(
    params: GetAllQuotaAllowancesParams,
    options?: RequestOptions,
  ): Promise<{
    object: "list";
    data: Array<UsageQuota>;
    hasMore: boolean;
    nextCursor?: string;
  }> {
    return this.httpClient.get("/usage/quota/all", params, options);
  }

  /** Remove from a customer's quota allowance for a feature. Defaults to 1 if count is omitted. Returns 400 insufficient_balance if the balance would go negative. */
  async remove(
    params: RemoveQuotaParams,
    options?: RequestOptions,
  ): Promise<UsageQuotaEvent> {
    return this.httpClient.post("/usage/quota/remove", params, options);
  }

  /** Get the current quota allowance (used vs included) for a specific feature. */
  async get(
    params: GetQuotaAllowanceParams,
    options?: RequestOptions,
  ): Promise<UsageQuota> {
    return this.httpClient.get("/usage/quota", params, options);
  }

  /** Add to a customer's quota allowance for a feature. Defaults to 1 if count is omitted. */
  async add(
    params: AddQuotaParams,
    options?: RequestOptions,
  ): Promise<UsageQuotaEvent> {
    return this.httpClient.post("/usage/quota", params, options);
  }

  /** Set a customer's quota allowance for a feature to an exact value. */
  async set(
    params: SetQuotaParams,
    options?: RequestOptions,
  ): Promise<UsageQuotaEvent> {
    return this.httpClient.put("/usage/quota", params, options);
  }
}
