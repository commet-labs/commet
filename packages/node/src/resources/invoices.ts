import type { ApiResponse, RequestOptions } from "../types/common";
import type {
  CreatedInvoice,
  Invoice,
  InvoiceDownload,
  InvoiceStatus,
  SentInvoice,
} from "../types/models";
import type { CommetHTTPClient } from "../utils/http";

export interface ListInvoicesParams {
  customerId?: string;
  status?: "draft" | "outstanding" | "paid" | "void" | "uncollectible";
  subscriptionId?: string;
  /** @format date-time */
  cursor?: string;
  limit?: number;
}

export interface GetInvoiceParams {
  id: string;
}

export interface CreateAdjustmentInvoiceParams {
  customerId: string;
  amount: number;
  description: string;
  metadata?: Record<string, unknown>;
}

export interface DownloadInvoiceParams {
  id: string;
}

export interface SendInvoiceParams {
  id: string;
}

export interface UpdateInvoiceStatusParams {
  id: string;
  status: "paid" | "void";
}

export class InvoicesResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /** List invoices with cursor-based pagination. Filter by customer, status, or subscription. */
  async list(
    params?: ListInvoicesParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Array<Invoice>>> {
    return this.httpClient.get("/invoices", params, options);
  }

  /** Retrieve a single invoice by its public ID, including line items. */
  async get(
    params: GetInvoiceParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Invoice>> {
    const { id } = params;
    return this.httpClient.get(`/invoices/${id}`, undefined, options);
  }

  /** Create a one-off adjustment invoice. Use a negative amount for a credit. */
  async createAdjustment(
    params: CreateAdjustmentInvoiceParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<CreatedInvoice>> {
    return this.httpClient.post("/invoices", params, options);
  }

  /** Generate a signed URL to download the invoice as a PDF. The URL expires after 7 days. */
  async getDownloadUrl(
    params: DownloadInvoiceParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<InvoiceDownload>> {
    const { id } = params;
    return this.httpClient.get(`/invoices/${id}/download`, undefined, options);
  }

  /** Send the invoice to the customer via email. */
  async send(
    params: SendInvoiceParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<SentInvoice>> {
    const { id } = params;
    return this.httpClient.post(`/invoices/${id}/send`, {}, options);
  }

  /** Mark an outstanding invoice as "paid" or "void". Cannot change the status of already paid or voided invoices. */
  async updateStatus(
    params: UpdateInvoiceStatusParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<InvoiceStatus>> {
    const { id, ...rest } = params;
    return this.httpClient.put(`/invoices/${id}/status`, rest, options);
  }
}
