import { defineTool } from "eve/tools";
import { z } from "zod";
import { listShippingOptions } from "@bookstore/db";

export default defineTool({
  description:
    "List the available shipping options with id, label, costCents, and ETA in business days. Always call this before checkout so Ada can pick a shipping option. Options are: standard (3-5 days), express (1-2 days), overnight (1 day).",
  inputSchema: z.object({}),
  async execute() {
    return listShippingOptions();
  },
});
