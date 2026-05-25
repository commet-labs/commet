import type { ApiResponse, CustomerID, RequestOptions } from "../types/common";
import type { CommetHTTPClient } from "../utils/http";

export interface ActiveAddon {
  slug: string;
  name: string;
  basePrice: number;
  featureCode: string;
  featureName: string;
  featureType: string;
  consumptionModel: string | null;
  activatedAt: string;
}

export interface GetActiveAddonsParams {
  customerId: CustomerID;
}

export class AddonsResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /**
   * Get active addons for a customer's subscription
   *
   * @example
   * ```typescript
   * const { data } = await commet.addons.getActive({
   *   customerId: 'cus_xxx',
   * });
   * ```
   */
  async getActive(
    params: GetActiveAddonsParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<ActiveAddon[]>> {
    return this.httpClient.get(
      "/addons/active",
      { customerId: params.customerId },
      options,
    );
  }
}
