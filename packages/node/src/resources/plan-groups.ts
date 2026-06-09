import type { ApiResponse, RequestOptions } from "../types/common";
import type {
  AddedPlanToGroup,
  DeletedObject,
  PlanGroup,
  RemovedPlanFromGroup,
  ReorderedPlans,
} from "../types/models";
import type { CommetHTTPClient } from "../utils/http";

export interface ListPlanGroupsParams {
  limit?: number;
  cursor?: string;
}

export interface GetPlanGroupParams {
  id: string;
}

export interface CreatePlanGroupParams {
  name: string;
  description?: string;
  isPublic?: boolean;
}

export interface UpdatePlanGroupParams {
  id: string;
  name?: string;
  description?: string | null;
  isPublic?: boolean;
}

export interface DeletePlanGroupParams {
  id: string;
}

export interface AddPlanToGroupParams {
  id: string;
  planId: string;
  sortOrder?: number;
}

export interface RemovePlanFromGroupParams {
  id: string;
  planId: string;
}

export interface ReorderPlansInGroupParams {
  id: string;
  planIds: Array<string>;
}

export class PlanGroupsResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /** List plan groups with cursor-based pagination. */
  async list(
    params?: ListPlanGroupsParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Array<PlanGroup>>> {
    return this.httpClient.get("/plan-groups", params, options);
  }

  /** Retrieve a plan group by ID, including its plans ordered by sortOrder. */
  async get(
    params: GetPlanGroupParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<PlanGroup>> {
    const { id } = params;
    return this.httpClient.get(`/plan-groups/${id}`, undefined, options);
  }

  /** Create a new plan group for organizing plans. */
  async create(
    params: CreatePlanGroupParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<PlanGroup>> {
    return this.httpClient.post("/plan-groups", params, options);
  }

  /** Update a plan group's name, description, or visibility. */
  async update(
    params: UpdatePlanGroupParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<PlanGroup>> {
    const { id, ...rest } = params;
    return this.httpClient.put(`/plan-groups/${id}`, rest, options);
  }

  /** Delete a plan group. Plans in the group are unlinked, not deleted. */
  async delete(
    params: DeletePlanGroupParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<DeletedObject>> {
    const { id } = params;
    return this.httpClient.delete(`/plan-groups/${id}`, undefined, options);
  }

  /** Add an existing plan to a plan group with optional sort order. */
  async addPlan(
    params: AddPlanToGroupParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<AddedPlanToGroup>> {
    const { id, ...rest } = params;
    return this.httpClient.post(`/plan-groups/${id}/plans`, rest, options);
  }

  /** Remove a plan from a plan group. */
  async removePlan(
    params: RemovePlanFromGroupParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<RemovedPlanFromGroup>> {
    const { id, planId } = params;
    return this.httpClient.delete(
      `/plan-groups/${id}/plans/${planId}`,
      undefined,
      options,
    );
  }

  /** Set the display order of plans within a group. All plan IDs in the group must be provided. */
  async reorderPlans(
    params: ReorderPlansInGroupParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<ReorderedPlans>> {
    const { id, ...rest } = params;
    return this.httpClient.put(
      `/plan-groups/${id}/plans/reorder`,
      rest,
      options,
    );
  }
}
