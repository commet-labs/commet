import type { RequestOptions } from "../types/common";
import type { TransactionStatus } from "../types/enums";
import type { Refund, Transaction, TransactionRetry } from "../types/models";
import type { CommetHTTPClient } from "../utils/http";

export interface RefundTransactionParams {
  id: string;
}

export interface RetryTransactionParams {
  id: string;
}

export interface GetTransactionParams {
  id: string;
}

export interface ListTransactionsParams {
  cursor?: string;
  limit?: number;
  status?: TransactionStatus;
  customerEmail?: string;
}

export class TransactionsResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /** Issue a full refund and return the provider-neutral refund resource with its actual status. */
  async refund(
    params: RefundTransactionParams,
    options?: RequestOptions,
  ): Promise<Refund> {
    const { id } = params;
    return this.httpClient.post(`/transactions/${id}/refund`, {}, options);
  }

  /** Retry a failed subscription renewal and return an honest retry result. The original failed transaction remains immutable. */
  async retry(
    params: RetryTransactionParams,
    options?: RequestOptions,
  ): Promise<TransactionRetry> {
    const { id } = params;
    return this.httpClient.post(`/transactions/${id}/retry`, {}, options);
  }

  /** Retrieve a single payment transaction by its public ID, including provider details. */
  async get(
    params: GetTransactionParams,
    options?: RequestOptions,
  ): Promise<Transaction> {
    const { id } = params;
    return this.httpClient.get(`/transactions/${id}`, undefined, options);
  }

  /** List payment transactions with cursor-based pagination. Filter by status or customer email. */
  async list(
    params?: ListTransactionsParams,
    options?: RequestOptions,
  ): Promise<{
    object: "list";
    data: Array<Transaction>;
    hasMore: boolean;
    nextCursor?: string;
  }> {
    return this.httpClient.get("/transactions", params, options);
  }
}
