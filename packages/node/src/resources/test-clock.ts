import type { RequestOptions } from "../types/common";
import type { TestClock, TestClockBilling } from "../types/models";
import type { CommetHTTPClient } from "../utils/http";

export type AdvanceTestClockParams =
  | {
      advanceDays: number;
    }
  | {
      /** @format date-time */
      frozenTime: string;
    };

export class TestClockResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /** Discovers customers due for billing at the org's current (simulated) time and enqueues a billing cycle for each — renewals, expired trials, pending cancellations. Also fires any dunning retry whose scheduled time has passed. Enqueueing is asynchronous. Sandbox only. */
  async processBilling(options?: RequestOptions): Promise<TestClockBilling> {
    return this.httpClient.post("/test-clock/process-billing", {}, options);
  }

  /** Returns the organization's current test clock state. Sandbox only. */
  async get(): Promise<TestClock> {
    return this.httpClient.get("/test-clock");
  }

  /** Moves the test clock forward, by a number of days (advanceDays) or to an absolute instant (frozenTime). The clock can only move forward. Sandbox only. */
  async advance(
    params?: AdvanceTestClockParams,
    options?: RequestOptions,
  ): Promise<TestClock> {
    return this.httpClient.post("/test-clock", params, options);
  }
}
