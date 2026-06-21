import { defineTool } from "eve/tools";
import { z } from "zod";
import { CUSTOMER_USER_ID, getAccountSummary } from "@bookstore/db";

export default defineTool({
  description:
    "Get Ada's account summary: her name and email, lifetime order count, total spent (in cents across paid/shipped orders), currently open support tickets, and current cart item count. Use when Ada asks about her account, profile, or lifetime stats.",
  inputSchema: z.object({}),
  async execute() {
    return getAccountSummary(CUSTOMER_USER_ID);
  },
});
