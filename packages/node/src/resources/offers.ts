import type { RequestOptions } from "../types/common";
import type { DeletedOffer, Offer } from "../types/models";
import type { CommetHTTPClient } from "../utils/http";

export interface GetOfferParams {
  id: string;
}

export interface UpdateOfferParams {
  id: string;
  name: string;
  phases: Array<
    | {
        type: "percentage";
        durationCycles: number | null;
        /** Unit the phase duration is counted in. Only a fixed-price phase may set it, because its amount is declared rather than derived from the plan. Defaults to the plan's own billing interval. */
        durationInterval?:
          | "weekly"
          | "monthly"
          | "quarterly"
          | "semiannual"
          | "yearly"
          | null;
        /** Discount in basis points. 5000 means 50%. */
        percentage: number;
      }
    | {
        type: "amount_off";
        durationCycles: number | null;
        /** Unit the phase duration is counted in. Only a fixed-price phase may set it, because its amount is declared rather than derived from the plan. Defaults to the plan's own billing interval. */
        durationInterval?:
          | "weekly"
          | "monthly"
          | "quarterly"
          | "semiannual"
          | "yearly"
          | null;
        amounts: Array<{
          currency: string;
          /** Amount in the currency's minor unit (for example, cents for USD). */
          amount: number;
        }>;
      }
    | {
        type: "fixed_price";
        durationCycles: number | null;
        /** Unit the phase duration is counted in. Only a fixed-price phase may set it, because its amount is declared rather than derived from the plan. Defaults to the plan's own billing interval. */
        durationInterval?:
          | "weekly"
          | "monthly"
          | "quarterly"
          | "semiannual"
          | "yearly"
          | null;
        prices: Array<{
          currency: string;
          /** Amount in the currency's minor unit (for example, cents for USD). */
          amount: number;
        }>;
      }
  >;
  metadata?: Record<string, unknown>;
  startsAt?: string | null;
  endsAt?: string | null;
  active?: boolean;
  /** Plans the offer is limited to: it cannot be applied to a subscription on another plan, and an applied offer ends when the subscriber changes to one. An empty list removes the limit. Omit to keep the current limit. */
  planIds?: Array<string>;
  /** Billing interval the offer is limited to: it cannot be applied to a subscription on another interval, and an applied offer ends when the subscriber changes to one. Null removes the limit. Omit to keep the current limit. */
  billingInterval?:
    | "weekly"
    | "monthly"
    | "quarterly"
    | "semiannual"
    | "yearly"
    | "one_time"
    | null;
}

export interface DeleteOfferParams {
  id: string;
}

export interface ListOffersParams {
  cursor?: string;
  limit?: number;
  active?: boolean;
}

export interface CreateOfferParams {
  name: string;
  phases: Array<
    | {
        type: "percentage";
        durationCycles: number | null;
        /** Unit the phase duration is counted in. Only a fixed-price phase may set it, because its amount is declared rather than derived from the plan. Defaults to the plan's own billing interval. */
        durationInterval?:
          | "weekly"
          | "monthly"
          | "quarterly"
          | "semiannual"
          | "yearly"
          | null;
        /** Discount in basis points. 5000 means 50%. */
        percentage: number;
      }
    | {
        type: "amount_off";
        durationCycles: number | null;
        /** Unit the phase duration is counted in. Only a fixed-price phase may set it, because its amount is declared rather than derived from the plan. Defaults to the plan's own billing interval. */
        durationInterval?:
          | "weekly"
          | "monthly"
          | "quarterly"
          | "semiannual"
          | "yearly"
          | null;
        amounts: Array<{
          currency: string;
          /** Amount in the currency's minor unit (for example, cents for USD). */
          amount: number;
        }>;
      }
    | {
        type: "fixed_price";
        durationCycles: number | null;
        /** Unit the phase duration is counted in. Only a fixed-price phase may set it, because its amount is declared rather than derived from the plan. Defaults to the plan's own billing interval. */
        durationInterval?:
          | "weekly"
          | "monthly"
          | "quarterly"
          | "semiannual"
          | "yearly"
          | null;
        prices: Array<{
          currency: string;
          /** Amount in the currency's minor unit (for example, cents for USD). */
          amount: number;
        }>;
      }
  >;
  metadata?: Record<string, unknown>;
  startsAt?: string | null;
  endsAt?: string | null;
  active?: boolean;
  /** Plans the offer is limited to: it cannot be applied to a subscription on another plan, and an applied offer ends when the subscriber changes to one. An empty list removes the limit. Omit to keep the current limit. */
  planIds?: Array<string>;
  /** Billing interval the offer is limited to: it cannot be applied to a subscription on another interval, and an applied offer ends when the subscriber changes to one. Null removes the limit. Omit to keep the current limit. */
  billingInterval?:
    | "weekly"
    | "monthly"
    | "quarterly"
    | "semiannual"
    | "yearly"
    | "one_time"
    | null;
}

export class OffersResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /** Retrieve reusable offer terms by public ID. */
  async get(params: GetOfferParams, options?: RequestOptions): Promise<Offer> {
    const { id } = params;
    return this.httpClient.get(`/offers/${id}`, undefined, options);
  }

  /** Replace reusable offer terms. Existing applications keep their immutable accepted terms. */
  async update(
    params: UpdateOfferParams,
    options?: RequestOptions,
  ): Promise<Offer> {
    const { id, ...rest } = params;
    return this.httpClient.patch(`/offers/${id}`, rest, options);
  }

  /** Soft-delete an Offer. Existing applications and their accepted terms remain available for billing and audit. */
  async delete(
    params: DeleteOfferParams,
    options?: RequestOptions,
  ): Promise<DeletedOffer> {
    const { id } = params;
    return this.httpClient.delete(`/offers/${id}`, undefined, options);
  }

  /** List reusable offer terms. Offers are independent from plans, prices, eligibility, and distribution channels. */
  async list(
    params?: ListOffersParams,
    options?: RequestOptions,
  ): Promise<{
    object: "list";
    data: Array<Offer>;
    hasMore: boolean;
    nextCursor?: string;
  }> {
    return this.httpClient.get("/offers", params, options);
  }

  /** Create reusable offer terms. An offer applies to any plan and billing interval unless `planIds` or `billingInterval` limit it. */
  async create(
    params: CreateOfferParams,
    options?: RequestOptions,
  ): Promise<Offer> {
    return this.httpClient.post("/offers", params, options);
  }
}
