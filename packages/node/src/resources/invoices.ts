import type { ApiResponse, RequestOptions } from "../types/common";
import type { CommetHTTPClient } from "../utils/http";

export interface InvoiceLineItem {
  lineType: string;
  featureName: string | null;
  description: string | null;
  quantity: number;
  unitAmount: number;
  amount: number;
  includedAmount: number | null;
  usedAmount: number | null;
  overageAmount: number | null;
  discountType: string | null;
  discountValue: number | null;
  discountName: string | null;
  chargeType: string | null;
}

export interface InvoiceListItem {
  id: string;
  object: "invoice";
  livemode: boolean;
  customerId: string;
  subscriptionId: string | null;
  invoiceNumber: string;
  status: string;
  invoiceType: string;
  currency: string;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
  periodStart: string | null;
  periodEnd: string | null;
  issueDate: string;
  dueDate: string | null;
  memo: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceDetail extends InvoiceListItem {
  creditApplied: number;
  planName: string | null;
  poNumber: string | null;
  reference: string | null;
  lineItems: InvoiceLineItem[];
}

export interface InvoiceDownloadResult {
  url: string;
  expiresAt: string;
}

export interface InvoiceSendResult {
  sent: boolean;
  sentAt: string;
}

export interface InvoiceStatusResult {
  id: string;
  status: string;
  updatedAt: string;
}

export interface CreateAdjustmentResult {
  id: string;
  object: "invoice";
  livemode: boolean;
  customerId: string;
  invoiceNumber: string;
  status: string;
  invoiceType: string;
  currency: string;
  subtotal: number;
  taxAmount: number;
  total: number;
  issueDate: string;
  dueDate: string | null;
  memo: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListInvoicesParams {
  customerId?: string;
  status?: string;
  subscriptionId?: string;
  limit?: number;
  cursor?: string;
}

export interface GetInvoiceParams {
  id: string;
}

export interface CreateAdjustmentParams {
  customerId: string;
  amount: number;
  description?: string;
  metadata?: Record<string, unknown>;
}

export interface GetDownloadUrlParams {
  id: string;
}

export interface SendInvoiceParams {
  id: string;
}

export interface UpdateInvoiceStatusParams {
  id: string;
  status: string;
}

export class InvoicesResource {
  constructor(private httpClient: CommetHTTPClient) {}

  async list(
    params?: ListInvoicesParams,
  ): Promise<ApiResponse<InvoiceListItem[]>> {
    return this.httpClient.get("/invoices", params);
  }

  async get(params: GetInvoiceParams): Promise<ApiResponse<InvoiceDetail>> {
    return this.httpClient.get(`/invoices/${params.id}`);
  }

  /** Negative amount creates a credit. */
  async createAdjustment(
    params: CreateAdjustmentParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<CreateAdjustmentResult>> {
    return this.httpClient.post("/invoices", params, options);
  }

  /** Signed URL, expires after 7 days. */
  async getDownloadUrl(
    params: GetDownloadUrlParams,
  ): Promise<ApiResponse<InvoiceDownloadResult>> {
    return this.httpClient.get(`/invoices/${params.id}/download`);
  }

  async send(
    params: SendInvoiceParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<InvoiceSendResult>> {
    return this.httpClient.post(`/invoices/${params.id}/send`, {}, options);
  }

  /** Only outstanding invoices can be changed to paid or void. */
  async updateStatus(
    params: UpdateInvoiceStatusParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<InvoiceStatusResult>> {
    const { id, ...body } = params;
    return this.httpClient.put(`/invoices/${id}/status`, body, options);
  }
}
