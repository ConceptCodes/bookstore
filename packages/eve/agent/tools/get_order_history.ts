import { defineTool } from "eve/tools";
import { z } from "zod";
import { CUSTOMER_USER_ID, getOrderHistory } from "@bookstore/db";

export default defineTool({
  description:
    "List Ada's past orders, newest first, with id, totalCents, status (pending/paid/shipped/cancelled), shipping address, and placedAt timestamp. Line items are not included — call get_order_details for those. Use when Ada asks 'where is my order', 'my orders', or 'recent purchases'.",
  inputSchema: z.object({}),
  async execute() {
    return getOrderHistory(CUSTOMER_USER_ID);
  },
});
