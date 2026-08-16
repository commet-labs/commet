import type { RequestOptions } from "../types/common";
import type { TestClock, TestClockRun } from "../types/models";
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

  /**
   * Deprecated. POST /test-clock now advances time and processes every due billing deadline in one durable run.
   * @deprecated
   */
  async processBilling(options?: RequestOptions): Promise<void> {
    return this.httpClient.post("/test-clock/process-billing", {}, options);
  }

  /** Returns the organization's current test clock state and latest durable run. Sandbox only. */
  async get(): Promise<TestClock> {
    return this.httpClient.get("/test-clock");
  }

  /** Starts a durable run that moves the test clock forward and processes every billing deadline due before the target time. Poll GET /test-clock for progress and terminal results. Sandbox only. */
  async advance(
    params: AdvanceTestClockParams,
    options?: RequestOptions,
  ): Promise<TestClockRun> {
    return this.httpClient.post("/test-clock", params, options);
  }
}
