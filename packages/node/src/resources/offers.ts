import type { RequestOptions } from "../types/common";
import type { DeletedOffer, Offer } from "../types/models";
import type { CommetHTTPClient } from "../utils/http";

export interface GetOfferParams {
  id: string;
}

export interface UpdateOfferParams {
  id: string;
  name: string;
  purpose: "introductory" | "promotional";
  planPriceIds: Array<string>;
  phases: Array<
    | {
        type: "free_trial";
        durationDays: number;
      }
    | {
        type: "percentage";
        durationCycles: number;
        /** Discount in basis points. 5000 means 50%. */
        percentage: number;
      }
    | {
        type: "amount_off";
        durationCycles: number;
        amounts: Array<{
          currency: string;
          /** Amount in the currency's minor unit (for example, cents for USD). */
          amount: number;
        }>;
      }
    | {
        type: "fixed_price";
        durationCycles: number;
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
}

export interface DeleteOfferParams {
  id: string;
}

export interface ListOffersParams {
  cursor?: string;
  limit?: number;
  planPriceId?: string;
  purpose?: "introductory" | "promotional";
  active?: boolean;
}

export interface CreateOfferParams {
  name: string;
  purpose: "introductory" | "promotional";
  planPriceIds: Array<string>;
  phases: Array<
    | {
        type: "free_trial";
        durationDays: number;
      }
    | {
        type: "percentage";
        durationCycles: number;
        /** Discount in basis points. 5000 means 50%. */
        percentage: number;
      }
    | {
        type: "amount_off";
        durationCycles: number;
        amounts: Array<{
          currency: string;
          /** Amount in the currency's minor unit (for example, cents for USD). */
          amount: number;
        }>;
      }
    | {
        type: "fixed_price";
        durationCycles: number;
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
}

export class OffersResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /** Retrieve a canonical offer by its public ID. */
  async get(params: GetOfferParams, options?: RequestOptions): Promise<Offer> {
    const { id } = params;
    return this.httpClient.get(`/offers/${id}`, undefined, options);
  }

  /** Replace an offer's catalog definition. Existing offer applications keep their immutable accepted terms. */
  async update(
    params: UpdateOfferParams,
    options?: RequestOptions,
  ): Promise<Offer> {
    const { id, ...rest } = params;
    return this.httpClient.patch(`/offers/${id}`, rest, options);
  }

  /** Soft-delete an offer. Existing applications and their accepted terms remain available for billing and audit. */
  async delete(
    params: DeleteOfferParams,
    options?: RequestOptions,
  ): Promise<DeletedOffer> {
    const { id } = params;
    return this.httpClient.delete(`/offers/${id}`, undefined, options);
  }

  /** List the organization's canonical introductory and promotional offers. */
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

  /** Create a canonical offer scoped to one or more plan prices. Currency-specific phases require an explicit USD value and never fall back across currencies. */
  async create(
    params: CreateOfferParams,
    options?: RequestOptions,
  ): Promise<Offer> {
    return this.httpClient.post("/offers", params, options);
  }
}
