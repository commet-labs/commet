import type { ApiResponse, RequestOptions } from "../types/common";
import type { CreditPack, DeletedObject } from "../types/models";
import type { CommetHTTPClient } from "../utils/http";

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

  /** List all active credit packs. */
  async list(): Promise<ApiResponse<Array<CreditPack>>> {
    return this.httpClient.get("/credit-packs");
  }

  /** Create a new credit pack. */
  async create(
    params: CreateCreditPackParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<CreditPack>> {
    return this.httpClient.post("/credit-packs/manage", params, options);
  }

  /** Update a credit pack's name, description, credits, price, or active status. */
  async update(
    params: UpdateCreditPackParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<CreditPack>> {
    const { id, ...rest } = params;
    return this.httpClient.put(`/credit-packs/${id}`, rest, options);
  }

  /** Soft-delete a credit pack. */
  async delete(
    params: DeleteCreditPackParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<DeletedObject>> {
    const { id } = params;
    return this.httpClient.delete(`/credit-packs/${id}`, undefined, options);
  }
}
