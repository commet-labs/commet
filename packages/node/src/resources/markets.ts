import type { RequestOptions } from "../types/common";
import type { DeletedObject, Market } from "../types/models";
import type { CommetHTTPClient } from "../utils/http";

export interface GetMarketParams {
  id: string;
}

export interface UpdateMarketParams {
  id: string;
  name: string;
  countryCodes: Array<string>;
  metadata?: Record<string, unknown>;
}

export interface DeleteMarketParams {
  id: string;
}

export interface CreateMarketParams {
  name: string;
  countryCodes: Array<string>;
  metadata?: Record<string, unknown>;
}

export class MarketsResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /** Get one reusable market. */
  async get(
    params: GetMarketParams,
    options?: RequestOptions,
  ): Promise<Market> {
    const { id } = params;
    return this.httpClient.get(`/markets/${id}`, undefined, options);
  }

  /** Replace the name, countries, and metadata of a market. */
  async update(
    params: UpdateMarketParams,
    options?: RequestOptions,
  ): Promise<Market> {
    const { id, ...rest } = params;
    return this.httpClient.patch(`/markets/${id}`, rest, options);
  }

  /** Delete an unused market. Markets referenced by prices or subscriptions cannot be deleted. */
  async delete(
    params: DeleteMarketParams,
    options?: RequestOptions,
  ): Promise<DeletedObject> {
    const { id } = params;
    return this.httpClient.delete(`/markets/${id}`, undefined, options);
  }

  /** List reusable country groups that resolve market-specific prices independently from currency. */
  async list(): Promise<{
    object: "list";
    data: Array<Market>;
    hasMore: boolean;
    nextCursor?: string;
  }> {
    return this.httpClient.get("/markets");
  }

  /** Create a reusable market without attaching it to a plan or price. Countries can belong to only one active market. */
  async create(
    params: CreateMarketParams,
    options?: RequestOptions,
  ): Promise<Market> {
    return this.httpClient.post("/markets", params, options);
  }
}
