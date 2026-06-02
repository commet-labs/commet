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
  current: number;
  included: number;
  remaining: number | null;
  billedQuantity?: number;
  unlimited: boolean;
  overageEnabled: boolean;
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

  async get(params: GetQuotaParams): Promise<ApiResponse<QuotaAllowance>> {
    return this.httpClient.get("/usage/quota", {
      customerId: params.customerId,
      featureCode: params.featureCode,
    });
  }

  async getAll(
    params: GetAllQuotaParams,
  ): Promise<ApiResponse<QuotaAllowance[]>> {
    return this.httpClient.get("/usage/quota/all", {
      customerId: params.customerId,
    });
  }
}
