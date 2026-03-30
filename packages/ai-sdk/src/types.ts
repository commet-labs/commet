export interface CommetAIOptions {
  /** Commet API key (ck_...) */
  apiKey: string;

  /** Feature code to track usage against */
  feature: string;

  /** Commet customer ID (cus_...) */
  customerId?: string;

  /** External user ID (your system's user identifier) */
  externalId?: string;

  /** Environment: "production" or "sandbox" */
  environment?: "production" | "sandbox";

  /** Idempotency key for deduplication */
  idempotencyKey?: string;

  /** Called when tracking fails. Defaults to console.warn. */
  onTrackingError?: (error: Error) => void;
}

export interface AIUsageTrackResponse {
  success: boolean;
  data?: {
    id: string;
    feature: string;
    model: string;
    inputTokens: number;
    outputTokens: number;
    cost: {
      inputCost: number;
      outputCost: number;
      subtotal: number;
      marginAmount: number;
      total: number;
    };
    balance: {
      deducted: number;
      remaining: number;
      currency: string;
    };
  };
  code?: string;
  message?: string;
}
