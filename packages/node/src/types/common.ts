export type CommetClientOptions = {
  apiKey: string;
  apiVersion?: string;
  debug?: boolean;
  timeout?: number;
  retries?: number;
  telemetry?: boolean;
};

/** @deprecated Use CommetClientOptions */
export type CommetConfig = CommetClientOptions;

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  code?: string;
  message?: string;
  details?: unknown;
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

export type CustomerID = string;
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
  apiVersion?: string;
  idempotencyKey?: string;
  timeout?: number;
}

import type {
  InferFeatureCodes,
  InferPlanCodes,
  InferSeatCodes,
  InferUsageCodes,
} from "./config";

export type ResolvedFeatureCode<TConfig> = [
  InferFeatureCodes<TConfig>,
] extends [never]
  ? string
  : InferFeatureCodes<TConfig>;

export type ResolvedSeatCode<TConfig> = [InferSeatCodes<TConfig>] extends [
  never,
]
  ? string
  : InferSeatCodes<TConfig>;

export type ResolvedUsageCode<TConfig> = [InferUsageCodes<TConfig>] extends [
  never,
]
  ? string
  : InferUsageCodes<TConfig>;

export type ResolvedPlanCode<TConfig> = [InferPlanCodes<TConfig>] extends [
  never,
]
  ? string
  : InferPlanCodes<TConfig>;
