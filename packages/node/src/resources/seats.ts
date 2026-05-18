import type { ApiResponse, CustomerID, RequestOptions } from "../types/common";
import type { CommetHTTPClient } from "../utils/http";

export interface SeatEvent {
  id: string;
  organizationId: string;
  customerId: CustomerID;
  featureCode: string;
  /** @deprecated Use featureCode */
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

export interface AddParams {
  customerId: CustomerID;
  featureCode?: string;
  /** @deprecated Use featureCode instead */
  seatType?: string;
  count: number;
}

export interface RemoveParams {
  customerId: CustomerID;
  featureCode?: string;
  /** @deprecated Use featureCode instead */
  seatType?: string;
  count: number;
}

export interface SetParams {
  customerId: CustomerID;
  featureCode?: string;
  /** @deprecated Use featureCode instead */
  seatType?: string;
  count: number;
}

export interface SetAllParams {
  customerId: CustomerID;
  seats: Record<string, number>;
}

export interface GetBalanceParams {
  customerId: CustomerID;
  featureCode?: string;
  /** @deprecated Use featureCode instead */
  seatType?: string;
}

export interface GetAllBalancesParams {
  customerId: CustomerID;
}

function resolveCode(params: {
  featureCode?: string;
  seatType?: string;
}): string {
  const code = params.featureCode ?? params.seatType;
  if (!code) {
    throw new Error("Either featureCode or seatType must be provided");
  }
  return code;
}

export class SeatsResource {
  constructor(private httpClient: CommetHTTPClient) {}

  async add(
    params: AddParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<SeatEvent>> {
    const code = resolveCode(params);
    return this.httpClient.post(
      "/seats",
      { customerId: params.customerId, seatType: code, count: params.count },
      options,
    );
  }

  async remove(
    params: RemoveParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<SeatEvent>> {
    const code = resolveCode(params);
    return this.httpClient.delete(
      "/seats",
      { customerId: params.customerId, seatType: code, count: params.count },
      options,
    );
  }

  async set(
    params: SetParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<SeatEvent>> {
    const code = resolveCode(params);
    return this.httpClient.put(
      "/seats",
      { customerId: params.customerId, seatType: code, count: params.count },
      options,
    );
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
    const code = resolveCode(params);
    return this.httpClient.get("/seats/balance", {
      customerId: params.customerId,
      seatType: code,
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
