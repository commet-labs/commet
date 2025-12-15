import type {
  ApiResponse,
  GeneratedFeatureCode,
  RequestOptions,
} from "../types/common";
import type { CommetHTTPClient } from "../utils/http";

export interface FeatureParams {
  externalId: string;
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
  // For boolean features
  enabled?: boolean;
  // For metered/seats features
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

/**
 * Features resource for checking feature access and usage
 *
 * Provides a clean API to check if a customer can use a feature
 * without having to manually parse subscription data.
 */
export class FeaturesResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /**
   * Get detailed feature access/usage for a customer
   *
   * @example
   * ```typescript
   * const seats = await commet.features.get({ code: "team_members", externalId: "user_123" });
   * console.log(seats.current, seats.included, seats.remaining);
   * ```
   */
  async get(
    params: GetFeatureParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<FeatureAccess>> {
    const { code, externalId } = params;

    return this.httpClient.get(
      `/features/${code}`,
      { externalId: externalId },
      options,
    );
  }

  /**
   * Check if a boolean feature is enabled for a customer
   *
   * @example
   * ```typescript
   * const { allowed } = await commet.features.check({
   *   code: "custom_branding",
   *   externalId: "user_123"
   * });
   * if (!allowed) redirect("/upgrade");
   * ```
   */
  async check(
    params: CheckFeatureParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<CheckResult>> {
    const { code, externalId } = params;

    const result = await this.httpClient.get<FeatureAccess>(
      `/features/${code}`,
      { externalId: externalId },
      options,
    );

    if (!result.success || !result.data) {
      return {
        success: false,
        data: { allowed: false },
        message: result.message,
      };
    }

    return {
      success: true,
      data: { allowed: result.data.allowed },
      message: result.message,
    };
  }

  /**
   * Check if customer can use one more unit of a feature
   *
   * Returns whether the customer can add one more (allowed)
   * and whether they'll be charged extra (willBeCharged).
   *
   * @example
   * ```typescript
   * const { allowed, willBeCharged } = await commet.features.canUse({
   *   code: "team_members",
   *   externalId: "user_123"
   * });
   *
   * if (!allowed) {
   *   return { error: "Upgrade to add more members" };
   * }
   *
   * if (willBeCharged) {
   *   // Show confirmation: "This will cost $10/month extra"
   * }
   * ```
   */
  async canUse(
    params: CanUseFeatureParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<CanUseResult>> {
    const { code, externalId } = params;

    return this.httpClient.get(
      `/features/${code}`,
      { externalId: externalId, action: "canUse" },
      options,
    );
  }

  /**
   * List all features for a customer's active subscription
   *
   * @example
   * ```typescript
   * const features = await commet.features.list({ externalId: "user_123" });
   * for (const feature of features) {
   *   console.log(feature.code, feature.allowed);
   * }
   * ```
   */
  async list(
    externalId: string,
    options?: RequestOptions,
  ): Promise<ApiResponse<FeatureAccess[]>> {
    return this.httpClient.get("/features", { externalId }, options);
  }
}
