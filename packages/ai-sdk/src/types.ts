import type { Commet } from "@commet/node";

export interface CommetAIOptions {
  commet: Commet;
  feature: string;
  customerId: string;
  idempotencyKey?: string;
  onTrackingError?: (error: Error) => void;
}
