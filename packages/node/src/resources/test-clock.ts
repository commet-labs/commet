import type { ApiResponse, RequestOptions } from "../types/common";
import type { TestClock, TestClockBilling } from "../types/models";
import type { CommetHTTPClient } from "../utils/http";

export interface AdvanceTestClockParams {
  advanceDays?: number;
  /** @format date-time */
  frozenTime?: string;
}

export class TestClockResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /** Returns the organization's current test clock state. Sandbox only. */
  async get(): Promise<ApiResponse<TestClock>> {
    return this.httpClient.get("/test-clock");
  }

  /** Moves the test clock forward, by a number of days (advanceDays) or to an absolute instant (frozenTime). The clock can only move forward. Sandbox only. */
  async advance(
    params?: AdvanceTestClockParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<TestClock>> {
    return this.httpClient.post("/test-clock", params, options);
  }

  /** Discovers customers due for billing at the org's current (simulated) time and enqueues a billing cycle for each — renewals, expired trials, pending cancellations. Enqueueing is asynchronous. Sandbox only. */
  async processBilling(): Promise<ApiResponse<TestClockBilling>> {
    return this.httpClient.post("/test-clock/process-billing", {});
  }
}
