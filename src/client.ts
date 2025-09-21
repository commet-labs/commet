import { CustomersResource } from "./resources/customers";
import { SeatsResource } from "./resources/seats";
import { UsageResource } from "./resources/usage";
import type { CommetConfig, Environment } from "./types/common";
import { detectEnvironment } from "./utils/environment";
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

  constructor(config: CommetConfig) {
    if (!config.apiKey) {
      throw new Error("Commet SDK: API key is required");
    }

    if (!config.apiKey.startsWith("ck_")) {
      throw new Error(
        "Commet SDK: Invalid API key format. Expected format: ck_xxx...",
      );
    }

    this.environment =
      config.environment === "auto"
        ? detectEnvironment()
        : config.environment || detectEnvironment();

    this.httpClient = new CommetHTTPClient(config, this.environment);
    this.customers = new CustomersResource(this.httpClient);
    this.usage = new UsageResource(this.httpClient);
    this.seats = new SeatsResource(this.httpClient);

    if (this.environment === "development" || config.debug) {
      console.log(`[Commet SDK] Initialized in ${this.environment} mode`);

      if (config.debug) {
        console.log("API Key:", `${config.apiKey.substring(0, 12)}...`);
        console.log("Base URL:", "https://api.commet.co");

        if (this.environment === "development") {
          console.log(
            "Dev mode: Events will be logged to console, not sent to server",
          );
        }
      }
    }
  }

  getEnvironment(): Environment {
    return this.environment;
  }

  isDevelopment(): boolean {
    return this.environment === "development";
  }

  isProduction(): boolean {
    return this.environment === "production";
  }
}
