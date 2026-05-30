import type { ApiResponse, CustomerID, RequestOptions } from "../types/common";
import type { CommetHTTPClient } from "../utils/http";

export interface QuotaEvent {
  id: string;
  customerId: CustomerID;
  featureCode: string;
  previousBalance: number;
  newBalance: number;
  ts: string;
  createdAt: string;
}

export interface QuotaAllowance {
  featureCode: string;
  /** Units currently held — the durable balance. */
  current: number;
  /** Units included in the customer's plan. */
  included: number;
  /** `included - current`, or `null` when the feature is unlimited. */
  remaining: number | null;
  unlimited: boolean;
  overageEnabled: boolean;
  /** Timestamp of the latest balance change, or `null` if the balance was never set. */
  asOf: string | null;
}

export interface AddQuotaParams {
  customerId: CustomerID;
  featureCode: string;
  count?: number;
}

export interface SetQuotaParams {
  customerId: CustomerID;
  featureCode: string;
  count: number;
}

export interface RemoveQuotaParams {
  customerId: CustomerID;
  featureCode: string;
  count?: number;
}

export interface GetQuotaParams {
  customerId: CustomerID;
  featureCode: string;
}

export interface GetAllQuotaParams {
  customerId: CustomerID;
}

export class QuotaResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /** Increments the durable quota balance. Defaults to 1. */
  async add(
    params: AddQuotaParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<QuotaEvent>> {
    return this.httpClient.post(
      "/usage/quota",
      {
        customerId: params.customerId,
        featureCode: params.featureCode,
        count: params.count ?? 1,
      },
      options,
    );
  }

  /** Sets the durable quota balance to an exact value. */
  async set(
    params: SetQuotaParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<QuotaEvent>> {
    return this.httpClient.put(
      "/usage/quota",
      {
        customerId: params.customerId,
        featureCode: params.featureCode,
        count: params.count,
      },
      options,
    );
  }

  /**
   * Decrements the durable quota balance. Defaults to 1.
   * Rejects with a `CommetAPIError` (`code: "insufficient_balance"`, status 400)
   * if the balance would go negative.
   */
  async remove(
    params: RemoveQuotaParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<QuotaEvent>> {
    return this.httpClient.delete(
      "/usage/quota",
      {
        customerId: params.customerId,
        featureCode: params.featureCode,
        count: params.count ?? 1,
      },
      options,
    );
  }

  /** Returns the current allowance (held vs included) for a single quota feature. */
  async get(params: GetQuotaParams): Promise<ApiResponse<QuotaAllowance>> {
    return this.httpClient.get("/usage/quota", {
      customerId: params.customerId,
      featureCode: params.featureCode,
    });
  }

  /** Returns the current allowance for every quota feature in the customer's plan. */
  async getAll(
    params: GetAllQuotaParams,
  ): Promise<ApiResponse<QuotaAllowance[]>> {
    return this.httpClient.get("/usage/quota/all", {
      customerId: params.customerId,
    });
  }
}
