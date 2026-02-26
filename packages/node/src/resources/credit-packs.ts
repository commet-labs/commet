import type { ApiResponse } from "../types/common";
import type { CommetHTTPClient } from "../utils/http";

export interface CreditPack {
  id: string;
  name: string;
  description: string | null;
  credits: number;
  price: number;
  currency: string;
}

/**
 * Credit Packs resource for listing available credit packs
 */
export class CreditPacksResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /**
   * List all active credit packs
   *
   * @example
   * ```typescript
   * const packs = await commet.creditPacks.list();
   * console.log(packs.data); // [{ id: "cp_xxx", name: "100 Credits", ... }]
   * ```
   */
  async list(): Promise<ApiResponse<CreditPack[]>> {
    return this.httpClient.get("/credit-packs");
  }
}
