import type {
  ApiResponse,
  CustomerID,
  EventID,
  GeneratedFeatureCode,
  RequestOptions,
} from "../types/common";
import type { CommetHTTPClient } from "../utils/http";

export interface UsageEvent {
  id: EventID;
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
  feature: GeneratedFeatureCode;
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

export class UsageResource {
  constructor(private httpClient: CommetHTTPClient) {}

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
}
