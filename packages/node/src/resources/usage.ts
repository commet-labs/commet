import type { RequestOptions } from "../types/common";
import type { UsageAdjustment, UsageCheck, UsageEvent } from "../types/models";
import type { CommetHTTPClient } from "../utils/http";

export interface CheckUsageAvailabilityParams {
  customerId: string;
  featureCode: string;
  quantity?: number;
}

export type TrackUsageParams =
  | {
      featureCode: string;
      customerId: string;
      eventId?: string;
      /** @format date-time */
      timestamp?: string;
      properties?: Array<{
        property: string;
        value: string;
      }>;
      value?: number;
      cacheReadTokens?: number;
      cacheWriteTokens?: number;
      model: string;
      inputTokens: number;
      outputTokens: number;
    }
  | {
      featureCode: string;
      customerId: string;
      eventId?: string;
      /** @format date-time */
      timestamp?: string;
      properties?: Array<{
        property: string;
        value: string;
      }>;
      value?: number;
      cacheReadTokens?: number;
      cacheWriteTokens?: number;
      model?: never;
      inputTokens?: number;
      outputTokens?: number;
    };

export interface SetUsageParams {
  customerId: string;
  featureCode: string;
  value: number;
  reason?: string;
}

export class UsageResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /** Check if a customer can consume a feature before actual consumption. Returns availability and cost estimates based on the plan's consumption model. */
  async check(
    params: CheckUsageAvailabilityParams,
    options?: RequestOptions,
  ): Promise<UsageCheck> {
    return this.httpClient.post("/usage/check", params, options);
  }

  /** Track a usage event for a metered feature. Deducts from balance/credits if applicable. */
  async track(
    params: TrackUsageParams,
    options?: RequestOptions,
  ): Promise<UsageEvent> {
    return this.httpClient.post("/usage/events", params, options);
  }

  /** Set a metered feature's usage to an exact value for the current period. Use the Idempotency-Key header to make retries safe. */
  async set(
    params: SetUsageParams,
    options?: RequestOptions,
  ): Promise<UsageAdjustment> {
    return this.httpClient.put("/usage", params, options);
  }
}
