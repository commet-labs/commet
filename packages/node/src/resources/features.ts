import type { ApiResponse, RequestOptions } from "../types/common";
import type { FeatureType } from "../types/enums";
import type { DeletedObject, Feature } from "../types/models";
import type { CommetHTTPClient } from "../utils/http";

export interface GetFeatureParams {
  code: string;
}

export interface CreateFeatureParams {
  name: string;
  code: string;
  type: FeatureType;
  description?: string;
  unitName?: string;
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

export class FeaturesResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /** List every feature defined in the organization. This is the organization's feature catalog (definitions), not a customer's feature access. */
  async list(): Promise<ApiResponse<Array<Feature>>> {
    return this.httpClient.get("/features");
  }

  /** Get a single feature definition by code from the organization's feature catalog. */
  async get(
    params: GetFeatureParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Feature>> {
    const { code } = params;
    return this.httpClient.get(`/features/${code}`, undefined, options);
  }

  /** Create a new feature. Code must be lowercase alphanumeric with underscores. */
  async create(
    params: CreateFeatureParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Feature>> {
    return this.httpClient.post("/features/manage", params, options);
  }

  /** Update a feature's name, description, or unit name. At least one field must be provided. */
  async update(
    params: UpdateFeatureParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Feature>> {
    const { code, ...rest } = params;
    return this.httpClient.put(`/features/${code}/manage`, rest, options);
  }

  /** Delete a feature. Fails if the feature is attached to active plans or has an active add-on. */
  async delete(
    params: DeleteFeatureParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<DeletedObject>> {
    const { code } = params;
    return this.httpClient.delete(
      `/features/${code}/manage`,
      undefined,
      options,
    );
  }
}
