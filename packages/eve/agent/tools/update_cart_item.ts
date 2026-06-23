import { defineTool } from "eve/tools";
import { z } from "zod";
import { CUSTOMER_USER_ID, updateCartItemQty } from "@bookstore/db";

export default defineTool({
  description:
    "Set the quantity of a book already in Ada's cart to an exact value (not increment). Quantity is clamped to current stock. A quantity of 0 (or less) removes the line. Returns the updated cart. Use when Ada says 'change X to 3' or 'I only want 2 of those'.",
  inputSchema: z.object({
    bookId: z.number().int().positive().describe("The numeric book id already in the cart."),
    quantity: z.number().int().min(0).describe("Desired final quantity. 0 removes the line."),
  }),
  async execute({ bookId, quantity }) {
    return updateCartItemQty(CUSTOMER_USER_ID, bookId, quantity);
  },
});
