import type { RequestOptions } from "../types/common";
import type { ActiveAddon, Addon, DeletedObject } from "../types/models";
import type { CommetHTTPClient } from "../utils/http";

export interface ListActiveAddonsParams {
  customerId: string;
}

export interface GetAddonParams {
  id: string;
}

export interface UpdateAddonParams {
  id: string;
  name?: string;
  description?: string;
  basePrice?: number;
  includedUnits?: number;
  overageRate?: number;
}

export interface DeleteAddonParams {
  id: string;
}

export interface ListAddonsParams {
  cursor?: string;
  limit?: number;
}

export type CreateAddonParams =
  | {
      name: string;
      description?: string;
      basePrice: number;
      featureId: string;
      consumptionModel: "boolean";
    }
  | {
      name: string;
      description?: string;
      basePrice: number;
      featureId: string;
      consumptionModel: "metered";
      includedUnits: number;
      overageRate: number;
    }
  | {
      name: string;
      description?: string;
      basePrice: number;
      featureId: string;
      consumptionModel: "credits";
      creditCost: number;
    }
  | {
      name: string;
      description?: string;
      basePrice: number;
      featureId: string;
      consumptionModel: "balance";
      overageRate: number;
    };

export class AddonsResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /** List all active add-ons for a customer's subscription. */
  async listActive(
    params: ListActiveAddonsParams,
    options?: RequestOptions,
  ): Promise<{
    object: "list";
    data: Array<ActiveAddon>;
    hasMore: boolean;
    nextCursor?: string;
  }> {
    return this.httpClient.get("/active-addons", params, options);
  }

  /** Retrieve an add-on by its public ID or slug. */
  async get(params: GetAddonParams, options?: RequestOptions): Promise<Addon> {
    const { id } = params;
    return this.httpClient.get(`/addons/${id}`, undefined, options);
  }

  /** Update an add-on's name, description, or pricing. */
  async update(
    params: UpdateAddonParams,
    options?: RequestOptions,
  ): Promise<Addon> {
    const { id, ...rest } = params;
    return this.httpClient.patch(`/addons/${id}`, rest, options);
  }

  /** Soft-delete an add-on. Fails if the add-on has active subscriptions. */
  async delete(
    params: DeleteAddonParams,
    options?: RequestOptions,
  ): Promise<DeletedObject> {
    const { id } = params;
    return this.httpClient.delete(`/addons/${id}`, undefined, options);
  }

  /** List all add-ons with cursor-based pagination. */
  async list(
    params?: ListAddonsParams,
    options?: RequestOptions,
  ): Promise<{
    object: "list";
    data: Array<Addon>;
    hasMore: boolean;
    nextCursor?: string;
  }> {
    return this.httpClient.get("/addons", params, options);
  }

  /** Create a new add-on linked to a feature. Each feature can only be assigned to one add-on. */
  async create(
    params: CreateAddonParams,
    options?: RequestOptions,
  ): Promise<Addon> {
    return this.httpClient.post("/addons", params, options);
  }
}
