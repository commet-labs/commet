import type { RequestOptions } from "../types/common";
import type {
  SeatBalance,
  SeatBalanceCollection,
  SeatEvent,
} from "../types/models";
import type { CommetHTTPClient } from "../utils/http";

export interface GetSeatBalanceParams {
  customerId: string;
  featureCode: string;
}

export interface GetAllSeatBalancesParams {
  customerId: string;
}

export interface BulkSetSeatsParams {
  customerId: string;
  seats: Record<string, number>;
}

export interface RemoveSeatsParams {
  customerId: string;
  featureCode: string;
  count: number;
}

export interface AddSeatsParams {
  customerId: string;
  featureCode: string;
  count: number;
}

export interface SetSeatsParams {
  customerId: string;
  featureCode: string;
  count: number;
}

export class SeatsResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /** Get current balance for a specific seat type. */
  async getBalance(
    params: GetSeatBalanceParams,
    options?: RequestOptions,
  ): Promise<SeatBalance> {
    return this.httpClient.get("/seats/balance", params, options);
  }

  /** Get the current balance for all seat types in a customer's subscription. */
  async getAllBalances(
    params: GetAllSeatBalancesParams,
    options?: RequestOptions,
  ): Promise<SeatBalanceCollection> {
    return this.httpClient.get("/seats/balances", params, options);
  }

  /** Set all seat types at once. */
  async setAll(
    params: BulkSetSeatsParams,
    options?: RequestOptions,
  ): Promise<{
    object: "list";
    data: Array<SeatEvent>;
    hasMore: boolean;
    nextCursor?: string;
  }> {
    return this.httpClient.put("/seats/bulk", params, options);
  }

  /** Remove seats from a customer's subscription. Takes effect at the end of the billing period. */
  async remove(
    params: RemoveSeatsParams,
    options?: RequestOptions,
  ): Promise<SeatEvent> {
    return this.httpClient.post("/seats/remove", params, options);
  }

  /** Add seats to a customer's subscription. Prorates charges for the current billing period. */
  async add(
    params: AddSeatsParams,
    options?: RequestOptions,
  ): Promise<SeatEvent> {
    return this.httpClient.post("/seats", params, options);
  }

  /** Set seats to an exact count. */
  async set(
    params: SetSeatsParams,
    options?: RequestOptions,
  ): Promise<SeatEvent> {
    return this.httpClient.put("/seats", params, options);
  }
}
