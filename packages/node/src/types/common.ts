export type Environment = "sandbox" | "production";

export type CommetConfig = {
  apiKey: string;
  environment?: Environment;
  debug?: boolean;
  timeout?: number;
  retries?: number;
};

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  // Pagination fields (optional, included for list endpoints)
  hasMore?: boolean;
  nextCursor?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  hasMore: boolean;
  nextCursor?: string;
  totalCount?: number;
}

export interface PaginatedList<T> extends PaginatedResponse<T> {
  next(): Promise<PaginatedList<T>>;
  all(): Promise<T[]>;
}

// Error types
export class CommetError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public details?: unknown,
  ) {
    super(message);
    this.name = "CommetError";
  }
}

export class CommetAPIError extends CommetError {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string,
    public details?: unknown,
  ) {
    super(message, code, statusCode, details);
    this.name = "CommetAPIError";
  }
}

export class CommetValidationError extends CommetError {
  constructor(
    message: string,
    public validationErrors: Record<string, string[]>,
  ) {
    super(message);
    this.name = "CommetValidationError";
  }
}

export type CustomerID = `cus_${string}`;
export type AgreementID = `agr_${string}`;
export type InvoiceID = `inv_${string}`;
export type PhaseID = `phs_${string}`;
export type ItemID = `itm_${string}`;
export type ProductID = `prd_${string}`;
export type EventID = `evt_${string}`;
export type WebhookID = `wh_${string}`;

// Currency enum
export type Currency =
  | "USD"
  | "EUR"
  | "GBP"
  | "CAD"
  | "AUD"
  | "JPY"
  | "ARS"
  | "BRL"
  | "MXN"
  | "CLP";

// Common parameters
export interface ListParams extends Record<string, unknown> {
  limit?: number;
  cursor?: string;
  startDate?: string;
  endDate?: string;
}

export interface RetrieveOptions {
  expand?: string[];
}

// Request options
export interface RequestOptions {
  idempotencyKey?: string;
  timeout?: number;
}

/**
 * Generated types interface - augmented by CLI after 'commet pull'
 *
 * This interface gets filled by module augmentation when you run `commet pull`.
 * The CLI generates a .commet.d.ts file that augments this interface with your
 * organization's specific event and seat types.
 *
 * @example
 * // After running `commet pull`, TypeScript will automatically know your types:
 * await commet.usage.events.create({
 *   eventType: 'api_call', // Autocomplete works!
 *   customerId: 'cus_123'
 * });
 */

// biome-ignore lint/suspicious/noEmptyInterface: <explanation>
export interface CommetGeneratedTypes {}

/**
 * Helper type that provides fallback to string if types are not generated
 */
export type GeneratedEventType = CommetGeneratedTypes extends {
  eventType: infer T;
}
  ? T
  : string;

/**
 * Helper type that provides fallback to string if types are not generated
 */
export type GeneratedSeatType = CommetGeneratedTypes extends {
  seatType: infer T;
}
  ? T
  : string;

/**
 * Helper type that provides fallback to string if types are not generated
 * @deprecated Use GeneratedPlanCode instead
 */
export type GeneratedProductId = CommetGeneratedTypes extends {
  productId: infer T;
}
  ? T
  : string;

/**
 * Helper type that provides fallback to string if types are not generated
 */
export type GeneratedPlanCode = CommetGeneratedTypes extends {
  planCode: infer T;
}
  ? T
  : string;

/**
 * Helper type that provides fallback to string if types are not generated
 */
export type GeneratedFeatureCode = CommetGeneratedTypes extends {
  featureCode: infer T;
}
  ? T
  : string;
