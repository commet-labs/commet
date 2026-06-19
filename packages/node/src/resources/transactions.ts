import type { ApiResponse, RequestOptions } from "../types/common";
import type { TransactionStatus } from "../types/enums";
import type {
  Transaction,
  TransactionRefund,
  TransactionRetry,
} from "../types/models";
import type { CommetHTTPClient } from "../utils/http";

export interface ListTransactionsParams {
  status?: TransactionStatus;
  customerEmail?: string;
  limit?: number;
  cursor?: string;
}

export interface GetTransactionParams {
  id: string;
}

export interface RefundTransactionParams {
  id: string;
}

export interface RetryTransactionParams {
  id: string;
}

export class TransactionsResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /** List payment transactions with cursor-based pagination. Filter by status or customer email. */
  async list(
    params?: ListTransactionsParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Array<Transaction>>> {
    return this.httpClient.get("/transactions", params, options);
  }

  /** Retrieve a single payment transaction by its public ID, including provider details. */
  async get(
    params: GetTransactionParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Transaction>> {
    const { id } = params;
    return this.httpClient.get(`/transactions/${id}`, undefined, options);
  }

  /** Issue a full refund for a payment transaction. */
  async refund(
    params: RefundTransactionParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<TransactionRefund>> {
    const { id } = params;
    return this.httpClient.post(`/transactions/${id}/refund`, {}, options);
  }

  /** Retry a failed subscription renewal. Re-charges the outstanding renewal invoice through the recovery engine. */
  async retry(
    params: RetryTransactionParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<TransactionRetry>> {
    const { id } = params;
    return this.httpClient.post(`/transactions/${id}/retry`, {}, options);
  }
}
