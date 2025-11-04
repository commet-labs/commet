import { CustomersResource } from "./resources/customers";
import { SeatsResource } from "./resources/seats";
import { SubscriptionsResource } from "./resources/subscriptions";
import { UsageResource } from "./resources/usage";
import type { CommetConfig, Environment } from "./types/common";
import { CommetHTTPClient } from "./utils/http";

/**
 * Main Commet SDK client
 */
export class Commet {
  private httpClient: CommetHTTPClient;
  private environment: Environment;

	public readonly customers: CustomersResource;
	public readonly usage: UsageResource;
	public readonly seats: SeatsResource;
	public readonly subscriptions: SubscriptionsResource;

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
		this.usage = new UsageResource(this.httpClient);
		this.seats = new SeatsResource(this.httpClient);
		this.subscriptions = new SubscriptionsResource(this.httpClient);

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
