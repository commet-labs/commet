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

export interface BatchResult<T> {
  successful: T[];
  failed: Array<{
    index: number;
    error: string;
    data: TrackUsageParams;
  }>;
}

export interface ListUsageEventsParams extends ListParams {
  customerId?: CustomerID;
  externalId?: string;
  eventType?: GeneratedEventType;
  idempotencyKey?: string;
}

export interface TrackUsageParams {
  eventType: GeneratedEventType;
  customerId?: CustomerID;
  externalId?: string;
  idempotencyKey?: string;
  value?: number;
  timestamp?: string;
  properties?: Record<string, string>;
}

export interface GetUsageSummaryParams {
  customerId?: CustomerID;
  externalId?: string;
  eventType?: GeneratedEventType;
}

export interface UsageSummary {
  eventType: string;
  total: number;
  included: number;
  overage: number;
  estimatedCost: number;
  periodStart: string;
  periodEnd: string;
}

/**
 * Usage Events resource - Track business events for usage-based billing
 */
export class UsageResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /**
   * Track a usage event (preferred method)
   *
   * @example
   * ```typescript
   * await commet.usage.track({
   *   externalId: 'user_123',
   *   eventType: 'api_call',
   *   idempotencyKey: `evt_${requestId}`,
   *   properties: { endpoint: '/users', method: 'GET' }
   * });
   * ```
   */
  async track(
    params: TrackUsageParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<UsageEvent>> {
    const eventData = {
      eventType: params.eventType,
      customerId: params.customerId,
      externalId: params.externalId,
      idempotencyKey: params.idempotencyKey,
      ts: params.timestamp || new Date().toISOString(),
      properties: params.properties
        ? Object.entries(params.properties).map(([property, value]) => ({
            property,
            value,
          }))
        : undefined,
    };

    return this.httpClient.post("/usage/events", eventData, options);
  }

  /**
   * Track multiple usage events in a batch
   *
   * @example
   * ```typescript
   * await commet.usage.trackBatch({
   *   events: [
   *     { externalId: 'user_123', eventType: 'api_call', idempotencyKey: 'evt_1' },
   *     { externalId: 'user_456', eventType: 'api_call', idempotencyKey: 'evt_2' }
   *   ]
   * });
   * ```
   */
  async trackBatch(
    params: { events: TrackUsageParams[] },
    options?: RequestOptions,
  ): Promise<ApiResponse<BatchResult<UsageEvent>>> {
    const events = params.events.map((event) => ({
      eventType: event.eventType,
      customerId: event.customerId,
      externalId: event.externalId,
      idempotencyKey: event.idempotencyKey,
      ts: event.timestamp || new Date().toISOString(),
      properties: event.properties
        ? Object.entries(event.properties).map(([property, value]) => ({
            property,
            value,
          }))
        : undefined,
    }));

    return this.httpClient.post("/usage/events/batch", { events }, options);
  }

  async get(eventId: EventID): Promise<ApiResponse<UsageEvent>> {
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
