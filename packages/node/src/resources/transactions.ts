import type { RequestOptions } from "../types/common";
import type { TransactionStatus } from "../types/enums";
import type {
  Refund,
  Transaction,
  TransactionListItem,
  TransactionRetry,
} from "../types/models";
import type { CommetHTTPClient } from "../utils/http";

export interface RefundTransactionParams {
  id: string;
  /** Amount returned to the customer, including tax, in the payment currency’s smallest unit. Omit to refund the remainder. */
  amount?: number;
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

  /** Refund a positive amount in the payment currency’s smallest unit, or omit amount to refund the remaining amount. Returns the refund resource with its actual status. */
  async refund(
    params: RefundTransactionParams,
    options?: RequestOptions,
  ): Promise<Refund> {
    const { id, ...rest } = params;
    return this.httpClient.post(`/transactions/${id}/refund`, rest, options);
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
    data: Array<TransactionListItem>;
    hasMore: boolean;
    nextCursor?: string;
  }> {
    return this.httpClient.get("/transactions", params, options);
  }
}
