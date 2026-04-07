import type {
  ApiResponse,
  CustomerID,
  GeneratedSeatType,
  RequestOptions,
} from "../types/common";
import type { CommetHTTPClient } from "../utils/http";

export interface SeatEvent {
  id: string;
  organizationId: string;
  customerId: CustomerID;
  seatType: GeneratedSeatType;
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

export interface AddParams {
  customerId: CustomerID;
  seatType: GeneratedSeatType;
  count: number;
}

export interface RemoveParams {
  customerId: CustomerID;
  seatType: GeneratedSeatType;
  count: number;
}

export interface SetParams {
  customerId: CustomerID;
  seatType: GeneratedSeatType;
  count: number;
}

export interface SetAllParams {
  customerId: CustomerID;
  seats: Record<string, number>;
}

export interface GetBalanceParams {
  customerId: CustomerID;
  seatType: GeneratedSeatType;
}

export interface GetAllBalancesParams {
  customerId: CustomerID;
}

export class SeatsResource {
  constructor(private httpClient: CommetHTTPClient) {}

  async add(
    params: AddParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<SeatEvent>> {
    return this.httpClient.post("/seats", params, options);
  }

  async remove(
    params: RemoveParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<SeatEvent>> {
    return this.httpClient.delete("/seats", params, options);
  }

  async set(
    params: SetParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<SeatEvent>> {
    return this.httpClient.put("/seats", params, options);
  }

  async setAll(
    params: SetAllParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<SeatEvent[]>> {
    return this.httpClient.put("/seats/bulk", params, options);
  }

  async getBalance(
    params: GetBalanceParams,
  ): Promise<ApiResponse<SeatBalance>> {
    return this.httpClient.get("/seats/balance", {
      customerId: params.customerId,
      seatType: params.seatType,
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
