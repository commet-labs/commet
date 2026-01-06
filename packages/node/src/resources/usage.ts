import type {
  ApiResponse,
  CustomerID,
  EventID,
  GeneratedEventType,
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

export interface BatchResult<T> {
  successful: T[];
  failed: Array<{
    index: number;
    error: string;
    data: TrackParams;
  }>;
}

export interface TrackParams {
  feature: string;
  customerId?: CustomerID;
  externalId?: string;
  idempotencyKey?: string;
  value?: number;
  timestamp?: string;
  properties?: Record<string, string>;
}

/**
 * Usage resource - Track consumption events for usage-based billing
 */
export class UsageResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /**
   * Track a usage event
   *
   * @example
   * ```typescript
   * await commet.usage.track({
   *   externalId: 'user_123',
   *   feature: 'api_call',
   *   value: 1,
   *   idempotencyKey: `evt_${requestId}`,
   *   properties: { endpoint: '/users', method: 'GET' }
   * });
   * ```
   */
  async track(
    params: TrackParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<UsageEvent>> {
    const eventData = {
      feature: params.feature,
      customerId: params.customerId,
      externalId: params.externalId,
      idempotencyKey: params.idempotencyKey,
      value: params.value,
      timestamp: params.timestamp || new Date().toISOString(),
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
   *     { externalId: 'user_123', feature: 'api_call', value: 1, idempotencyKey: 'evt_1' },
   *     { externalId: 'user_456', feature: 'api_call', value: 5, idempotencyKey: 'evt_2' }
   *   ]
   * });
   * ```
   */
  async trackBatch(
    params: { events: TrackParams[] },
    options?: RequestOptions,
  ): Promise<ApiResponse<BatchResult<UsageEvent>>> {
    const events = params.events.map((event) => ({
      feature: event.feature,
      customerId: event.customerId,
      externalId: event.externalId,
      idempotencyKey: event.idempotencyKey,
      value: event.value,
      timestamp: event.timestamp || new Date().toISOString(),
      properties: event.properties
        ? Object.entries(event.properties).map(([property, value]) => ({
            property,
            value,
          }))
        : undefined,
    }));

    return this.httpClient.post("/usage/events/batch", { events }, options);
  }
}
