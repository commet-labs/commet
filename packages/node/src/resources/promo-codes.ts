import type { ApiResponse, RequestOptions } from "../types/common";
import type { CommetHTTPClient } from "../utils/http";

export interface PromoCode {
  id: string;
  object: "promo_code";
  livemode: boolean;
  code: string;
  discountType: "percentage" | "amount";
  discountValue: number;
  durationCycles: number | null;
  maxRedemptions: number | null;
  expiresAt: string | null;
  active: boolean;
  redemptionCount: number;
  createdAt: string;
}

export interface PromoCodeDetail extends PromoCode {
  updatedAt: string;
}

export interface ListPromoCodesParams {
  limit?: number;
  cursor?: string;
}

export interface GetPromoCodeParams {
  id: string;
}

export interface CreatePromoCodeParams {
  code: string;
  discountType: "percentage" | "amount";
  discountValue: number;
  durationCycles?: number;
  maxRedemptions?: number;
  expiresAt?: string;
  planIds?: string[];
}

export interface UpdatePromoCodeParams {
  id: string;
  maxRedemptions?: number;
  expiresAt?: string;
  active?: boolean;
  planIds?: string[];
}

export class PromoCodesResource {
  constructor(private httpClient: CommetHTTPClient) {}

  async list(params?: ListPromoCodesParams): Promise<ApiResponse<PromoCode[]>> {
    return this.httpClient.get("/promo-codes", params);
  }

  async get(params: GetPromoCodeParams): Promise<ApiResponse<PromoCodeDetail>> {
    return this.httpClient.get(`/promo-codes/${params.id}`);
  }

  async create(
    params: CreatePromoCodeParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<PromoCode>> {
    return this.httpClient.post("/promo-codes", params, options);
  }

  async update(
    params: UpdatePromoCodeParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<PromoCodeDetail>> {
    const { id, ...body } = params;
    return this.httpClient.put(`/promo-codes/${id}`, body, options);
  }
}
