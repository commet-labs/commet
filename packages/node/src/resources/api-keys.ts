import type { ApiResponse, RequestOptions } from "../types/common";
import type { ApiKey, CreatedApiKey, DeletedObject } from "../types/models";
import type { CommetHTTPClient } from "../utils/http";

export interface ListApiKeysParams {
  /** @format date-time */
  cursor?: string;
  limit?: number;
}

export interface CreateApiKeyParams {
  name: string;
  expiresInDays?: number;
}

export interface DeleteApiKeyParams {
  id: string;
}

export class ApiKeysResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /** List API keys with cursor-based pagination. Keys are returned without the full secret. */
  async list(
    params?: ListApiKeysParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Array<ApiKey>>> {
    return this.httpClient.get("/api-keys", params, options);
  }

  /** Create a new API key. The full key is only returned once in the response. */
  async create(
    params: CreateApiKeyParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<CreatedApiKey>> {
    return this.httpClient.post("/api-keys", params, options);
  }

  /** Permanently revoke and delete an API key. */
  async delete(
    params: DeleteApiKeyParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<DeletedObject>> {
    const { id } = params;
    return this.httpClient.delete(`/api-keys/${id}`, undefined, options);
  }
}
