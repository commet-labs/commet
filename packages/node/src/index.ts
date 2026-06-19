// Core (hand-written, never generated)
export { Commet, createCommet } from "./client";
export type {
  CreateAddonParams,
  DeleteAddonParams,
  GetAddonParams,
  ListActiveAddonsParams,
  ListAddonsParams,
  UpdateAddonParams,
} from "./resources/addons";
export type {
  CreateApiKeyParams,
  DeleteApiKeyParams,
  ListApiKeysParams,
} from "./resources/api-keys";
export type {
  CreateCreditPackParams,
  DeleteCreditPackParams,
  UpdateCreditPackParams,
} from "./resources/credit-packs";
export type {
  BatchCreateCustomersParams,
  CreateCustomerParams,
  GetCustomerParams,
  ListCustomersParams,
  UpdateCustomerParams,
} from "./resources/customers";
export type {
  CanUseFeatureParams,
  GetFeatureAccessParams,
  ListFeatureAccessParams,
} from "./resources/feature-access";
export type {
  CreateFeatureParams,
  DeleteFeatureParams,
  GetFeatureParams,
  UpdateFeatureParams,
} from "./resources/features";
export type {
  CreateAdjustmentInvoiceParams,
  DownloadInvoiceParams,
  GetInvoiceParams,
  ListInvoicesParams,
  SendInvoiceParams,
  UpdateInvoiceStatusParams,
} from "./resources/invoices";
export type {
  CancelPaymentParams,
  ChargePaymentParams,
  CreatePaymentParams,
  GetPaymentParams,
  ListPaymentsParams,
} from "./resources/payments";
export type {
  AddPayoutBankAccountParams,
  CompletePayoutVerificationParams,
  RequestPayoutParams,
} from "./resources/payouts";
export type {
  AddPlanToGroupParams,
  CreatePlanGroupParams,
  DeletePlanGroupParams,
  GetPlanGroupParams,
  ListPlanGroupsParams,
  RemovePlanFromGroupParams,
  ReorderPlansInGroupParams,
  UpdatePlanGroupParams,
} from "./resources/plan-groups";
export type {
  AddPlanFeatureParams,
  AddPlanPriceParams,
  CreatePlanParams,
  DeletePlanParams,
  DeletePlanPriceParams,
  DeleteRegionalPricesParams,
  GetPlanParams,
  ListPlansParams,
  RemovePlanFeatureParams,
  SetDefaultPlanPriceParams,
  SetPlanRegionalPricingParams,
  SetPlanVisibilityParams,
  UpdatePlanFeatureParams,
  UpdatePlanParams,
  UpdatePlanPriceParams,
  UpsertRegionalPricesParams,
} from "./resources/plans";
export type { RequestPortalAccessParams } from "./resources/portal";
export type {
  CreatePromoCodeParams,
  GetPromoCodeParams,
  ListPromoCodesParams,
  UpdatePromoCodeParams,
} from "./resources/promo-codes";
export type {
  AddQuotaParams,
  GetAllQuotaAllowancesParams,
  GetQuotaAllowanceParams,
  RemoveQuotaParams,
  SetQuotaParams,
} from "./resources/quota";
export type {
  AddSeatsParams,
  BulkSetSeatsParams,
  GetAllSeatBalancesParams,
  GetSeatBalanceParams,
  RemoveSeatsParams,
  SetSeatsParams,
} from "./resources/seats";
export type {
  ActivateAddonParams,
  AdjustBalanceParams,
  CancelSubscriptionParams,
  ChangePlanParams,
  CreateSubscriptionParams,
  CreateSubscriptionRecoveryLinkParams,
  DeactivateAddonParams,
  GetActiveSubscriptionParams,
  GetSubscriptionParams,
  ListSubscriptionsParams,
  PreviewChangePlanParams,
  PurchaseCreditsParams,
  ReactivateSubscriptionParams,
  TopupBalanceParams,
  UncancelSubscriptionParams,
  UpdatePaymentMethodParams,
} from "./resources/subscriptions";
export type { AdvanceTestClockParams } from "./resources/test-clock";
export type {
  GetTransactionParams,
  ListTransactionsParams,
  RefundTransactionParams,
  RetryTransactionParams,
} from "./resources/transactions";
// Preserved hand-written resources (custom logic, not generated)
export type {
  CheckUsageParams,
  TrackModelTokensParams,
  TrackParams,
  TrackUsageParams,
  UsageCheckDenialReason,
  UsageCheckResult,
  UsageEvent,
  UsageEventProperty,
} from "./resources/usage";
export type {
  CreateWebhookParams,
  DeleteWebhookParams,
  GetWebhookParams,
  ListWebhooksParams,
  TestWebhookParams,
  UpdateWebhookParams,
  WebhookData,
  WebhookEndpoint,
  WebhookEndpointCreated,
  WebhookEventHandler,
  WebhookPayload,
  WebhookTestResult,
} from "./resources/webhooks";
export { Webhooks } from "./resources/webhooks";
export type {
  ApiErrorDetail,
  ApiResponse,
  CommetClientOptions,
  Currency,
  CustomerID,
  EventID,
  PaginatedList,
  PaginatedResponse,
  RequestOptions,
  ResolvedFeatureCode,
  ResolvedPlanCode,
  ResolvedSeatCode,
  ResolvedUsageCode,
} from "./types/common";
export {
  CommetAPIError,
  CommetError,
  CommetValidationError,
} from "./types/common";
export type {
  BillingConfig,
  FeatureDef,
  InferFeatureCodes,
  InferPlanCodes,
  InferSeatCodes,
  InferUsageCodes,
  PlanDef,
  PlanFeatureValue,
  PriceDef,
} from "./types/config";
export { defineConfig } from "./types/config";
export type {
  BillingInterval,
  ConsumptionModel,
  DiscountType,
  FeatureType,
  InvoiceType,
  SubscriptionStatus,
  Timezone,
  TransactionStatus,
} from "./types/enums";
export type {
  ActiveAddon,
  AddedPlanToGroup,
  Addon,
  ApiKey,
  BalanceAdjustment,
  BalanceTopup,
  BulkSeatUpdate,
  CanceledSubscription,
  CreatedApiKey,
  CreatedInvoice,
  CreditGrant,
  CreditPack,
  Customer,
  CustomerBatch,
  DefaultPlanPrice,
  DeletedObject,
  DeletedPlanRegionalPricing,
  DeletedSubscriptionAddon,
  Feature,
  FeatureAccess,
  FeatureLookup,
  Invoice,
  InvoiceDownload,
  InvoiceStatus,
  Payment,
  PaymentMethodUpdateCheckout,
  Payout,
  PayoutBankAccount,
  PayoutVerification,
  Plan,
  PlanChange,
  PlanFeature,
  PlanGroup,
  PlanPrice,
  PlanRegionalPricing,
  PlanRegionalPricingResult,
  PlanVisibility,
  PortalAccess,
  PreviewChange,
  PromoCode,
  ReactivatedSubscription,
  RecoveryLink,
  RemovedPlanFeature,
  RemovedPlanFromGroup,
  ReorderedPlans,
  SeatBalance,
  SeatBalanceListItem,
  SeatEvent,
  SentInvoice,
  Subscription,
  SubscriptionAddon,
  TestClock,
  TestClockBilling,
  Transaction,
  TransactionRefund,
  TransactionRetry,
  UncanceledSubscription,
  UsageQuota,
  UsageQuotaEvent,
} from "./types/models";
export type * from "./types/webhook-events";
export type {
  WebhookAddonRef,
  WebhookBalance,
  WebhookBankRef,
  WebhookCardInfo,
  WebhookCreditsBalance,
  WebhookFeatureAccess,
  WebhookPlanRef,
  WebhookSeatSummary,
} from "./types/webhook-shared";
export { registerIntegration } from "./utils/telemetry";
export { API_VERSION, SDK_VERSION } from "./version";

import { Commet } from "./client";
export default Commet;
