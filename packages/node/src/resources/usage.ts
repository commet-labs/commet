import type {
  ApiResponse,
  CustomerID,
  EventID,
  RequestOptions,
} from "../types/common";
import type { CommetHTTPClient } from "../utils/http";
import type { ConsumptionModel } from "./plans";

export type UsageCheckDenialReason =
  | "included_limit_reached"
  | "insufficient_credits"
  | "insufficient_balance";

export interface UsageEvent {
  id: EventID;
  object: "usage_event";
  livemode: boolean;
  organizationId: string;
  customerId: CustomerID;
  feature: string;
  idempotencyKey?: string;
  ts: string;
  properties?: UsageEventProperty[];
  createdAt: string;
}

export interface UsageEventProperty {
  id: string;
  usageEventId: EventID;
  property: string;
  value: string;
  createdAt: string;
}

interface TrackBaseParams {
  feature: string;
  customerId: CustomerID;
  idempotencyKey?: string;
  timestamp?: string;
  properties?: Record<string, string>;
}

export interface TrackUsageParams extends TrackBaseParams {
  value?: number;
  model?: never;
}

export interface TrackModelTokensParams extends TrackBaseParams {
  model: string;
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens?: number;
  cacheWriteTokens?: number;
  value?: never;
}

export type TrackParams = TrackUsageParams | TrackModelTokensParams;

export interface CheckUsageParams {
  customerId: CustomerID;
  featureCode: string;
  quantity: number;
}

export interface UsageCheckResult {
  allowed: boolean;
  consumptionModel: ConsumptionModel;
  feature: string;
  quantity: number;
  current?: number;
  remaining?: number;
  unlimited?: boolean;
  included?: number;
  overageEnabled?: boolean;
  overageUnitPrice?: number | null;
  creditsPerUnit?: number;
  estimatedCredits?: number;
  planCredits?: number;
  purchasedCredits?: number;
  totalCredits?: number;
  unitPrice?: number;
  estimatedAmount?: number;
  currentBalance?: number;
  blockOnExhaustion?: boolean;
  currency?: string;
  reason?: UsageCheckDenialReason;
  message?: string;
}

export class UsageResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /** Deducts from balance/credits if the plan uses consumption. Duplicate `idempotencyKey` is rejected. */
  async track(
    params: TrackParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<UsageEvent>> {
    const eventData: Record<string, unknown> = {
      feature: params.feature,
      customerId: params.customerId,
      idempotencyKey: params.idempotencyKey,
      timestamp: params.timestamp || new Date().toISOString(),
      properties: params.properties
        ? Object.entries(params.properties).map(([property, value]) => ({
            property,
            value,
          }))
        : undefined,
    };

    if ("model" in params && params.model) {
      eventData.model = params.model;
      eventData.inputTokens = params.inputTokens;
      eventData.outputTokens = params.outputTokens;
      if (params.cacheReadTokens) {
        eventData.cacheReadTokens = params.cacheReadTokens;
      }
      if (params.cacheWriteTokens) {
        eventData.cacheWriteTokens = params.cacheWriteTokens;
      }
    } else {
      eventData.value = (params as TrackUsageParams).value;
    }

    return this.httpClient.post("/usage/events", eventData, options);
  }

  /** Dry-run: checks if a usage event would be allowed without actually tracking it. */
  async check(
    params: CheckUsageParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<UsageCheckResult>> {
    return this.httpClient.post("/usage/check", params, options);
  }
}
