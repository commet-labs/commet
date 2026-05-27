import type { ApiResponse, RequestOptions } from "../types/common";
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

export interface CreditPackDetail {
  id: string;
  object: "credit_pack";
  livemode: boolean;
  name: string;
  description: string | null;
  credits: number;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCreditPackParams {
  name: string;
  description?: string;
  credits: number;
  price: number;
  isActive?: boolean;
}

export interface UpdateCreditPackParams {
  id: string;
  name?: string;
  description?: string;
  credits?: number;
  price?: number;
  isActive?: boolean;
}

export interface DeleteCreditPackParams {
  id: string;
}

export class CreditPacksResource {
  constructor(private httpClient: CommetHTTPClient) {}

  async list(): Promise<ApiResponse<CreditPack[]>> {
    return this.httpClient.get("/credit-packs");
  }

  async create(
    params: CreateCreditPackParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<CreditPackDetail>> {
    return this.httpClient.post("/credit-packs/manage", params, options);
  }

  async update(
    params: UpdateCreditPackParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<CreditPackDetail>> {
    const { id, ...body } = params;
    return this.httpClient.put(`/credit-packs/${id}`, body, options);
  }

  async delete(
    params: DeleteCreditPackParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<{ id: string; deleted: true }>> {
    const { id } = params;
    return this.httpClient.delete(`/credit-packs/${id}`, undefined, options);
  }
}
