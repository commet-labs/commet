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
}
