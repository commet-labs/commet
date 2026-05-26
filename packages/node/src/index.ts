export { Commet, createCommet } from "./client";
export { CustomerContext } from "./customer";
export type {
  ActiveAddon,
  ListActiveAddonsParams,
} from "./resources/addons";
export type { CreditPack } from "./resources/credit-packs";
export type {
  BatchResult as CustomersBatchResult,
  CreateParams as CreateCustomerParams,
  Customer,
  CustomerAddress,
  GetCustomerParams,
  ListCustomersParams,
  UpdateParams as UpdateCustomerParams,
} from "./resources/customers";
export type {
  CanUseFeatureParams,
  CanUseResult,
  FeatureAccess,
  GetFeatureParams,
  ListFeaturesParams,
} from "./resources/features";
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
export type { GetUrlParams, PortalAccess } from "./resources/portal";
export type {
  AddSeatsParams,
  GetAllBalancesParams,
  GetBalanceParams,
  RemoveSeatsParams,
  SeatBalance,
  SeatEvent,
  SetAllSeatsParams,
  SetSeatsParams,
} from "./resources/seats";
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
  GetActiveParams,
  Subscription,
  SubscriptionStatus,
  UncancelParams,
} from "./resources/subscriptions";
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
export { registerIntegration } from "./utils/telemetry";
export { API_VERSION, SDK_VERSION } from "./version";

import { Commet } from "./client";
export default Commet;
