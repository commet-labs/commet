export type CommetClientOptions = {
  apiKey: string;
  apiVersion?: string;
  debug?: boolean;
  timeout?: number;
  retries?: number;
  telemetry?: boolean;
};

export interface ApiErrorDetail {
  type: string;
  code: string;
  message: string;
  param?: string;
  details?: unknown;
  doc_url?: string;
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
  public type?: string;
  public param?: string;
  public docUrl?: string;

  constructor(
    message: string,
    public statusCode: number,
    public code?: string,
    public details?: unknown,
    errorDetail?: ApiErrorDetail,
  ) {
    super(message, code, statusCode, details);
    this.name = "CommetAPIError";
    this.type = errorDetail?.type;
    this.param = errorDetail?.param;
    this.docUrl = errorDetail?.doc_url;
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
