import type { ApiResponse, RequestOptions } from "../types/common";
import type { DiscountType } from "../types/enums";
import type { PromoCode } from "../types/models";
import type { CommetHTTPClient } from "../utils/http";

export interface ListPromoCodesParams {
  limit?: number;
  cursor?: string;
}

export interface GetPromoCodeParams {
  id: string;
}

export interface CreatePromoCodeParams {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  durationCycles?: number;
  maxRedemptions?: number;
  /** @format date-time */
  expiresAt?: string;
  planIds?: Array<string>;
}

export interface UpdatePromoCodeParams {
  id: string;
  maxRedemptions?: number | null;
  expiresAt?: string | null;
  active?: boolean;
  planIds?: Array<string>;
}

export class PromoCodesResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /** List promo codes with cursor-based pagination. */
  async list(
    params?: ListPromoCodesParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Array<PromoCode>>> {
    return this.httpClient.get("/promo-codes", params, options);
  }

  /** Retrieve a promo code by its public ID. */
  async get(
    params: GetPromoCodeParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<PromoCode>> {
    const { id } = params;
    return this.httpClient.get(`/promo-codes/${id}`, undefined, options);
  }

  /**
   * Create a new promo code. Optionally restrict to specific plans.
   *
   * **100% discounts are not supported.** Percentage codes must be strictly less than 100% (`discountValue` < 10000 basis points). For full waivers, use an introductory offer on the plan instead. At checkout, any code — percentage or fixed amount — that would reduce the total below the currency's minimum charge ($0.50 USD equivalent) is silently dropped.
   */
  async create(
    params: CreatePromoCodeParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<PromoCode>> {
    return this.httpClient.post("/promo-codes", params, options);
  }

  /** Update a promo code's redemption limits, expiration, active status, or plan restrictions. */
  async update(
    params: UpdatePromoCodeParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<PromoCode>> {
    const { id, ...rest } = params;
    return this.httpClient.put(`/promo-codes/${id}`, rest, options);
  }
}
