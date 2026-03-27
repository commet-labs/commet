import type { ApiResponse, RequestOptions } from "../types/common";
import type { CommetHTTPClient } from "../utils/http";

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

export class AddonsResource {
  constructor(private httpClient: CommetHTTPClient) {}

  async listActive(
    params: { externalId?: string; customerId?: string },
    options?: RequestOptions,
  ): Promise<ApiResponse<ActiveAddon[]>> {
    return this.httpClient.get("/addons/active", params, options);
  }
}
