import { openapi } from "@/lib/openapi";
import { generateFiles } from "fumadocs-openapi";

void generateFiles({
  input: openapi,
  output: "./content/docs",
  // we recommend to enable it
  // make sure your endpoint description doesn't break MDX syntax.
  includeDescription: true,
});
