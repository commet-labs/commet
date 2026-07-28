import type { RequestOptions } from "../types/common";
import type { Payment } from "../types/models";
import type { CommetHTTPClient } from "../utils/http";

export interface CancelPaymentParams {
  id: string;
}

export interface GetPaymentParams {
  id: string;
}

export interface ChargePaymentParams {
  customerId: string;
  amount: number;
  currency: string;
  description: string;
  metadata?: Record<string, string>;
}

export interface ListPaymentsParams {
  cursor?: string;
  limit?: number;
  customerId?: string;
}

export interface CreatePaymentParams {
  amount: number;
  currency: string;
  customerId?: string;
  description: string;
  successUrl?: string;
  metadata?: Record<string, string>;
}

export class PaymentsResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /** Cancel a pending payment link so it can no longer be paid. Only a link that has not been paid or started processing can be canceled; canceling an already canceled link is a no-op. Charges cannot be canceled. */
  async cancel(
    params: CancelPaymentParams,
    options?: RequestOptions,
  ): Promise<Payment> {
    const { id } = params;
    return this.httpClient.post(`/payments/${id}/cancel`, {}, options);
  }

  /** Retrieve a payment by its public ID. */
  async get(
    params: GetPaymentParams,
    options?: RequestOptions,
  ): Promise<Payment> {
    const { id } = params;
    return this.httpClient.get(`/payments/${id}`, undefined, options);
  }

  /** Charge a customer's vaulted payment method off-session. Calculates tax, generates an invoice, and sends a receipt. Requires the customer to have a subscription in active, trialing, or past_due state. */
  async charge(
    params: ChargePaymentParams,
    options?: RequestOptions,
  ): Promise<Payment> {
    return this.httpClient.post("/payments/charge", params, options);
  }

  /** List payments with cursor-based pagination. Filter by customer. */
  async list(
    params?: ListPaymentsParams,
    options?: RequestOptions,
  ): Promise<{
    object: "list";
    data: Array<Payment>;
    hasMore: boolean;
    nextCursor?: string;
  }> {
    return this.httpClient.get("/payments", params, options);
  }

  /** Create a hosted payment link. Returns a url the customer opens to pay with any card. Calculates tax, generates an invoice, and vaults the payment method on confirmation. No subscription or plan required. */
  async create(
    params: CreatePaymentParams,
    options?: RequestOptions,
  ): Promise<Payment> {
    return this.httpClient.post("/payments", params, options);
  }
}
