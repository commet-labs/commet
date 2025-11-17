import type { ApiResponse, CustomerID, RequestOptions } from "../types/common";
import type { CommetHTTPClient } from "../utils/http";

/**
 * Portal access response
 */
export interface PortalAccess {
  success: boolean;
  message: string;
  portalUrl: string;
}

/**
 * Request portal access by customer ID
 */
interface RequestAccessByCustomerId {
  customerId: CustomerID;
  email?: never;
  externalId?: never;
}

/**
 * Request portal access by external ID
 */
interface RequestAccessByExternalId {
  externalId: string;
  email?: never;
  customerId?: never;
}

/**
 * Request portal access by email
 */
interface RequestAccessByEmail {
  email: string;
  customerId?: never;
  externalId?: never;
}

/**
 * Portal access parameters
 */
export type RequestAccessParams =
  | RequestAccessByCustomerId
  | RequestAccessByExternalId
  | RequestAccessByEmail;

/**
 * Customer Portal resource for generating customer portal access
 */
export class PortalResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /**
   * Request portal access for a customer
   *
   * Generates a secure portal URL that can be sent to the customer via email or used directly.
   * The URL contains a time-limited token for secure access to the customer portal.
   *
   * @param params - customerId, externalId, or email
   * @param options - Request options (idempotency, timeout)
   * @returns Portal access response with URL
   *
   * @example
   * // External ID (recommended)
   * const portal = await commet.portal.requestAccess({
   *   externalId: 'my-customer-123'
   * });
   *
   * @example
   * // Customer ID
   * const portal = await commet.portal.requestAccess({
   *   customerId: 'cus_123'
   * });
   *
   * @example
   * // Email
   * const portal = await commet.portal.requestAccess({
   *   email: 'customer@example.com'
   * });
   */
  async requestAccess(
    params: RequestAccessParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<PortalAccess>> {
    return this.httpClient.post("/portal/request-access", params, options);
  }
}
