import type { FeaturesResource } from "./resources/features";
import type { PortalResource } from "./resources/portal";
import type { SeatsResource } from "./resources/seats";
import type { SubscriptionsResource } from "./resources/subscriptions";
import type { UsageResource } from "./resources/usage";
import type {
  RequestOptions,
  ResolvedFeatureCode,
  ResolvedMeteredCode,
  ResolvedSeatCode,
} from "./types/common";

export class CustomerContext<TConfig = unknown> {
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
    get: (code: ResolvedFeatureCode<TConfig>, options?: RequestOptions) =>
      this.featuresResource.get({ code, customerId: this.customerId }, options),

    check: (code: ResolvedFeatureCode<TConfig>, options?: RequestOptions) =>
      this.featuresResource.check(
        { code, customerId: this.customerId },
        options,
      ),

    canUse: (code: ResolvedFeatureCode<TConfig>, options?: RequestOptions) =>
      this.featuresResource.canUse(
        { code, customerId: this.customerId },
        options,
      ),

    list: (options?: RequestOptions) =>
      this.featuresResource.list(this.customerId, options),
  };

  seats = {
    add: (
      featureCode: ResolvedSeatCode<TConfig>,
      count = 1,
      options?: RequestOptions,
    ) =>
      this.seatsResource.add(
        { customerId: this.customerId, featureCode, count },
        options,
      ),

    remove: (
      featureCode: ResolvedSeatCode<TConfig>,
      count = 1,
      options?: RequestOptions,
    ) =>
      this.seatsResource.remove(
        { customerId: this.customerId, featureCode, count },
        options,
      ),

    set: (
      featureCode: ResolvedSeatCode<TConfig>,
      count: number,
      options?: RequestOptions,
    ) =>
      this.seatsResource.set(
        { customerId: this.customerId, featureCode, count },
        options,
      ),

    getBalance: (featureCode: ResolvedSeatCode<TConfig>) =>
      this.seatsResource.getBalance({
        customerId: this.customerId,
        featureCode,
      }),
  };

  usage = {
    track: (
      feature: ResolvedMeteredCode<TConfig>,
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
