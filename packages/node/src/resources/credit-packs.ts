import type { RequestOptions } from "../types/common";
import type {
  CreditPack,
  CreditPackListItem,
  DeletedObject,
} from "../types/models";
import type { CommetHTTPClient } from "../utils/http";

export interface UpdateCreditPackParams {
  id: string;
  name?: string;
  description?: string;
  credits?: number;
  price?: number;
  isActive?: boolean;
  /** Plans that sell the credit pack, replacing the current ones. Empty means every plan; omitted keeps them. */
  planIds?: Array<string>;
}

export interface DeleteCreditPackParams {
  id: string;
}

export interface CreateCreditPackParams {
  name: string;
  description?: string;
  credits: number;
  price: number;
  isActive?: boolean;
  /** Plans that sell the credit pack. Omitted or empty, every plan sells it. Plans created later sell it too. */
  planIds?: Array<string>;
}

export class CreditPacksResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /** Update a credit pack's name, description, credits, price, active status, or the plans that sell it. */
  async update(
    params: UpdateCreditPackParams,
    options?: RequestOptions,
  ): Promise<CreditPack> {
    const { id, ...rest } = params;
    return this.httpClient.patch(`/credit-packs/${id}`, rest, options);
  }

  /** Soft-delete a credit pack. */
  async delete(
    params: DeleteCreditPackParams,
    options?: RequestOptions,
  ): Promise<DeletedObject> {
    const { id } = params;
    return this.httpClient.delete(`/credit-packs/${id}`, undefined, options);
  }

  /** List all active credit packs. */
  async list(): Promise<{
    object: "list";
    data: Array<CreditPackListItem>;
    hasMore: boolean;
    nextCursor?: string;
  }> {
    return this.httpClient.get("/credit-packs");
  }

  /** Create a new credit pack. */
  async create(
    params: CreateCreditPackParams,
    options?: RequestOptions,
  ): Promise<CreditPack> {
    return this.httpClient.post("/credit-packs", params, options);
  }
}
