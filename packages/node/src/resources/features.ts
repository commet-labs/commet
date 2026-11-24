import type { RequestOptions } from "../types/common";
import type { DeletedObject, Feature } from "../types/models";
import type { CommetHTTPClient } from "../utils/http";

export interface GetFeatureParams {
  code: string;
}

export interface UpdateFeatureParams {
  code: string;
  name?: string;
  description?: string | null;
  unitName?: string | null;
}

export interface DeleteFeatureParams {
  code: string;
}

export interface CreateFeatureParams {
  name: string;
  code: string;
  type: "boolean" | "usage" | "seats" | "quota";
  description?: string;
  unitName?: string;
}

export class FeaturesResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /** Get a single feature definition by code from the organization's feature catalog. */
  async get(
    params: GetFeatureParams,
    options?: RequestOptions,
  ): Promise<Feature> {
    const { code } = params;
    return this.httpClient.get(`/features/${code}`, undefined, options);
  }

  /** Update a feature's name, description, or unit name. At least one field must be provided. */
  async update(
    params: UpdateFeatureParams,
    options?: RequestOptions,
  ): Promise<Feature> {
    const { code, ...rest } = params;
    return this.httpClient.patch(`/features/${code}`, rest, options);
  }

  /** Delete a feature. Fails while a plan's current version, a running experiment or a draft includes it, or while it has an active add-on. Subscribers whose plan version includes it keep it, and its code can be used by a new feature right away. */
  async delete(
    params: DeleteFeatureParams,
    options?: RequestOptions,
  ): Promise<DeletedObject> {
    const { code } = params;
    return this.httpClient.delete(`/features/${code}`, undefined, options);
  }

  /** List every feature defined in the organization. This is the organization's feature catalog (definitions), not a customer's feature access. */
  async list(): Promise<{
    object: "list";
    data: Array<Feature>;
    hasMore: boolean;
    nextCursor?: string;
  }> {
    return this.httpClient.get("/features");
  }

  /** Create a new feature. Code must be lowercase alphanumeric with underscores. */
  async create(
    params: CreateFeatureParams,
    options?: RequestOptions,
  ): Promise<Feature> {
    return this.httpClient.post("/features", params, options);
  }
}
