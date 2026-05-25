/**
 * Commet SDK - Billing and usage tracking for SaaS
 */
export { Commet, createCommet } from "./client";
export { CustomerContext } from "./customer";
// Addons
export type {
  ActiveAddon,
  GetActiveAddonsParams,
} from "./resources/addons";
// Credit Packs
export type { CreditPack } from "./resources/credit-packs";
// Customers
export type {
  BatchResult as CustomersBatchResult,
  CreateParams as CreateCustomerParams,
  Customer,
  CustomerAddress,
  ListCustomersParams,
  UpdateParams as UpdateCustomerParams,
} from "./resources/customers";
// Features
export type {
  CanUseFeatureParams,
  CanUseResult,
  CheckFeatureParams,
  CheckResult,
  FeatureAccess,
  GetFeatureParams,
} from "./resources/features";
// Plans
export type {
  BillingInterval,
  FeatureType,
  ListPlansParams,
  Plan,
  PlanDetail,
  PlanFeature,
  PlanID,
  PlanPrice,
} from "./resources/plans";
// Portal
export type { GetUrlParams, PortalAccess } from "./resources/portal";
// Seats
export type {
  AddParams as AddSeatsParams,
  GetAllBalancesParams,
  GetBalanceParams,
  RemoveParams as RemoveSeatsParams,
  SeatBalance,
  SeatEvent,
  SetAllParams as SetAllSeatsParams,
  SetParams as SetSeatsParams,
} from "./resources/seats";
// Subscriptions
export type {
  ActiveSubscription,
  CancellationSummary,
  CancelParams,
  ChangePlanParams,
  ChangePlanResult,
  CreatedSubscription,
  CreateSubscriptionParams,
  DiscountSummary,
  FeatureSummary,
  Subscription,
  SubscriptionStatus,
  UncancelParams,
} from "./resources/subscriptions";
// Usage
export type {
  CheckUsageParams,
  TrackModelTokensParams,
  TrackParams,
  TrackUsageParams,
  UsageCheckResult,
  UsageEvent,
  UsageEventProperty,
} from "./resources/usage";
export type {
  WebhookData,
  WebhookEvent,
  WebhookPayload,
} from "./resources/webhooks";
// Webhooks
export { Webhooks } from "./resources/webhooks";
// Type exports
export type {
  ApiResponse,
  CommetClientOptions,
  CommetConfig,
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
// Error exports
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
// Config
export { defineConfig } from "./types/config";
export { registerIntegration } from "./utils/telemetry";
export { API_VERSION, SDK_VERSION } from "./version";

// Default export
import { Commet } from "./client";
export default Commet;
