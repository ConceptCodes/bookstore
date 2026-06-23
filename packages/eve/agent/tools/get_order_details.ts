import { defineTool } from "eve/tools";
import { z } from "zod";
import { CUSTOMER_USER_ID, getOrderDetail } from "@bookstore/db";

export default defineTool({
  description:
    "Fetch full details for one of Ada's orders by id, including line items (book title, author, quantity, unit price, line total). Use after get_order_history when Ada asks about a specific order.",
  inputSchema: z.object({
    orderId: z.number().int().positive().describe("The numeric order id from her order history."),
  }),
  async execute({ orderId }) {
    const detail = getOrderDetail(orderId, CUSTOMER_USER_ID);
    if (!detail) {
      throw new Error(`Order ${orderId} not found or doesn't belong to this account.`);
    }
    return detail;
  },
});
