import type { RequestOptions } from "../types/common";
import type { ApiKey, CreatedApiKey, DeletedObject } from "../types/models";
import type { CommetHTTPClient } from "../utils/http";

export interface DeleteApiKeyParams {
  id: string;
}

export interface ListApiKeysParams {
  cursor?: string;
  limit?: number;
}

export interface CreateApiKeyParams {
  name: string;
  expiresInDays?: number;
}

export class ApiKeysResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /** Permanently revoke and delete an API key. */
  async delete(
    params: DeleteApiKeyParams,
    options?: RequestOptions,
  ): Promise<DeletedObject> {
    const { id } = params;
    return this.httpClient.delete(`/api-keys/${id}`, undefined, options);
  }

  /** List API keys with cursor-based pagination. Keys are returned without the full secret. */
  async list(
    params?: ListApiKeysParams,
    options?: RequestOptions,
  ): Promise<{
    object: "list";
    data: Array<ApiKey>;
    hasMore: boolean;
    nextCursor?: string;
  }> {
    return this.httpClient.get("/api-keys", params, options);
  }

  /** Create a new API key. The full key is only returned once in the response. */
  async create(
    params: CreateApiKeyParams,
    options?: RequestOptions,
  ): Promise<CreatedApiKey> {
    return this.httpClient.post("/api-keys", params, options);
  }
}
