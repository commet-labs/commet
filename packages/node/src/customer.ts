import type {
  ApiResponse,
  GeneratedEventType,
  GeneratedFeatureCode,
  GeneratedSeatType,
  RequestOptions,
} from "./types/common";
import type { CommetHTTPClient } from "./utils/http";
import type { FeatureAccess, CanUseResult, CheckResult } from "./resources/features";
import type { SeatBalance, SeatEvent } from "./resources/seats";
import type { UsageEvent } from "./resources/usage";
import type { ActiveSubscription, Subscription } from "./resources/subscriptions";
import type { PortalAccess } from "./resources/portal";

/**
 * Customer-scoped API context
 *
 * Provides a cleaner API where you don't have to pass externalId
 * on every call. All operations are scoped to a specific customer.
 *
 * @example
 * ```typescript
 * const customer = commet.customer("user_123");
 *
 * // All operations are now scoped to this customer
 * const seats = await customer.features.get("team_members");
 * await customer.seats.add("member");
 * await customer.usage.track("api_call");
 * ```
 */
export class CustomerContext {
  private readonly externalId: string;
  private readonly httpClient: CommetHTTPClient;

  constructor(httpClient: CommetHTTPClient, externalId: string) {
    this.httpClient = httpClient;
    this.externalId = externalId;
  }

  /**
   * Feature access methods - check what the customer can use
   */
  features = {
    /**
     * Get detailed feature access/usage
     */
    get: (
      code: GeneratedFeatureCode,
      options?: RequestOptions,
    ): Promise<ApiResponse<FeatureAccess>> => {
      return this.httpClient.get(
        `/features/${code}`,
        { externalId: this.externalId },
        options,
      );
    },

    /**
     * Check if a boolean feature is enabled
     */
    check: async (
      code: GeneratedFeatureCode,
      options?: RequestOptions,
    ): Promise<ApiResponse<CheckResult>> => {
      const result = await this.httpClient.get<FeatureAccess>(
        `/features/${code}`,
        { externalId: this.externalId },
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
    },

    /**
     * Check if customer can use one more unit
     */
    canUse: (
      code: GeneratedFeatureCode,
      options?: RequestOptions,
    ): Promise<ApiResponse<CanUseResult>> => {
      return this.httpClient.get(
        `/features/${code}`,
        { externalId: this.externalId, action: "canUse" },
        options,
      );
    },

    /**
     * List all features
     */
    list: (options?: RequestOptions): Promise<ApiResponse<FeatureAccess[]>> => {
      return this.httpClient.get(
        "/features",
        { externalId: this.externalId },
        options,
      );
    },
  };

  /**
   * Seat management methods
   */
  seats = {
    /**
     * Add seats
     */
    add: (
      seatType: GeneratedSeatType,
      count = 1,
      options?: RequestOptions,
    ): Promise<ApiResponse<SeatEvent>> => {
      return this.httpClient.post(
        "/seats/add",
        { externalId: this.externalId, seatType, count },
        options,
      );
    },

    /**
     * Remove seats
     */
    remove: (
      seatType: GeneratedSeatType,
      count = 1,
      options?: RequestOptions,
    ): Promise<ApiResponse<SeatEvent>> => {
      return this.httpClient.post(
        "/seats/remove",
        { externalId: this.externalId, seatType, count },
        options,
      );
    },

    /**
     * Set total seat count
     */
    set: (
      seatType: GeneratedSeatType,
      count: number,
      options?: RequestOptions,
    ): Promise<ApiResponse<SeatEvent>> => {
      return this.httpClient.post(
        "/seats/set",
        { externalId: this.externalId, seatType, count },
        options,
      );
    },

    /**
     * Get current seat balance
     */
    getBalance: (
      seatType: GeneratedSeatType,
      options?: RequestOptions,
    ): Promise<ApiResponse<SeatBalance>> => {
      return this.httpClient.get(
        "/seats/balance",
        { externalId: this.externalId, seatType },
        options,
      );
    },
  };

  /**
   * Usage tracking methods
   */
  usage = {
    /**
     * Track a usage event
     */
    track: (
      eventType: GeneratedEventType,
      properties?: Record<string, string>,
      options?: RequestOptions,
    ): Promise<ApiResponse<UsageEvent>> => {
      return this.httpClient.post(
        "/usage",
        {
          externalId: this.externalId,
          eventType,
          properties,
        },
        options,
      );
    },
  };

  /**
   * Subscription methods
   */
  subscription = {
    /**
     * Get active subscription
     */
    get: (options?: RequestOptions): Promise<ApiResponse<ActiveSubscription | null>> => {
      return this.httpClient.get(
        "/subscriptions/active",
        { externalId: this.externalId },
        options,
      );
    },

    /**
     * Cancel subscription
     */
    cancel: (
      params?: { reason?: string; immediate?: boolean },
      options?: RequestOptions,
    ): Promise<ApiResponse<Subscription>> => {
      // First get the subscription to get its ID
      return this.httpClient.get<ActiveSubscription | null>(
        "/subscriptions/active",
        { externalId: this.externalId },
      ).then((result) => {
        if (!result.success || !result.data) {
          return {
            success: false,
            data: null as unknown as Subscription,
            message: "No active subscription found",
          };
        }
        return this.httpClient.post(
          `/subscriptions/${result.data.id}/cancel`,
          params || {},
          options,
        );
      });
    },
  };

  /**
   * Portal methods
   */
  portal = {
    /**
     * Get customer portal URL
     */
    getUrl: (options?: RequestOptions): Promise<ApiResponse<PortalAccess>> => {
      return this.httpClient.get(
        "/portal/url",
        { externalId: this.externalId },
        options,
      );
    },
  };
}

