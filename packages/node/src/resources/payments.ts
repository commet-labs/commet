import type { ApiResponse, RequestOptions } from "../types/common";
import type { Payment } from "../types/models";
import type { CommetHTTPClient } from "../utils/http";

export interface ListPaymentsParams {
  customerId?: string;
  /** @format date-time */
  cursor?: string;
  limit?: number;
}

export interface CreatePaymentParams {
  amount: number;
  currency: string;
  customerId?: string;
  description: string;
  successUrl?: string;
  metadata?: Record<string, string>;
}

export interface ChargePaymentParams {
  customerId: string;
  amount: number;
  currency: string;
  description: string;
  metadata?: Record<string, string>;
}

export interface GetPaymentParams {
  id: string;
}

export interface CancelPaymentParams {
  id: string;
}

export class PaymentsResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /** List payments with cursor-based pagination. Filter by customer. */
  async list(
    params?: ListPaymentsParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Array<Payment>>> {
    return this.httpClient.get("/payments", params, options);
  }

  /** Create a hosted payment link. Returns a url the customer opens to pay with any card. Calculates tax, generates an invoice, and vaults the payment method on confirmation. No subscription or plan required. */
  async create(
    params: CreatePaymentParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Payment>> {
    return this.httpClient.post("/payments", params, options);
  }

  /** Charge a customer's vaulted payment method off-session. Calculates tax, generates an invoice, and sends a receipt. No subscription or plan required. */
  async charge(
    params: ChargePaymentParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Payment>> {
    return this.httpClient.post("/payments/charge", params, options);
  }

  /** Retrieve a payment by its public ID. */
  async get(
    params: GetPaymentParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Payment>> {
    const { id } = params;
    return this.httpClient.get(`/payments/${id}`, undefined, options);
  }

  /** Cancel a pending payment link so it can no longer be paid. Only a link that has not been paid or started processing can be canceled; canceling an already canceled link is a no-op. Charges cannot be canceled. */
  async cancel(
    params: CancelPaymentParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Payment>> {
    const { id } = params;
    return this.httpClient.post(`/payments/${id}/cancel`, {}, options);
  }
}
