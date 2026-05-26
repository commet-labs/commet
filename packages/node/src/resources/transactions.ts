import type { ApiResponse, RequestOptions } from "../types/common";
import type { CommetHTTPClient } from "../utils/http";

export interface TransactionListItem {
  id: string;
  object: "transaction";
  livemode: boolean;
  invoiceId: string;
  provider: string;
  grossAmount: number;
  subtotal: number;
  taxAmount: number;
  providerFee: number;
  commetFee: number;
  orgNetAmount: number;
  currency: string;
  status: string;
  customerEmail: string;
  customerName: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionDetail extends TransactionListItem {
  providerChargeId: string | null;
  providerPaymentIntentId: string | null;
  providerNetAmount: number;
  presentmentAmount: number | null;
  availableAt: string | null;
}

export interface TransactionRefundResult {
  id: string;
  status: string;
}

export interface TransactionRetryResult {
  id: string;
  status: string;
  retryInvoiceNumber: string;
}

export interface ListTransactionsParams {
  status?: string;
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

  async list(
    params?: ListTransactionsParams,
  ): Promise<ApiResponse<TransactionListItem[]>> {
    return this.httpClient.get("/transactions", params);
  }

  async get(
    params: GetTransactionParams,
  ): Promise<ApiResponse<TransactionDetail>> {
    return this.httpClient.get(`/transactions/${params.id}`);
  }

  /** Full refund only. */
  async refund(
    params: RefundTransactionParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<TransactionRefundResult>> {
    return this.httpClient.post(
      `/transactions/${params.id}/refund`,
      {},
      options,
    );
  }

  /** Creates a new invoice and initiates a new payment attempt. */
  async retry(
    params: RetryTransactionParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<TransactionRetryResult>> {
    return this.httpClient.post(
      `/transactions/${params.id}/retry`,
      {},
      options,
    );
  }
}
