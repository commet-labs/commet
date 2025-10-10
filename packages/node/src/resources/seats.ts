import type {
  ApiResponse,
  CustomerID,
  ListParams,
  RequestOptions,
} from "../types/common";
import type { CommetHTTPClient } from "../utils/http";

export interface SeatBalance {
  id: string;
  organizationId: string;
  customerId: CustomerID;
  seatType: string;
  balance: number;
  asOf: string;
  createdAt: string;
  updatedAt: string;
}

export interface SeatEvent {
  id: string;
  organizationId: string;
  customerId: CustomerID;
  seatType: string;
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

export interface ListSeatEventsParams extends ListParams {
  customerId?: CustomerID;
  seatType?: string;
  eventType?: "add" | "remove" | "set";
}

/**
 * Seats resource for seat-based billing management
 */
export class SeatsResource {
  constructor(private httpClient: CommetHTTPClient) {}

  async add(
    customerId: CustomerID,
    seatType: string,
    count: number,
    options?: RequestOptions,
  ): Promise<ApiResponse<SeatEvent>> {
    return this.httpClient.post(
      `/customers/${customerId}/seats/${seatType}/add`,
      { count },
      options,
    );
  }

  async remove(
    customerId: CustomerID,
    seatType: string,
    count: number,
    options?: RequestOptions,
  ): Promise<ApiResponse<SeatEvent>> {
    return this.httpClient.post(
      `/customers/${customerId}/seats/${seatType}/remove`,
      { count },
      options,
    );
  }

  async set(
    customerId: CustomerID,
    seatType: string,
    count: number,
    options?: RequestOptions,
  ): Promise<ApiResponse<SeatEvent>> {
    return this.httpClient.post(
      `/customers/${customerId}/seats/${seatType}/set`,
      { count },
      options,
    );
  }

  async bulkUpdate(
    customerId: CustomerID,
    seats: BulkSeatUpdate,
    options?: RequestOptions,
  ): Promise<ApiResponse<SeatEvent[]>> {
    return this.httpClient.post(
      `/customers/${customerId}/seats/bulk-update`,
      { seats },
      options,
    );
  }

  async getBalance(
    customerId: CustomerID,
    seatType: string,
  ): Promise<ApiResponse<SeatBalanceResponse>> {
    return this.httpClient.get(
      `/customers/${customerId}/seats/${seatType}/balance`,
    );
  }

  async getAllBalances(
    customerId: CustomerID,
  ): Promise<ApiResponse<Record<string, SeatBalanceResponse>>> {
    return this.httpClient.get(`/customers/${customerId}/seats/balances`);
  }

  async getHistory(
    customerId: CustomerID,
    seatType: string,
    params?: ListSeatEventsParams,
  ): Promise<ApiResponse<SeatEvent[]>> {
    const queryParams = {
      ...params,
      customerId,
      seatType,
    };
    return this.httpClient.get(
      `/customers/${customerId}/seats/history`,
      queryParams,
    );
  }

  async listEvents(
    params?: ListSeatEventsParams,
  ): Promise<ApiResponse<SeatEvent[]>> {
    return this.httpClient.get("/seats/events", params);
  }
}
