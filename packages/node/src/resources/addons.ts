import type { ApiResponse, RequestOptions } from "../types/common";
import type { CommetHTTPClient } from "../utils/http";

export interface Addon {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  basePrice: number;
  consumptionModel: string;
  featureCode: string;
  featureName: string;
  featureType: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActiveAddon {
  slug: string;
  name: string;
  basePrice: number;
  featureCode: string;
  featureName: string;
  featureType: string;
  consumptionModel: string;
  activatedAt: string;
}

export interface AddonActivationResult {
  addonSlug: string;
  addonName: string;
  status: string;
  proratedCharge: number;
  activatedAt: string;
}

export interface AddonDeactivationResult {
  addonSlug: string;
  addonName: string;
  status: string;
  deactivatedAt: string;
}

export interface ActivateAddonParams {
  externalId: string;
  slug: string;
}

export interface DeactivateAddonParams {
  externalId: string;
  slug: string;
}

export class AddonsResource {
  constructor(private httpClient: CommetHTTPClient) {}

  async list(options?: RequestOptions): Promise<ApiResponse<Addon[]>> {
    return this.httpClient.get("/addons", undefined, options);
  }

  async get(
    slug: string,
    options?: RequestOptions,
  ): Promise<ApiResponse<Addon>> {
    return this.httpClient.get(`/addons/${slug}`, undefined, options);
  }

  async activate(
    params: ActivateAddonParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<AddonActivationResult>> {
    return this.httpClient.post("/addons/activate", params, options);
  }

  async deactivate(
    params: DeactivateAddonParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<AddonDeactivationResult>> {
    return this.httpClient.post("/addons/deactivate", params, options);
  }

  async listActive(
    externalId: string,
    options?: RequestOptions,
  ): Promise<ApiResponse<ActiveAddon[]>> {
    return this.httpClient.get("/addons/active", { externalId }, options);
  }
}
