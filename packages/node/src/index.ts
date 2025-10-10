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
  UsageMetric,
  UsageMetricFilter,
} from "./resources/usage";

export type {
  SeatBalance,
  SeatEvent,
  SeatBalanceResponse,
  BulkSeatUpdate,
  ListSeatEventsParams,
} from "./resources/seats";

// Utility exports
export { isSandbox, isProduction } from "./utils/environment";

// Default export
import { Commet } from "./client";
export default Commet;
