/**
 * Commet SDK - Billing and usage tracking for SaaS
 */
export { Commet } from "./client";
export { CustomerContext } from "./customer";
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
  CancelParams,
  CreatedSubscription,
  CreateSubscriptionParams,
  FeatureSummary,
  Subscription,
  SubscriptionStatus,
} from "./resources/subscriptions";
// Usage
export type {
  TrackModelTokensParams,
  TrackParams,
  TrackUsageParams,
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
  CommetConfig,
  CommetGeneratedTypes,
  Currency,
  CustomerID,
  Environment,
  EventID,
  GeneratedFeatureCode,
  GeneratedPlanCode,
  GeneratedSeatType,
  PaginatedList,
  PaginatedResponse,
  RequestOptions,
} from "./types/common";
// Error exports
export {
  CommetAPIError,
  CommetError,
  CommetValidationError,
} from "./types/common";

// Utility exports
export { isProduction, isSandbox } from "./utils/environment";

// Default export
import { Commet } from "./client";
export default Commet;
