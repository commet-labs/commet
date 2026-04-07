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
  fullName?: string;
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
  id?: string; // Your user ID — stored as externalId, used to identify the customer in all SDK methods
  fullName?: string;
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
   * Create a customer (idempotent when id is provided)
   */
  async create(
    params: CreateParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<Customer>> {
    return this.httpClient.post(
      "/customers",
      {
        billingEmail: params.email,
        externalId: params.id,
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

  /**
   * Create multiple customers in batch
   */
  async createBatch(
    params: { customers: CreateParams[] },
    options?: RequestOptions,
  ): Promise<ApiResponse<BatchResult>> {
    const customers = params.customers.map((c) => ({
      billingEmail: c.email,
      externalId: c.id,
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
