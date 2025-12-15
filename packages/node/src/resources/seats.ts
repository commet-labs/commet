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
  customerId?: CustomerID;
  externalId?: string;
  seatType: GeneratedSeatType;
  count: number;
}

export interface RemoveParams {
  customerId?: CustomerID;
  externalId?: string;
  seatType: GeneratedSeatType;
  count: number;
}

export interface SetParams {
  customerId?: CustomerID;
  externalId?: string;
  seatType: GeneratedSeatType;
  count: number;
}

export interface SetAllParams {
  customerId?: CustomerID;
  externalId?: string;
  seats: Record<string, number>;
}

export interface GetBalanceParams {
  customerId?: CustomerID;
  externalId?: string;
  seatType: GeneratedSeatType;
}

export interface GetAllBalancesParams {
  customerId?: CustomerID;
  externalId?: string;
}

/**
 * Seats resource - Manage seat-based licenses
 */
export class SeatsResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /**
   * Add seats
   *
   * @example
   * ```typescript
   * await commet.seats.add({
   *   externalId: 'user_123',
   *   seatType: 'editor',
   *   count: 5
   * });
   * ```
   */
  async add(
    params: AddParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<SeatEvent>> {
    return this.httpClient.post("/seats", params, options);
  }

  /**
   * Remove seats
   *
   * @example
   * ```typescript
   * await commet.seats.remove({
   *   externalId: 'user_123',
   *   seatType: 'editor',
   *   count: 2
   * });
   * ```
   */
  async remove(
    params: RemoveParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<SeatEvent>> {
    return this.httpClient.delete("/seats", params, options);
  }

  /**
   * Set seats to a specific count
   *
   * @example
   * ```typescript
   * await commet.seats.set({
   *   externalId: 'user_123',
   *   seatType: 'editor',
   *   count: 10
   * });
   * ```
   */
  async set(
    params: SetParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<SeatEvent>> {
    return this.httpClient.put("/seats", params, options);
  }

  /**
   * Set all seat types
   *
   * @example
   * ```typescript
   * await commet.seats.setAll({
   *   externalId: 'user_123',
   *   seats: { editor: 10, viewer: 50 }
   * });
   * ```
   */
  async setAll(
    params: SetAllParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<SeatEvent[]>> {
    return this.httpClient.put("/seats/bulk", params, options);
  }

  /**
   * Get balance for a seat type
   *
   * @example
   * ```typescript
   * const balance = await commet.seats.getBalance({
   *   externalId: 'user_123',
   *   seatType: 'editor'
   * });
   * ```
   */
  async getBalance(
    params: GetBalanceParams,
  ): Promise<ApiResponse<SeatBalance>> {
    const { customerId, externalId, seatType } = params;

    return this.httpClient.get("/seats/balance", {
      customerId: customerId,
      externalId: externalId,
      seatType: seatType,
    });
  }

  /**
   * Get all seat balances
   *
   * @example
   * ```typescript
   * const balances = await commet.seats.getAllBalances({
   *   externalId: 'user_123'
   * });
   * ```
   */
  async getAllBalances(
    params: GetAllBalancesParams,
  ): Promise<ApiResponse<Record<string, SeatBalance>>> {
    const { customerId, externalId } = params;

    return this.httpClient.get("/seats/balances", {
      customerId: customerId,
      externalId: externalId,
    });
  }
}
