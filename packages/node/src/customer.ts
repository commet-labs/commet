import type { FeaturesResource } from "./resources/features";
import type { PortalResource } from "./resources/portal";
import type { SeatsResource } from "./resources/seats";
import type { SubscriptionsResource } from "./resources/subscriptions";
import type { UsageResource } from "./resources/usage";
import type { RequestOptions } from "./types/common";

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
  private readonly featuresResource: FeaturesResource;
  private readonly seatsResource: SeatsResource;
  private readonly usageResource: UsageResource;
  private readonly subscriptionsResource: SubscriptionsResource;
  private readonly portalResource: PortalResource;

  constructor(
    externalId: string,
    resources: {
      features: FeaturesResource;
      seats: SeatsResource;
      usage: UsageResource;
      subscriptions: SubscriptionsResource;
      portal: PortalResource;
    },
  ) {
    this.externalId = externalId;
    this.featuresResource = resources.features;
    this.seatsResource = resources.seats;
    this.usageResource = resources.usage;
    this.subscriptionsResource = resources.subscriptions;
    this.portalResource = resources.portal;
  }

  /**
   * Feature access methods - delegates to FeaturesResource
   */
  features = {
    get: (code: string, options?: RequestOptions) =>
      this.featuresResource.get(
        { code, externalId: this.externalId },
        options,
      ),

    check: (code: string, options?: RequestOptions) =>
      this.featuresResource.check(
        { code, externalId: this.externalId },
        options,
      ),

    canUse: (code: string, options?: RequestOptions) =>
      this.featuresResource.canUse(
        { code, externalId: this.externalId },
        options,
      ),

    list: (options?: RequestOptions) =>
      this.featuresResource.list(
        this.externalId ,
        options,
      ),
  };

  /**
   * Seat management methods - delegates to SeatsResource
   */
  seats = {
    add: (seatType: string, count = 1, options?: RequestOptions) =>
      this.seatsResource.add(
        { externalId: this.externalId, seatType, count },
        options,
      ),

    remove: (seatType: string, count = 1, options?: RequestOptions) =>
      this.seatsResource.remove(
        { externalId: this.externalId, seatType, count },
        options,
      ),

    set: (seatType: string, count: number, options?: RequestOptions) =>
      this.seatsResource.set(
        { externalId: this.externalId, seatType, count },
        options,
      ),

    getBalance: (seatType: string) =>
      this.seatsResource.getBalance({ externalId: this.externalId, seatType }),
  };

  /**
   * Usage tracking methods - delegates to UsageResource
   */
  usage = {
    track: (
      eventType: string,
      properties?: Record<string, string>,
      options?: RequestOptions,
    ) =>
      this.usageResource.track(
        { externalId: this.externalId, eventType, properties },
        options,
      ),
  };

  /**
   * Subscription methods - delegates to SubscriptionsResource
   */
  subscription = {
    get: () => this.subscriptionsResource.get({ externalId: this.externalId }),
  };

  /**
   * Portal methods - delegates to PortalResource
   */
  portal = {
    getUrl: (options?: RequestOptions) =>
      this.portalResource.getUrl({ externalId: this.externalId }, options),
  };
}
