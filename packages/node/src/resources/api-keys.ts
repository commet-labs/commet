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
  permissions?: {
    customer?: Array<"read"> | ["read", "write"] | ["write", "read"];
    subscription?: Array<"read"> | ["read", "write"] | ["write", "read"];
    invoice?: Array<"read"> | ["read", "write"] | ["write", "read"];
    usage?: Array<"read"> | ["read", "write"] | ["write", "read"];
    seat?: Array<"read"> | ["read", "write"] | ["write", "read"];
    plan?: Array<"read"> | ["read", "write"] | ["write", "read"];
    plan_group?: Array<"read"> | ["read", "write"] | ["write", "read"];
    feature?: Array<"read"> | ["read", "write"] | ["write", "read"];
    addon?: Array<"read"> | ["read", "write"] | ["write", "read"];
    credit_pack?: Array<"read"> | ["read", "write"] | ["write", "read"];
    offer?: Array<"read"> | ["read", "write"] | ["write", "read"];
    promo_code?: Array<"read"> | ["read", "write"] | ["write", "read"];
    market_group?: Array<"read"> | ["read", "write"] | ["write", "read"];
    payment?: Array<"read"> | ["read", "write"] | ["write", "read"];
    transaction?: Array<"read"> | ["read", "write"] | ["write", "read"];
    payout?: Array<"read"> | ["read", "write"] | ["write", "read"];
    test_clock?: Array<"read"> | ["read", "write"] | ["write", "read"];
    organization?: Array<"read"> | ["read", "write"] | ["write", "read"];
    api_key?: Array<"read"> | ["read", "write"] | ["write", "read"];
  };
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

  /** Create a full-access or restricted API key. Provide permissions to restrict access; the full key is returned only once. A restricted key with api_key: write may only create restricted keys with the same or fewer permissions, and they expire no later than the key that creates them. */
  async create(
    params: CreateApiKeyParams,
    options?: RequestOptions,
  ): Promise<CreatedApiKey> {
    return this.httpClient.post("/api-keys", params, options);
  }
}
