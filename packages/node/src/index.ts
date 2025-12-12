/**
 * Commet SDK - Billing and usage tracking for SaaS
 */
export { Commet } from "./client";
export { CustomerContext } from "./customer";

// Type exports
export type {
  CommetConfig,
  CommetGeneratedTypes,
  GeneratedEventType,
  GeneratedSeatType,
  GeneratedPlanCode,
  GeneratedFeatureCode,
  Environment,
  ApiResponse,
  PaginatedResponse,
  PaginatedList,
  Currency,
  CustomerID,
  EventID,
  RequestOptions,
} from "./types/common";

// Error exports
export {
  CommetError,
  CommetAPIError,
  CommetValidationError,
} from "./types/common";

// Customers
export type {
  Customer,
  CustomerAddress,
  CreateParams as CreateCustomerParams,
  UpdateParams as UpdateCustomerParams,
  ListCustomersParams,
  BatchResult as CustomersBatchResult,
} from "./resources/customers";

// Usage
export type {
  UsageEvent,
  UsageEventProperty,
  TrackParams,
  BatchResult as UsageBatchResult,
} from "./resources/usage";

// Seats
export type {
  SeatEvent,
  SeatBalance,
  AddParams as AddSeatsParams,
  RemoveParams as RemoveSeatsParams,
  SetParams as SetSeatsParams,
  SetAllParams as SetAllSeatsParams,
  GetBalanceParams,
  GetAllBalancesParams,
} from "./resources/seats";

// Plans
export type {
  Plan,
  PlanDetail,
  PlanPrice,
  PlanFeature,
  PlanID,
  BillingInterval,
  FeatureType,
  ListPlansParams,
} from "./resources/plans";

// Subscriptions
export type {
  Subscription,
  ActiveSubscription,
  SubscriptionStatus,
  FeatureSummary,
  CreateSubscriptionParams,
  ChangePlanParams,
  CancelParams,
  GetSubscriptionParams,
} from "./resources/subscriptions";

// Portal
export type { PortalAccess, GetUrlParams } from "./resources/portal";

// Features
export type {
  FeatureAccess,
  CanUseResult,
  CheckResult,
  GetFeatureParams,
  CheckFeatureParams,
  CanUseFeatureParams,
  ListFeaturesParams,
} from "./resources/features";

// Webhooks
export { Webhooks } from "./resources/webhooks";
export type {
  WebhookPayload,
  WebhookData,
  WebhookEvent,
} from "./resources/webhooks";

// Utility exports
export { isSandbox, isProduction } from "./utils/environment";

// Default export
import { Commet } from "./client";
export default Commet;
