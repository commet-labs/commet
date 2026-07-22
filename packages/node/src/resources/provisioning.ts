import type { ApiResponse, RequestOptions } from "../types/common";
import type { ClaimLink } from "../types/models";
import type { CommetHTTPClient } from "../utils/http";

export class ProvisioningResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /** Issue a fresh claim link for an organization that was provisioned headlessly and has not been claimed yet. Any previously issued link stops working. */
  async createClaimLink(
    options?: RequestOptions,
  ): Promise<ApiResponse<ClaimLink>> {
    return this.httpClient.post("/claim-link", {}, options);
  }
}
