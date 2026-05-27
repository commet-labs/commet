import type {
  ApiResponse,
  ListParams as BaseListParams,
  CustomerID,
  RequestOptions,
} from "../types/common";
import type { CommetHTTPClient } from "../utils/http";

export interface Customer {
  id: CustomerID;
  object: "customer";
  livemode: boolean;
  organizationId: string;
  fullName?: string;
  domain?: string;
  website?: string;
  billingEmail: string;
  timezone?: string;
  language?: string;
  industry?: string;
  employeeCount?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerAddress {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string; // ISO-2
}

export interface CreateParams {
  email: string; // billingEmail - the only required field
  id?: string;
  fullName?: string;
  domain?: string;
  website?: string;
  timezone?: string;
  language?: string;
  industry?: string;
  metadata?: Record<string, unknown>;
  address?: CustomerAddress;
}

export interface GetCustomerParams {
  id: CustomerID;
}

export interface UpdateParams {
  id: CustomerID;
  email?: string;
  fullName?: string;
  domain?: string;
  website?: string;
  timezone?: string;
  language?: string;
  industry?: string;
  metadata?: Record<string, unknown>;
  address?: CustomerAddress;
}

export interface ListCustomersParams extends BaseListParams {
  search?: string;
}

export interface BatchResult {
  successful: Customer[];
  failed: Array<{
    index: number;
    error: string;
    data: CreateParams;
  }>;
}

export class CustomersResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /** Idempotent when `id` is provided — returns existing customer instead of duplicating. */
  async create(
    params: CreateParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Customer>> {
    return this.httpClient.post(
      "/customers",
      {
        billingEmail: params.email,
        id: params.id,
        fullName: params.fullName,
        domain: params.domain,
        website: params.website,
        timezone: params.timezone,
        language: params.language,
        industry: params.industry,
        metadata: params.metadata,
        address: params.address,
      },
      options,
    );
  }

  async createBatch(
    params: { customers: CreateParams[] },
    options?: RequestOptions,
  ): Promise<ApiResponse<BatchResult>> {
    const customers = params.customers.map((c) => ({
      billingEmail: c.email,
      id: c.id,
      fullName: c.fullName,
      domain: c.domain,
      website: c.website,
      timezone: c.timezone,
      language: c.language,
      industry: c.industry,
      metadata: c.metadata,
      address: c.address,
    }));
    return this.httpClient.post("/customers/batch", { customers }, options);
  }

  async get(params: GetCustomerParams): Promise<ApiResponse<Customer>> {
    return this.httpClient.get(`/customers/${params.id}`);
  }

  async update(
    params: UpdateParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Customer>> {
    return this.httpClient.put(
      `/customers/${params.id}`,
      {
        billingEmail: params.email,
        fullName: params.fullName,
        domain: params.domain,
        website: params.website,
        timezone: params.timezone,
        language: params.language,
        industry: params.industry,
        metadata: params.metadata,
        address: params.address,
      },
      options,
    );
  }

  async list(params?: ListCustomersParams): Promise<ApiResponse<Customer[]>> {
    return this.httpClient.get("/customers", params as Record<string, unknown>);
  }
}
