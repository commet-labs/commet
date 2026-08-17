import type { RequestOptions } from "../types/common";
import type { PortalAccess } from "../types/models";
import type { CommetHTTPClient } from "../utils/http";

export type RequestPortalAccessParams =
  | {
      email: string;
      returnUrl?: string;
    }
  | {
      customerId: string;
      returnUrl?: string;
    };

export class PortalResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /** Generate a customer portal URL. Exactly one identifier (email or customerId) is required. */
  async getUrl(
    params: RequestPortalAccessParams,
    options?: RequestOptions,
  ): Promise<PortalAccess> {
    return this.httpClient.post("/portal/sessions", params, options);
  }
}
