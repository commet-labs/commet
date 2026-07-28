import type { RequestOptions } from "../types/common";
import type { DeletedObject, MarketGroup } from "../types/models";
import type { CommetHTTPClient } from "../utils/http";

export interface GetMarketGroupParams {
  id: string;
}

export interface UpdateMarketGroupParams {
  id: string;
  name: string;
  countryCodes: Array<string>;
  metadata?: Record<string, unknown>;
}

export interface DeleteMarketGroupParams {
  id: string;
}

export interface CreateMarketGroupParams {
  name: string;
  countryCodes: Array<string>;
  metadata?: Record<string, unknown>;
}

export class PricingResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /** Get one reusable pricing market group. */
  async getMarketGroup(
    params: GetMarketGroupParams,
    options?: RequestOptions,
  ): Promise<MarketGroup> {
    const { id } = params;
    return this.httpClient.get(
      `/pricing/market-groups/${id}`,
      undefined,
      options,
    );
  }

  /** Replace the name, countries, and metadata of a pricing market group. */
  async updateMarketGroup(
    params: UpdateMarketGroupParams,
    options?: RequestOptions,
  ): Promise<MarketGroup> {
    const { id, ...rest } = params;
    return this.httpClient.patch(`/pricing/market-groups/${id}`, rest, options);
  }

  /** Delete an unused pricing market group. Groups referenced by prices or subscriptions cannot be deleted. */
  async deleteMarketGroup(
    params: DeleteMarketGroupParams,
    options?: RequestOptions,
  ): Promise<DeletedObject> {
    const { id } = params;
    return this.httpClient.delete(
      `/pricing/market-groups/${id}`,
      undefined,
      options,
    );
  }

  /** List reusable country groups used to resolve market-specific prices independently from currency. */
  async listMarketGroups(): Promise<{
    object: "list";
    data: Array<MarketGroup>;
    hasMore: boolean;
    nextCursor?: string;
  }> {
    return this.httpClient.get("/pricing/market-groups");
  }

  /** Create a reusable country group. Countries can belong to only one active group; each price chooses its currency independently. */
  async createMarketGroup(
    params: CreateMarketGroupParams,
    options?: RequestOptions,
  ): Promise<MarketGroup> {
    return this.httpClient.post("/pricing/market-groups", params, options);
  }
}
