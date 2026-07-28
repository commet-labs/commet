import type { RequestOptions } from "../types/common";
import type { Invoice, InvoiceDownload, SentInvoice } from "../types/models";
import type { CommetHTTPClient } from "../utils/http";

export interface DownloadInvoiceParams {
  id: string;
}

export interface GetInvoiceParams {
  id: string;
}

export interface SendInvoiceParams {
  id: string;
}

export interface UpdateInvoiceStatusParams {
  id: string;
  status: "paid" | "void";
}

export interface ListInvoicesParams {
  cursor?: string;
  limit?: number;
  customerId?: string;
  status?: "draft" | "outstanding" | "paid" | "void" | "uncollectible";
  subscriptionId?: string;
}

export interface CreateAdjustmentInvoiceParams {
  customerId: string;
  amount: number;
  description: string;
  metadata?: Record<string, unknown>;
}

export class InvoicesResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /** Generate a signed URL to download the invoice as a PDF. The URL expires after 7 days. */
  async getDownloadUrl(
    params: DownloadInvoiceParams,
    options?: RequestOptions,
  ): Promise<InvoiceDownload> {
    const { id } = params;
    return this.httpClient.post(`/invoices/${id}/download-links`, {}, options);
  }

  /** Retrieve a single invoice by its public ID, including line items. */
  async get(
    params: GetInvoiceParams,
    options?: RequestOptions,
  ): Promise<Invoice> {
    const { id } = params;
    return this.httpClient.get(`/invoices/${id}`, undefined, options);
  }

  /** Send the invoice to the customer via email. */
  async send(
    params: SendInvoiceParams,
    options?: RequestOptions,
  ): Promise<SentInvoice> {
    const { id } = params;
    return this.httpClient.post(`/invoices/${id}/send`, {}, options);
  }

  /** Mark an outstanding invoice as "paid" or "void" and return the updated invoice. Cannot change the status of already paid or voided invoices. */
  async updateStatus(
    params: UpdateInvoiceStatusParams,
    options?: RequestOptions,
  ): Promise<Invoice> {
    const { id, ...rest } = params;
    return this.httpClient.patch(`/invoices/${id}/status`, rest, options);
  }

  /** List invoices with cursor-based pagination. Filter by customer, status, or subscription. */
  async list(
    params?: ListInvoicesParams,
    options?: RequestOptions,
  ): Promise<{
    object: "list";
    data: Array<Invoice>;
    hasMore: boolean;
    nextCursor?: string;
  }> {
    return this.httpClient.get("/invoices", params, options);
  }

  /** Create a one-off adjustment invoice and return the created invoice. Use a negative amount for a credit. */
  async createAdjustment(
    params: CreateAdjustmentInvoiceParams,
    options?: RequestOptions,
  ): Promise<Invoice> {
    return this.httpClient.post("/invoices", params, options);
  }
}
