import type { Commet, CustomerID } from "@commet/node";

export interface CommetAIOptions {
  commet: Commet;
  feature: string;
  customerId: CustomerID;
  idempotencyKey?: string;
  onTrackingError?: (error: Error) => void;
}
