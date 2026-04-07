import type { FeaturesResource } from "./resources/features";
import type { PortalResource } from "./resources/portal";
import type { SeatsResource } from "./resources/seats";
import type { SubscriptionsResource } from "./resources/subscriptions";
import type { UsageResource } from "./resources/usage";
import type { RequestOptions } from "./types/common";

/**
 * Customer-scoped API context
 *
 * Provides a cleaner API where you don't have to pass customerId
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
  private readonly customerId: string;
  private readonly featuresResource: FeaturesResource;
  private readonly seatsResource: SeatsResource;
  private readonly usageResource: UsageResource;
  private readonly subscriptionsResource: SubscriptionsResource;
  private readonly portalResource: PortalResource;

  constructor(
    customerId: string,
    resources: {
      features: FeaturesResource;
      seats: SeatsResource;
      usage: UsageResource;
      subscriptions: SubscriptionsResource;
      portal: PortalResource;
    },
  ) {
    this.customerId = customerId;
    this.featuresResource = resources.features;
    this.seatsResource = resources.seats;
    this.usageResource = resources.usage;
    this.subscriptionsResource = resources.subscriptions;
    this.portalResource = resources.portal;
  }

  features = {
    get: (code: string, options?: RequestOptions) =>
      this.featuresResource.get({ code, customerId: this.customerId }, options),

    check: (code: string, options?: RequestOptions) =>
      this.featuresResource.check(
        { code, customerId: this.customerId },
        options,
      ),

    canUse: (code: string, options?: RequestOptions) =>
      this.featuresResource.canUse(
        { code, customerId: this.customerId },
        options,
      ),

    list: (options?: RequestOptions) =>
      this.featuresResource.list(this.customerId, options),
  };

  seats = {
    add: (seatType: string, count = 1, options?: RequestOptions) =>
      this.seatsResource.add(
        { customerId: this.customerId, seatType, count },
        options,
      ),

    remove: (seatType: string, count = 1, options?: RequestOptions) =>
      this.seatsResource.remove(
        { customerId: this.customerId, seatType, count },
        options,
      ),

    set: (seatType: string, count: number, options?: RequestOptions) =>
      this.seatsResource.set(
        { customerId: this.customerId, seatType, count },
        options,
      ),

    getBalance: (seatType: string) =>
      this.seatsResource.getBalance({ customerId: this.customerId, seatType }),
  };

  usage = {
    track: (
      feature: string,
      value?: number,
      properties?: Record<string, string>,
      options?: RequestOptions,
    ) =>
      this.usageResource.track(
        { customerId: this.customerId, feature, value, properties },
        options,
      ),
  };

  subscription = {
    get: () => this.subscriptionsResource.get(this.customerId),
  };

  portal = {
    getUrl: (options?: RequestOptions) =>
      this.portalResource.getUrl({ customerId: this.customerId }, options),
  };
}
