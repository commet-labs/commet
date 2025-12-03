import { CustomerContext } from "./customer";
import { CustomersResource } from "./resources/customers";
import { FeaturesResource } from "./resources/features";
import { PlansResource } from "./resources/plans";
import { PortalResource } from "./resources/portal";
import { SeatsResource } from "./resources/seats";
import { SubscriptionsResource } from "./resources/subscriptions";
import { UsageResource } from "./resources/usage";
import { Webhooks } from "./resources/webhooks";
import type { CommetConfig, Environment } from "./types/common";
import { CommetHTTPClient } from "./utils/http";

/**
 * Main Commet SDK client
 */
export class Commet {
  private httpClient: CommetHTTPClient;
  private environment: Environment;

  public readonly customers: CustomersResource;
  public readonly plans: PlansResource;
  public readonly usage: UsageResource;
  public readonly seats: SeatsResource;
  public readonly subscriptions: SubscriptionsResource;
  public readonly portal: PortalResource;
  public readonly features: FeaturesResource;
  public readonly webhooks: Webhooks;

  constructor(config: CommetConfig) {
    if (!config.apiKey) {
      throw new Error("Commet SDK: API key is required");
    }

    if (!config.apiKey.startsWith("ck_")) {
      throw new Error(
        "Commet SDK: Invalid API key format. Expected format: ck_xxx...",
      );
    }

    // Default to sandbox for safety
    this.environment = config.environment || "sandbox";

    this.httpClient = new CommetHTTPClient(config, this.environment);
    this.customers = new CustomersResource(this.httpClient);
    this.plans = new PlansResource(this.httpClient);
    this.usage = new UsageResource(this.httpClient);
    this.seats = new SeatsResource(this.httpClient);
    this.subscriptions = new SubscriptionsResource(this.httpClient);
    this.portal = new PortalResource(this.httpClient);
    this.features = new FeaturesResource(this.httpClient);
    this.webhooks = new Webhooks();

    if (config.debug) {
      console.log(`[Commet SDK] Initialized in ${this.environment} mode`);
      console.log("API Key:", `${config.apiKey.substring(0, 12)}...`);
      const baseURL =
        this.environment === "production"
          ? "https://commet.co"
          : "https://sandbox.commet.co";
      console.log("Base URL:", baseURL);
    }
  }

  /**
   * Create a customer-scoped context for cleaner API usage
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
  customer(externalId: string): CustomerContext {
    return new CustomerContext(externalId, {
      features: this.features,
      seats: this.seats,
      usage: this.usage,
      subscriptions: this.subscriptions,
      portal: this.portal,
    });
  }

  getEnvironment(): Environment {
    return this.environment;
  }

  isSandbox(): boolean {
    return this.environment === "sandbox";
  }

  isProduction(): boolean {
    return this.environment === "production";
  }
}
