import type {
  ApiResponse,
  CustomerID,
  GeneratedFeatureCode,
  RequestOptions,
} from "../types/common";
import type { CommetHTTPClient } from "../utils/http";

export interface FeatureParams {
  customerId: CustomerID;
  code: GeneratedFeatureCode;
}

export type GetFeatureParams = FeatureParams;
export type CheckFeatureParams = FeatureParams;
export type CanUseFeatureParams = FeatureParams;

export interface FeatureAccess {
  code: string;
  name: string;
  type: "boolean" | "metered" | "seats";
  allowed: boolean;
  enabled?: boolean;
  current?: number;
  included?: number;
  remaining?: number;
  overage?: number;
  overageUnitPrice?: number;
  unlimited?: boolean;
  overageEnabled?: boolean;
}

export interface CanUseResult {
  allowed: boolean;
  willBeCharged: boolean;
  reason?: string;
}

export interface CheckResult {
  allowed: boolean;
}

export class FeaturesResource {
  constructor(private httpClient: CommetHTTPClient) {}

  async get(
    params: GetFeatureParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<FeatureAccess>> {
    return this.httpClient.get(
      `/features/${params.code}`,
      { customerId: params.customerId },
      options,
    );
  }

  async check(
    params: CheckFeatureParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<CheckResult>> {
    const result = await this.httpClient.get<FeatureAccess>(
      `/features/${params.code}`,
      { customerId: params.customerId },
      options,
    );

    if (!result.success || !result.data) {
      return {
        success: false,
        code: result.code,
        message: result.message,
        details: result.details,
      };
    }

    return {
      success: true,
      data: { allowed: result.data.allowed },
    };
  }

  async canUse(
    params: CanUseFeatureParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<CanUseResult>> {
    return this.httpClient.get(
      `/features/${params.code}`,
      { customerId: params.customerId, action: "canUse" },
      options,
    );
  }

  async list(
    customerId: CustomerID,
    options?: RequestOptions,
  ): Promise<ApiResponse<FeatureAccess[]>> {
    return this.httpClient.get("/features", { customerId }, options);
  }
}
