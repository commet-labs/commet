import type { ApiResponse, CustomerID, RequestOptions } from "../types/common";
import type { CommetHTTPClient } from "../utils/http";

export interface ActiveAddon {
  object: "addon";
  livemode: boolean;
  slug: string;
  name: string;
  basePrice: number;
  featureCode: string;
  featureName: string;
  featureType: string;
  consumptionModel: string | null;
  activatedAt: string;
}

export interface ListActiveAddonsParams {
  customerId: CustomerID;
}

export interface Addon {
  id: string;
  object: "addon";
  livemode: boolean;
  name: string;
  slug: string;
  description: string | null;
  basePrice: number;
  consumptionModel: string | null;
  featureCode: string;
  featureName: string;
  includedUnits: number | null;
  overageRate: number | null;
  creditCost: number | null;
  createdAt: string;
  updatedAt: string;
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
  consumptionModel?: string;
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

  async listActive(
    params: ListActiveAddonsParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<ActiveAddon[]>> {
    return this.httpClient.get(
      "/addons/active",
      { customerId: params.customerId },
      options,
    );
  }

  async list(
    params?: ListAddonsParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Addon[]>> {
    return this.httpClient.get("/addons", params, options);
  }

  async get(
    params: GetAddonParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Addon>> {
    const { id } = params;
    return this.httpClient.get(`/addons/${id}`, undefined, options);
  }

  async create(
    params: CreateAddonParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Addon>> {
    return this.httpClient.post("/addons", params, options);
  }

  async update(
    params: UpdateAddonParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Addon>> {
    const { id, ...body } = params;
    return this.httpClient.put(`/addons/${id}`, body, options);
  }

  /** Fails if addon has active subscriptions. */
  async delete(
    params: DeleteAddonParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<{ id: string; deleted: true }>> {
    const { id } = params;
    return this.httpClient.delete(`/addons/${id}`, undefined, options);
  }
}
