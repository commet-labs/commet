/**
 * Commet SDK - Billing and usage tracking SDK
 */
export { Commet } from "./client";

// Type exports
export type {
  CommetConfig,
  CommetGeneratedTypes,
  GeneratedEventType,
  GeneratedSeatType,
  GeneratedProductId,
  Environment,
  ApiResponse,
  PaginatedResponse,
  PaginatedList,
  Currency,
  CustomerID,
  AgreementID,
  InvoiceID,
  PhaseID,
  ItemID,
  ProductID,
  EventID,
  WebhookID,
  ListParams,
  RetrieveOptions,
  RequestOptions,
} from "./types/common";

// Error exports
export {
  CommetError,
  CommetAPIError,
  CommetValidationError,
} from "./types/common";

// Resource type exports
export type {
  Customer,
  CreateCustomerParams,
  UpdateCustomerParams,
  ListCustomersParams,
} from "./resources/customers";

export type {
  UsageEvent,
  UsageEventProperty,
  CreateUsageEventParams,
  CreateBatchUsageEventsParams,
  BatchResult,
  ListUsageEventsParams,
} from "./resources/usage";

export type {
	SeatBalance,
	SeatEvent,
	SeatBalanceResponse,
	BulkSeatUpdate,
	AddSeatsParams,
	RemoveSeatsParams,
	SetSeatsParams,
	BulkUpdateSeatsParams,
	GetBalanceParams,
	GetAllBalancesParams,
	ListSeatEventsParams,
} from "./resources/seats";

export type {
	Subscription,
	CreateSubscriptionParams,
	ListSubscriptionsParams,
} from "./resources/subscriptions";

// Utility exports
export { isSandbox, isProduction } from "./utils/environment";

// Default export
import { Commet } from "./client";
export default Commet;
