import type {
  ApiResponse,
  ListParams as BaseListParams,
  CustomerID,
  RequestOptions,
} from "../types/common";
import type { CommetHTTPClient } from "../utils/http";

export interface Customer {
  id: CustomerID;
  organizationId: string;
  externalId?: string;
  legalName?: string;
  displayName?: string;
  domain?: string;
  website?: string;
  billingEmail: string;
  timezone?: string;
  language?: string;
  industry?: string;
  employeeCount?: string;
  metadata?: Record<string, unknown>;
  isActive: boolean;
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
  externalId?: string;
  legalName?: string;
  displayName?: string;
  domain?: string;
  website?: string;
  timezone?: string;
  language?: string;
  industry?: string;
  metadata?: Record<string, unknown>;
  address?: CustomerAddress;
}

export interface UpdateParams {
  customerId: CustomerID;
  externalId?: string;
  email?: string;
  legalName?: string;
  displayName?: string;
  domain?: string;
  website?: string;
  timezone?: string;
  language?: string;
  industry?: string;
  metadata?: Record<string, unknown>;
}

export interface ListCustomersParams extends BaseListParams {
  externalId?: string;
  isActive?: boolean;
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

/**
 * Customers resource - Manage your customers
 */
export class CustomersResource {
  constructor(private httpClient: CommetHTTPClient) {}

  /**
   * Create a customer (idempotent with externalId)
   */
  async create(
    params: CreateParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Customer>> {
    return this.httpClient.post(
      "/customers",
      {
        billingEmail: params.email,
        externalId: params.externalId,
        legalName: params.legalName,
        displayName: params.displayName,
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

  /**
   * Create multiple customers in batch
   */
  async createBatch(
    params: { customers: CreateParams[] },
    options?: RequestOptions,
  ): Promise<ApiResponse<BatchResult>> {
    const customers = params.customers.map((c) => ({
      billingEmail: c.email,
      externalId: c.externalId,
      legalName: c.legalName,
      displayName: c.displayName,
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

  /**
   * Get a customer by ID
   */
  async get(customerId: CustomerID): Promise<ApiResponse<Customer>> {
    return this.httpClient.get(`/customers/${customerId}`);
  }

  /**
   * Update a customer
   */
  async update(
    params: UpdateParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Customer>> {
    return this.httpClient.put(
      `/customers/${params.customerId}`,
      {
        billingEmail: params.email,
        externalId: params.externalId,
        legalName: params.legalName,
        displayName: params.displayName,
        domain: params.domain,
        website: params.website,
        timezone: params.timezone,
        language: params.language,
        industry: params.industry,
        metadata: params.metadata,
      },
      options,
    );
  }

  /**
   * List customers with optional filters
   */
  async list(params?: ListCustomersParams): Promise<ApiResponse<Customer[]>> {
    return this.httpClient.get("/customers", params as Record<string, unknown>);
  }

  /**
   * Archive a customer
   */
  async archive(
    customerId: CustomerID,
    options?: RequestOptions,
  ): Promise<ApiResponse<Customer>> {
    return this.httpClient.put(
      `/customers/${customerId}`,
      { isActive: false },
      options,
    );
  }
}
