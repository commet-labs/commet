import type { ApiResponse, RequestOptions } from "../types/common";
import type {
  BulkSeatUpdate,
  SeatBalance,
  SeatBalanceListItem,
  SeatEvent,
} from "../types/models";
import type { CommetHTTPClient } from "../utils/http";

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

export interface RemoveSeatsParams {
  customerId: string;
  featureCode: string;
  count: number;
}

export interface BulkSetSeatsParams {
  customerId: string;
  seats: Record<string, number>;
}

export interface GetSeatBalanceParams {
  customerId: string;
  featureCode: string;
}

export interface GetAllSeatBalancesParams {
  customerId: string;
}

export class SeatsResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /** Add seats to a customer's subscription. Prorates charges for the current billing period. */
  async add(
    params: AddSeatsParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<SeatEvent>> {
    return this.httpClient.post("/seats", params, options);
  }

  /** Set seats to an exact count. */
  async set(
    params: SetSeatsParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<SeatEvent>> {
    return this.httpClient.put("/seats", params, options);
  }

  /** Remove seats from a customer's subscription. Takes effect at the end of the billing period. */
  async remove(
    params: RemoveSeatsParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<SeatEvent>> {
    return this.httpClient.delete("/seats", params, options);
  }

  /** Set all seat types at once. */
  async setAll(
    params: BulkSetSeatsParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Array<BulkSeatUpdate>>> {
    return this.httpClient.put("/seats/bulk", params, options);
  }

  /** Get current balance for a specific seat type. */
  async getBalance(
    params: GetSeatBalanceParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<SeatBalance>> {
    return this.httpClient.get("/seats/balance", params, options);
  }

  /** Get the current balance for all seat types in a customer's subscription. */
  async getAllBalances(
    params: GetAllSeatBalancesParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<SeatBalanceListItem>> {
    return this.httpClient.get("/seats/balances", params, options);
  }
}
