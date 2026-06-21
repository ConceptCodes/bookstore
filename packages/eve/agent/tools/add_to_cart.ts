import { defineTool } from "eve/tools";
import { z } from "zod";
import { CUSTOMER_USER_ID, addToCart } from "@bookstore/db";

export default defineTool({
  description:
    "Add a book to Ada's cart, or increment its quantity if it's already there. Quantity is clamped to the available stock. Returns the updated cart (same shape as get_cart). Throws if the book doesn't exist or is out of stock.",
  inputSchema: z.object({
    bookId: z.number().int().positive().describe("The numeric book id to add."),
    quantity: z
      .number()
      .int()
      .min(1)
      .optional()
      .describe("How many copies to add. Default 1."),
  }),
  async execute({ bookId, quantity }) {
    return addToCart(CUSTOMER_USER_ID, bookId, quantity);
  },
});
