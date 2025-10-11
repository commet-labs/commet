import type {
  ApiResponse,
  CustomerID,
  GeneratedSeatType,
  ListParams,
  RequestOptions,
} from "../types/common";
import type { CommetHTTPClient } from "../utils/http";

export interface SeatBalance {
  id: string;
  organizationId: string;
  customerId: CustomerID;
  seatType: GeneratedSeatType;
  balance: number;
  asOf: string;
  createdAt: string;
  updatedAt: string;
}

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

export interface SeatBalanceResponse {
  current: number;
  asOf: string;
}

export interface BulkSeatUpdate {
  [seatType: string]: number;
}

export interface AddSeatsParams {
  customerId: CustomerID;
  seatType: GeneratedSeatType;
  count: number;
}

export interface RemoveSeatsParams {
  customerId: CustomerID;
  seatType: GeneratedSeatType;
  count: number;
}

export interface SetSeatsParams {
  customerId: CustomerID;
  seatType: GeneratedSeatType;
  count: number;
}

export interface BulkUpdateSeatsParams {
  customerId: CustomerID;
  seats: BulkSeatUpdate;
}

export interface GetBalanceParams {
  customerId: CustomerID;
  seatType: GeneratedSeatType;
}

export interface GetAllBalancesParams {
  customerId: CustomerID;
}

export interface ListSeatEventsParams extends ListParams {
  customerId?: CustomerID;
  seatType?: GeneratedSeatType;
  eventType?: "add" | "remove" | "set";
}

/**
 * Seats resource for seat-based billing management
 */
export class SeatsResource {
  constructor(private httpClient: CommetHTTPClient) {}

  async add(
    params: AddSeatsParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<SeatEvent>> {
    return this.httpClient.post(
      "/seats",
      {
        customerId: params.customerId,
        seatType: params.seatType,
        count: params.count,
      },
      options,
    );
  }

  async remove(
    params: RemoveSeatsParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<SeatEvent>> {
    return this.httpClient.delete(
      "/seats",
      {
        customerId: params.customerId,
        seatType: params.seatType,
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
        seatType: params.seatType,
        count: params.count,
      },
      options,
    );
  }

  async bulkUpdate(
    params: BulkUpdateSeatsParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<SeatEvent[]>> {
    return this.httpClient.put(
      "/seats/bulk",
      { customerId: params.customerId, seats: params.seats },
      options,
    );
  }

  async getBalance(
    params: GetBalanceParams,
  ): Promise<ApiResponse<SeatBalanceResponse>> {
    return this.httpClient.get("/seats/balance", {
      customerId: params.customerId,
      seatType: params.seatType,
    });
  }

  async getAllBalances(
    params: GetAllBalancesParams,
  ): Promise<ApiResponse<Record<string, SeatBalanceResponse>>> {
    return this.httpClient.get("/seats/balances", {
      customerId: params.customerId,
    });
  }

  async listEvents(
    params?: ListSeatEventsParams,
  ): Promise<ApiResponse<SeatEvent[]>> {
    return this.httpClient.get("/seats/events", params);
  }
}
