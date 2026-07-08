import type { ApiResponse, RequestOptions } from "../types/common";
import type { PortalAccess } from "../types/models";
import type { CommetHTTPClient } from "../utils/http";

export interface RequestPortalAccessParams {
  email?: string;
  customerId?: string;
  returnUrl?: string;
}

export class PortalResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /** Generate a customer portal URL. Exactly one identifier (email or customerId) is required. */
  async getUrl(
    params?: RequestPortalAccessParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<PortalAccess>> {
    return this.httpClient.post("/portal/request-access", params, options);
  }
}
