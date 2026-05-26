import type { ApiResponse, CustomerID, RequestOptions } from "../types/common";
import type { CommetHTTPClient } from "../utils/http";

export interface SeatEvent {
  id: string;
  object: "seat";
  livemode: boolean;
  organizationId: string;
  customerId: CustomerID;
  featureCode: string;
  seatType: string;
  eventType: "add" | "remove" | "set";
  quantity: number;
  previousBalance?: number;
  newBalance: number;
  ts: string;
  createdAt: string;
}

export interface SeatBalance {
  current: number;
  asOf: string;
}

export interface AddSeatsParams {
  customerId: CustomerID;
  featureCode: string;
  count: number;
}

export interface RemoveSeatsParams {
  customerId: CustomerID;
  featureCode: string;
  count: number;
}

export interface SetSeatsParams {
  customerId: CustomerID;
  featureCode: string;
  count: number;
}

export interface SetAllSeatsParams {
  customerId: CustomerID;
  seats: Record<string, number>;
}

export interface GetBalanceParams {
  customerId: CustomerID;
  featureCode: string;
}

export interface GetAllBalancesParams {
  customerId: CustomerID;
}

export class SeatsResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /** Prorates charges for the current billing period. */
  async add(
    params: AddSeatsParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<SeatEvent>> {
    return this.httpClient.post(
      "/seats",
      {
        customerId: params.customerId,
        seatType: params.featureCode,
        count: params.count,
      },
      options,
    );
  }

  /** Removal takes effect at the end of the billing period. */
  async remove(
    params: RemoveSeatsParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<SeatEvent>> {
    return this.httpClient.delete(
      "/seats",
      {
        customerId: params.customerId,
        seatType: params.featureCode,
        count: params.count,
      },
      options,
    );
  }

  async set(
    params: SetSeatsParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<SeatEvent>> {
    return this.httpClient.put(
      "/seats",
      {
        customerId: params.customerId,
        seatType: params.featureCode,
        count: params.count,
      },
      options,
    );
  }

  async setAll(
    params: SetAllSeatsParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<SeatEvent[]>> {
    return this.httpClient.put("/seats/bulk", params, options);
  }

  async getBalance(
    params: GetBalanceParams,
  ): Promise<ApiResponse<SeatBalance>> {
    return this.httpClient.get("/seats/balance", {
      customerId: params.customerId,
      seatType: params.featureCode,
    });
  }

  async getAllBalances(
    params: GetAllBalancesParams,
  ): Promise<ApiResponse<Record<string, SeatBalance>>> {
    return this.httpClient.get("/seats/balances", {
      customerId: params.customerId,
    });
  }
}
