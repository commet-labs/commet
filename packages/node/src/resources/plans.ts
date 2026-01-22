import type {
  ApiResponse,
  GeneratedPlanCode,
  ListParams,
} from "../types/common";
import type { CommetHTTPClient } from "../utils/http";

export type PlanID = `plan_${string}`;
export type BillingInterval = "monthly" | "quarterly" | "yearly";
export type FeatureType = "boolean" | "metered" | "seats";

export interface PlanPrice {
  billingInterval: BillingInterval;
  price: number; // in cents
  isDefault: boolean;
}

export interface PlanFeature {
  code: string;
  name: string;
  type: FeatureType;
  enabled?: boolean;
  includedAmount?: number;
  unlimited?: boolean;
  overageEnabled?: boolean;
  overageUnitPrice?: number;
}

export interface Plan {
  id: PlanID;
  code: string;
  name: string;
  description?: string;
  isPublic: boolean;
  isDefault: boolean;
  trialDays: number;
  sortOrder: number;
  prices: PlanPrice[];
  features: PlanFeature[];
  createdAt: string;
}

export interface PlanDetail extends Plan {
  features: Array<
    PlanFeature & {
      unitName?: string;
      overage?: {
        enabled: boolean;
        model: "per_unit" | "tiered";
        unitPrice: number;
        tiers?: Array<{
          order: number;
          upTo: number | null;
          unitAmount: number;
          flatFee: number;
        }>;
      } | null;
    }
  >;
  updatedAt: string;
}

export interface ListPlansParams extends ListParams {
  includePrivate?: boolean;
}

/**
 * Plans resource for listing available plans
 */
export class PlansResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /**
   * List all available plans
   *
   * @example
   * ```typescript
   * // List public plans
   * const plans = await commet.plans.list();
   *
   * // Include private plans
   * const allPlans = await commet.plans.list({ includePrivate: true });
   * ```
   */
  async list(params?: ListPlansParams): Promise<ApiResponse<Plan[]>> {
    return this.httpClient.get("/plans", params);
  }

  /**
   * Get a specific plan by code
   *
   * @example
   * ```typescript
   * const plan = await commet.plans.get('pro');
   * console.log(plan.data.name); // "Pro"
   * console.log(plan.data.prices); // [{ billingInterval: 'monthly', price: 9900 }]
   * ```
   */
  async get(planCode: GeneratedPlanCode): Promise<ApiResponse<PlanDetail>> {
    return this.httpClient.get(`/plans/${planCode}`);
  }
}
