import type { ApiResponse, RequestOptions } from "../types/common";
import type { CommetHTTPClient } from "../utils/http";

export interface ApiKey {
  id: string;
  object: "api_key";
  livemode: boolean;
  name: string;
  prefix: string;
  expiresAt: string | null;
  lastUsedAt: string | null;
  createdAt: string;
}

export interface ApiKeyCreated extends ApiKey {
  apiKey: string;
}

export interface ListApiKeysParams {
  limit?: number;
  cursor?: string;
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

  async list(params?: ListApiKeysParams): Promise<ApiResponse<ApiKey[]>> {
    return this.httpClient.get("/api-keys", params);
  }

  /** Response includes full `apiKey` which is only returned once. */
  async create(
    params: CreateApiKeyParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<ApiKeyCreated>> {
    return this.httpClient.post("/api-keys", params, options);
  }

  async delete(
    params: DeleteApiKeyParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<void>> {
    return this.httpClient.delete(`/api-keys/${params.id}`, undefined, options);
  }
}
