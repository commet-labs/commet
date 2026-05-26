import type { ApiResponse } from "../types/common";
import type { CommetHTTPClient } from "../utils/http";

export interface CreditPack {
  id: string;
  object: "credit_pack";
  livemode: boolean;
  name: string;
  description: string | null;
  credits: number;
  price: number;
  currency: string;
}

export class CreditPacksResource {
  constructor(private httpClient: CommetHTTPClient) {}

  async list(): Promise<ApiResponse<CreditPack[]>> {
    return this.httpClient.get("/credit-packs");
  }
}
