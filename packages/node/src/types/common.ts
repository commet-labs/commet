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

export interface CommetErrorContext {
  type?: string;
  param?: string;
  requestId?: string;
  docUrl?: string;
}

export class CommetError extends Error {
  public type?: string;
  public param?: string;
  public requestId?: string;
  public docUrl?: string;

  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public details?: unknown,
    context?: CommetErrorContext,
  ) {
    super(message);
    this.name = "CommetError";
    this.type = context?.type;
    this.param = context?.param;
    this.requestId = context?.requestId;
    this.docUrl = context?.docUrl;
  }

  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      type: this.type,
      code: this.code,
      statusCode: this.statusCode,
      param: this.param,
      details: this.details,
      requestId: this.requestId,
      docUrl: this.docUrl,
    };
  }
}

export class CommetAPIError extends CommetError {
  constructor(
    message: string,
    statusCode: number,
    code?: string,
    details?: unknown,
    errorDetail?: ApiErrorDetail,
    responseContext?: Pick<CommetErrorContext, "requestId">,
  ) {
    super(message, code, statusCode, details, {
      type: errorDetail?.type,
      param: errorDetail?.param,
      requestId: responseContext?.requestId,
      docUrl: errorDetail?.doc_url,
    });
    this.name = "CommetAPIError";
  }
}

export class CommetValidationError extends CommetAPIError {
  constructor(
    message: string,
    public validationErrors: Record<string, string[]>,
    statusCode = 422,
    errorDetail?: ApiErrorDetail,
    responseContext?: Pick<CommetErrorContext, "requestId">,
  ) {
    super(
      message,
      statusCode,
      errorDetail?.code ?? "validation_error",
      errorDetail?.details,
      errorDetail,
      responseContext,
    );
    this.name = "CommetValidationError";
  }

  override toJSON(): Record<string, unknown> {
    return { ...super.toJSON(), validationErrors: this.validationErrors };
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
