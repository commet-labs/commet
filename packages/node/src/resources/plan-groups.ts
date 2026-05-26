import type { ApiResponse, RequestOptions } from "../types/common";
import type { CommetHTTPClient } from "../utils/http";

export interface PlanGroup {
  id: string;
  object: "plan_group";
  livemode: boolean;
  name: string;
  description: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlanGroupDetail extends PlanGroup {
  plans: Array<{ id: string; code: string; name: string; sortOrder: number }>;
}

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
  description?: string;
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

export interface ReorderPlansParams {
  id: string;
  planIds: string[];
}

export class PlanGroupsResource {
  constructor(private httpClient: CommetHTTPClient) {}

  async list(params?: ListPlanGroupsParams): Promise<ApiResponse<PlanGroup[]>> {
    return this.httpClient.get("/plan-groups", params);
  }

  async get(params: GetPlanGroupParams): Promise<ApiResponse<PlanGroupDetail>> {
    return this.httpClient.get(`/plan-groups/${params.id}`);
  }

  async create(
    params: CreatePlanGroupParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<PlanGroup>> {
    return this.httpClient.post("/plan-groups", params, options);
  }

  async update(
    params: UpdatePlanGroupParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<PlanGroup>> {
    const { id, ...body } = params;
    return this.httpClient.put(`/plan-groups/${id}`, body, options);
  }

  /** Plans in the group are unlinked, not deleted. */
  async delete(
    params: DeletePlanGroupParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<void>> {
    return this.httpClient.delete(
      `/plan-groups/${params.id}`,
      undefined,
      options,
    );
  }

  async addPlan(
    params: AddPlanToGroupParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<PlanGroupDetail>> {
    const { id, ...body } = params;
    return this.httpClient.post(`/plan-groups/${id}/plans`, body, options);
  }

  async removePlan(
    params: RemovePlanFromGroupParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<void>> {
    const { id, planId } = params;
    return this.httpClient.delete(
      `/plan-groups/${id}/plans/${planId}`,
      undefined,
      options,
    );
  }

  async reorderPlans(
    params: ReorderPlansParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<PlanGroupDetail>> {
    const { id, ...body } = params;
    return this.httpClient.put(
      `/plan-groups/${id}/plans/reorder`,
      body,
      options,
    );
  }
}
