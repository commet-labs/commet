import { GeneratedResources } from "./_generated_resources";
import { UsageResource } from "./resources/usage";
import { Webhooks } from "./resources/webhooks";
import type { CommetClientOptions } from "./types/common";
import type { BillingConfig } from "./types/config";
import { CommetHTTPClient } from "./utils/http";
import { scheduleSdkUpdateCheck } from "./utils/update-check";

export class Commet<_TConfig = unknown> extends GeneratedResources {
  private httpClient: CommetHTTPClient;

  public readonly usage: UsageResource;
  public readonly webhooks: Webhooks;

  constructor(config: CommetClientOptions) {
    super();

    if (!config.apiKey) {
      throw new Error("Commet SDK: API key is required");
    }

    if (!config.apiKey.startsWith("ck_")) {
      throw new Error(
        "Commet SDK: Invalid API key format. Expected format: ck_xxx...",
      );
    }

    this.httpClient = new CommetHTTPClient(config);
    this.initResources(this.httpClient);
    this.usage = new UsageResource(this.httpClient);
    this.webhooks = new Webhooks(this.httpClient);
    scheduleSdkUpdateCheck();
  }
}

export function createCommet<const TConfig extends BillingConfig>(
  _billingConfig: TConfig,
  options: CommetClientOptions,
): Commet<TConfig> {
  return new Commet<TConfig>(options);
}
