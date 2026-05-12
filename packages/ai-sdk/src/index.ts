import { registerIntegration } from "@commet/node";

declare const __PKG_VERSION__: string;
registerIntegration("@commet/ai-sdk", __PKG_VERSION__);

export { tracked } from "./middleware";
export type { CommetAIOptions } from "./types";
