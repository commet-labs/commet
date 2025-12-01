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
  externalId?: never;
}

interface GetUrlByExternalId {
  externalId: string;
  email?: never;
  customerId?: never;
}

interface GetUrlByEmail {
  email: string;
  customerId?: never;
  externalId?: never;
}

export type GetUrlParams =
  | GetUrlByCustomerId
  | GetUrlByExternalId
  | GetUrlByEmail;

/**
 * Portal resource - Generate customer portal access
 */
export class PortalResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /**
   * Get a portal URL
   *
   * @example
   * ```typescript
   * const portal = await commet.portal.getUrl({ externalId: 'user_123' });
   * ```
   */
  async getUrl(
    params: GetUrlParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<PortalAccess>> {
    return this.httpClient.post("/portal/request-access", params, options);
  }
}
