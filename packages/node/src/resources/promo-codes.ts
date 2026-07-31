import type { RequestOptions } from "../types/common";
import type { PromoCode } from "../types/models";
import type { CommetHTTPClient } from "../utils/http";

export interface GetPromoCodeParams {
  id: string;
}

export interface UpdatePromoCodeParams {
  id: string;
  billingInterval?:
    | "weekly"
    | "monthly"
    | "quarterly"
    | "yearly"
    | "one_time"
    | null;
  maxRedemptions?: number | null;
  expiresAt?: string | null;
  active?: boolean;
  planIds?: Array<string>;
}

export interface ListPromoCodesParams {
  cursor?: string;
  limit?: number;
}

export interface CreatePromoCodeParams {
  code: string;
  offerId: string;
  billingInterval?:
    | "weekly"
    | "monthly"
    | "quarterly"
    | "yearly"
    | "one_time"
    | null;
  maxRedemptions?: number;
  /** @format date-time */
  expiresAt?: string;
  planIds?: Array<string>;
}

export class PromoCodesResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /** Retrieve a promo code by its public ID. */
  async get(
    params: GetPromoCodeParams,
    options?: RequestOptions,
  ): Promise<PromoCode> {
    const { id } = params;
    return this.httpClient.get(`/promo-codes/${id}`, undefined, options);
  }

  /** Update a promo code's billing interval, redemption limits, expiration, active status, or plan restrictions. */
  async update(
    params: UpdatePromoCodeParams,
    options?: RequestOptions,
  ): Promise<PromoCode> {
    const { id, ...rest } = params;
    return this.httpClient.patch(`/promo-codes/${id}`, rest, options);
  }

  /** List promo codes with cursor-based pagination. */
  async list(
    params?: ListPromoCodesParams,
    options?: RequestOptions,
  ): Promise<{
    object: "list";
    data: Array<PromoCode>;
    hasMore: boolean;
    nextCursor?: string;
  }> {
    return this.httpClient.get("/promo-codes", params, options);
  }

  /** Create a distribution code for an existing Offer. The referenced Offer owns the benefit and duration; the promo code owns redemption restrictions. */
  async create(
    params: CreatePromoCodeParams,
    options?: RequestOptions,
  ): Promise<PromoCode> {
    return this.httpClient.post("/promo-codes", params, options);
  }
}
