import { defineTool } from "eve/tools";
import { z } from "zod";
import { CUSTOMER_USER_ID, removeFromCart } from "@bookstore/db";

export default defineTool({
  description:
    "Remove a single book line from Ada's cart entirely, regardless of quantity. Returns the updated cart. Use when Ada says 'remove X' or 'take that out'.",
  inputSchema: z.object({
    bookId: z.number().int().positive().describe("The numeric book id to remove from the cart."),
  }),
  async execute({ bookId }) {
    return removeFromCart(CUSTOMER_USER_ID, bookId);
  },
});
