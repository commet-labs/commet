import type {
  ApiResponse,
  GeneratedProductId,
  ListParams,
  RequestOptions,
  RetrieveOptions,
} from "../types/common";
import type { CommetHTTPClient } from "../utils/http";

export interface Subscription {
  id: string; // publicId (e.g., "sub_xxx")
  customerId: string;
  name: string;
  description?: string;
  status: "draft" | "pending_payment" | "active" | "completed" | "canceled";
  startDate: string; // ISO datetime
  endDate?: string; // ISO datetime (puede ser null)
  billingDayOfMonth: number; // 1-31
  totalContractValue?: number;
  poNumber?: string;
  reference?: string;
  isTemplate?: boolean;
  checkoutUrl?: string; // Secure checkout URL for pending payment subscriptions
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionItem {
  priceId: string; // List price ID
  quantity?: number; // For fixed pricing
  initialSeats?: number; // For seat-based pricing
}

// Customer identifier: mutually exclusive customerId or externalId
type CustomerIdentifier =
  | { customerId: string; externalId?: never }
  | { customerId?: never; externalId: string };

export type CreateSubscriptionParams = CustomerIdentifier & {
  items: SubscriptionItem[];
  name?: string;
  startDate?: string;
  status?: "draft" | "pending_payment" | "active";
};

export interface ListSubscriptionsParams extends ListParams {
  customerId?: string;
  externalId?: string;
  status?: "draft" | "pending_payment" | "active" | "completed" | "canceled";
}

/**
 * Subscription resource for managing subscriptions
 */
export class SubscriptionsResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /**
   * Create a subscription with multiple items (products)
   *
   * @example
   * ```typescript
   * // Free plan - Multiple products
   * await commet.subscriptions.create({
   *   externalId: "org_123",
   *   items: [
   *     { priceId: "price_tasks_free", quantity: 1 },
   *     { priceId: "price_usage_free" },
   *     { priceId: "price_seats_free", initialSeats: 1 }
   *   ]
   * });
   *
   * // Pro plan upgrade
   * await commet.subscriptions.create({
   *   customerId: "cus_xxx",
   *   items: [
   *     { priceId: "price_tasks_pro" },
   *     { priceId: "price_usage_pro" },
   *     { priceId: "price_seats_pro", initialSeats: 5 }
   *   ],
   *   status: "active"
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
