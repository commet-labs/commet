import { AddonsResource } from "./resources/addons";
import { ApiKeysResource } from "./resources/api-keys";
import { CreditPacksResource } from "./resources/credit-packs";
import { CustomersResource } from "./resources/customers";
import { FeaturesResource } from "./resources/features";
import { InvoicesResource } from "./resources/invoices";
import { PlanGroupsResource } from "./resources/plan-groups";
import { PlansResource } from "./resources/plans";
import { PortalResource } from "./resources/portal";
import { PromoCodesResource } from "./resources/promo-codes";
import { QuotaResource } from "./resources/quota";
import { SeatsResource } from "./resources/seats";
import { SubscriptionsResource } from "./resources/subscriptions";
import { TransactionsResource } from "./resources/transactions";
import { UsageResource } from "./resources/usage";
import { Webhooks } from "./resources/webhooks";
import type { CommetClientOptions } from "./types/common";
import type { BillingConfig } from "./types/config";
import { CommetHTTPClient } from "./utils/http";

export class Commet<_TConfig = unknown> {
  private httpClient: CommetHTTPClient;

  public readonly addons: AddonsResource;
  public readonly apiKeys: ApiKeysResource;
  public readonly creditPacks: CreditPacksResource;
  public readonly customers: CustomersResource;
  public readonly features: FeaturesResource;
  public readonly invoices: InvoicesResource;
  public readonly planGroups: PlanGroupsResource;
  public readonly plans: PlansResource;
  public readonly portal: PortalResource;
  public readonly promoCodes: PromoCodesResource;
  public readonly quota: QuotaResource;
  public readonly seats: SeatsResource;
  public readonly subscriptions: SubscriptionsResource;
  public readonly transactions: TransactionsResource;
  public readonly usage: UsageResource;
  public readonly webhooks: Webhooks;

  constructor(config: CommetClientOptions) {
    if (!config.apiKey) {
      throw new Error("Commet SDK: API key is required");
    }

    if (!config.apiKey.startsWith("ck_")) {
      throw new Error(
        "Commet SDK: Invalid API key format. Expected format: ck_xxx...",
      );
    }

    this.httpClient = new CommetHTTPClient(config);
    this.addons = new AddonsResource(this.httpClient);
    this.apiKeys = new ApiKeysResource(this.httpClient);
    this.creditPacks = new CreditPacksResource(this.httpClient);
    this.customers = new CustomersResource(this.httpClient);
    this.features = new FeaturesResource(this.httpClient);
    this.invoices = new InvoicesResource(this.httpClient);
    this.planGroups = new PlanGroupsResource(this.httpClient);
    this.plans = new PlansResource(this.httpClient);
    this.portal = new PortalResource(this.httpClient);
    this.promoCodes = new PromoCodesResource(this.httpClient);
    this.quota = new QuotaResource(this.httpClient);
    this.seats = new SeatsResource(this.httpClient);
    this.subscriptions = new SubscriptionsResource(this.httpClient);
    this.transactions = new TransactionsResource(this.httpClient);
    this.usage = new UsageResource(this.httpClient);
    this.webhooks = new Webhooks(this.httpClient);
  }
}

export function createCommet<const TConfig extends BillingConfig>(
  _billingConfig: TConfig,
  options: CommetClientOptions,
): Commet<TConfig> {
  return new Commet<TConfig>(options);
}
