import type {
  ApiResponse,
  CustomerID,
  EventID,
  GeneratedEventType,
  ListParams,
  RequestOptions,
} from "../types/common";
import type { CommetHTTPClient } from "../utils/http";

export interface UsageEvent {
  id: EventID;
  organizationId: string;
  customerId: CustomerID;
  eventType: GeneratedEventType;
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

export interface CreateUsageEventParams {
  eventType: GeneratedEventType;
  customerId: CustomerID;
  idempotencyKey?: string; // For idempotency
  timestamp?: string; // ISO string, defaults to now
  properties?: Array<{
    property: string;
    value: string;
  }>;
}

export interface CreateBatchUsageEventsParams {
  events: CreateUsageEventParams[];
}

export interface BatchResult<T> {
  successful: T[];
  failed: Array<{
    index: number;
    error: string;
    data: CreateUsageEventParams;
  }>;
}

export interface ListUsageEventsParams extends ListParams {
  customerId?: CustomerID;
  eventType?: GeneratedEventType;
  idempotencyKey?: string;
}

/**
 * Usage Events resource - Track business events for usage-based billing
 */
export class UsageResource {
  constructor(private httpClient: CommetHTTPClient) {}

  async create(
    params: CreateUsageEventParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<UsageEvent>> {
    const eventData = {
      ...params,
      ts: params.timestamp || new Date().toISOString(),
    };

    return this.httpClient.post("/usage/events", eventData, options);
  }

  async createBatch(
    params: CreateBatchUsageEventsParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<BatchResult<UsageEvent>>> {
    return this.httpClient.post("/usage/events/batch", params, options);
  }

  async retrieve(eventId: EventID): Promise<ApiResponse<UsageEvent>> {
    return this.httpClient.get(`/usage/events/${eventId}`);
  }

  async list(
    params?: ListUsageEventsParams,
  ): Promise<ApiResponse<UsageEvent[]>> {
    return this.httpClient.get("/usage/events", params);
  }

  async delete(
    eventId: EventID,
    options?: RequestOptions,
  ): Promise<ApiResponse<{ deleted: boolean }>> {
    return this.httpClient.delete(
      `/usage/events/${eventId}`,
      undefined,
      options,
    );
  }
}
