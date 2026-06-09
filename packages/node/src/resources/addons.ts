import type { ApiResponse, RequestOptions } from "../types/common";
import type { ActiveAddon, Addon, DeletedObject } from "../types/models";
import type { CommetHTTPClient } from "../utils/http";

export interface ListActiveAddonsParams {
  customerId?: string;
}

export interface ListAddonsParams {
  limit?: number;
  cursor?: string;
}

export interface GetAddonParams {
  id: string;
}

export interface CreateAddonParams {
  name: string;
  description?: string;
  basePrice: number;
  featureId: string;
  consumptionModel: "boolean" | "metered" | "credits" | "balance";
  includedUnits?: number;
  overageRate?: number;
  creditCost?: number;
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

export class AddonsResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /** List all active add-ons for a customer's subscription. */
  async listActive(
    params?: ListActiveAddonsParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Array<ActiveAddon>>> {
    return this.httpClient.get("/addons/active", params, options);
  }

  /** List all add-ons with cursor-based pagination. */
  async list(
    params?: ListAddonsParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Array<Addon>>> {
    return this.httpClient.get("/addons", params, options);
  }

  /** Retrieve an add-on by its public ID or slug. */
  async get(
    params: GetAddonParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Addon>> {
    const { id } = params;
    return this.httpClient.get(`/addons/${id}`, undefined, options);
  }

  /** Create a new add-on linked to a feature. Each feature can only be assigned to one add-on. */
  async create(
    params: CreateAddonParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Addon>> {
    return this.httpClient.post("/addons", params, options);
  }

  /** Update an add-on's name, description, or pricing. */
  async update(
    params: UpdateAddonParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Addon>> {
    const { id, ...rest } = params;
    return this.httpClient.put(`/addons/${id}`, rest, options);
  }

  /** Soft-delete an add-on. Fails if the add-on has active subscriptions. */
  async delete(
    params: DeleteAddonParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<DeletedObject>> {
    const { id } = params;
    return this.httpClient.delete(`/addons/${id}`, undefined, options);
  }
}
