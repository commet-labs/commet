import type { ApiResponse, CustomerID, RequestOptions } from "../types/common";
import type { CommetHTTPClient } from "../utils/http";

export interface PortalAccess {
  success: boolean;
  message: string;
  portalUrl: string;
}

interface GetUrlByCustomerId {
  customerId: CustomerID;
  email?: never;
}

interface GetUrlByEmail {
  email: string;
  customerId?: never;
}

export type GetUrlParams = GetUrlByCustomerId | GetUrlByEmail;

export class PortalResource {
  constructor(private httpClient: CommetHTTPClient) {}

  async getUrl(
    params: GetUrlParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<PortalAccess>> {
    return this.httpClient.post("/portal/request-access", params, options);
  }
}
