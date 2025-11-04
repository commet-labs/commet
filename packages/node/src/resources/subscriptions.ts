import type {
  ApiResponse,
  ListParams,
  RequestOptions,
  RetrieveOptions,
} from "../types/common";
import type { CommetHTTPClient } from "../utils/http";

export interface Subscription {
  id: string; // publicId (e.g., "sub_xxx")
  customerId: string;
  productId?: string;
  name: string;
  description?: string;
  status: "draft" | "active" | "completed" | "canceled";
  startDate: string; // ISO datetime
  endDate?: string; // ISO datetime (puede ser null)
  billingDayOfMonth: number; // 1-31
  totalContractValue?: number;
  poNumber?: string;
  reference?: string;
  isTemplate?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Customer identifier: mutually exclusive customerId or externalId
type CustomerIdentifier =
  | { customerId: string; externalId?: never }
  | { customerId?: never; externalId: string };

export type CreateSubscriptionParams = CustomerIdentifier & {
  productId: string;
  name?: string;
  startDate?: string;
  status?: "draft" | "active";
  quantity?: number;
  initialSeats?: number;
};

export interface ListSubscriptionsParams extends ListParams {
  customerId?: string;
  externalId?: string;
  status?: "draft" | "active" | "completed" | "canceled";
}

/**
 * Subscription resource for managing subscriptions
 */
export class SubscriptionsResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /**
   * Create a simple subscription with smart defaults
   *
   * @example
   * ```typescript
   * // Minimal - Fixed product
   * await commet.subscriptions.create({
   *   productId: "prod_xxx",
   *   customerId: "cus_xxx"
   * });
   *
   * // With custom quantity
   * await commet.subscriptions.create({
   *   productId: "prod_xxx",
   *   externalId: "my-customer-123",
   *   quantity: 5,
   *   status: "active"
   * });
   *
   * // Seat-based product
   * await commet.subscriptions.create({
   *   productId: "prod_saas",
   *   customerId: "cus_xxx",
   *   initialSeats: 10
   * });
   * ```
   */
  async create(
    params: CreateSubscriptionParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Subscription>> {
    return this.httpClient.post("/subscriptions", params, options);
  }

  /**
   * Retrieve a subscription by ID
   */
  async retrieve(
    subscriptionId: string,
    options?: RetrieveOptions,
  ): Promise<ApiResponse<Subscription>> {
    const params = options?.expand
      ? { expand: options.expand.join(",") }
      : undefined;
    return this.httpClient.get(`/subscriptions/${subscriptionId}`, params);
  }

  /**
   * List subscriptions with optional filters
   *
   * @example
   * ```typescript
   * // List all active subscriptions for a customer
   * await commet.subscriptions.list({
   *   customerId: "cus_xxx",
   *   status: "active"
   * });
   *
   * // Using externalId
   * await commet.subscriptions.list({
   *   externalId: "my-customer-123"
   * });
   * ```
   */
  async list(
    params?: ListSubscriptionsParams,
  ): Promise<ApiResponse<Subscription[]>> {
    return this.httpClient.get("/subscriptions", params);
  }

  /**
   * Cancel a subscription
   *
   * @example
   * ```typescript
   * await commet.subscriptions.cancel("sub_xxx");
   * ```
   */
  async cancel(
    subscriptionId: string,
    options?: RequestOptions,
  ): Promise<ApiResponse<Subscription>> {
    return this.httpClient.post(
      `/subscriptions/${subscriptionId}/cancel`,
      {},
      options,
    );
  }
}
