import { AddonsResource } from "./resources/addons";
import { ApiKeysResource } from "./resources/api-keys";
import { CreditPacksResource } from "./resources/credit-packs";
import { CustomersResource } from "./resources/customers";
import { FeatureAccessResource } from "./resources/feature-access";
import { FeaturesResource } from "./resources/features";
import { InvoicesResource } from "./resources/invoices";
import { PaymentsResource } from "./resources/payments";
import { PayoutsResource } from "./resources/payouts";
import { PlanGroupsResource } from "./resources/plan-groups";
import { PlansResource } from "./resources/plans";
import { PortalResource } from "./resources/portal";
import { PromoCodesResource } from "./resources/promo-codes";
import { ProvisioningResource } from "./resources/provisioning";
import { QuotaResource } from "./resources/quota";
import { SeatsResource } from "./resources/seats";
import { SubscriptionsResource } from "./resources/subscriptions";
import { TestClockResource } from "./resources/test-clock";
import { TransactionsResource } from "./resources/transactions";
import type { CommetHTTPClient } from "./utils/http";

export class GeneratedResources {
  public addons!: AddonsResource;
  public apiKeys!: ApiKeysResource;
  public creditPacks!: CreditPacksResource;
  public customers!: CustomersResource;
  public featureAccess!: FeatureAccessResource;
  public features!: FeaturesResource;
  public invoices!: InvoicesResource;
  public payments!: PaymentsResource;
  public payouts!: PayoutsResource;
  public planGroups!: PlanGroupsResource;
  public plans!: PlansResource;
  public portal!: PortalResource;
  public promoCodes!: PromoCodesResource;
  public provisioning!: ProvisioningResource;
  public quota!: QuotaResource;
  public seats!: SeatsResource;
  public subscriptions!: SubscriptionsResource;
  public testClock!: TestClockResource;
  public transactions!: TransactionsResource;

  protected initResources(http: CommetHTTPClient): void {
    this.addons = new AddonsResource(http);
    this.apiKeys = new ApiKeysResource(http);
    this.creditPacks = new CreditPacksResource(http);
    this.customers = new CustomersResource(http);
    this.featureAccess = new FeatureAccessResource(http);
    this.features = new FeaturesResource(http);
    this.invoices = new InvoicesResource(http);
    this.payments = new PaymentsResource(http);
    this.payouts = new PayoutsResource(http);
    this.planGroups = new PlanGroupsResource(http);
    this.plans = new PlansResource(http);
    this.portal = new PortalResource(http);
    this.promoCodes = new PromoCodesResource(http);
    this.provisioning = new ProvisioningResource(http);
    this.quota = new QuotaResource(http);
    this.seats = new SeatsResource(http);
    this.subscriptions = new SubscriptionsResource(http);
    this.testClock = new TestClockResource(http);
    this.transactions = new TransactionsResource(http);
  }
}
