import { defineTool } from "eve/tools";
import { z } from "zod";
import { CUSTOMER_USER_ID, getCart } from "@bookstore/db";

export default defineTool({
  description:
    "Get Ada's current cart: every line item with book id, title, author, quantity, unit price, line total, and stock, plus subtotalCents and total itemCount. Use whenever Ada asks about her cart, wants a total, or before suggesting checkout.",
  inputSchema: z.object({}),
  async execute() {
    return getCart(CUSTOMER_USER_ID);
  },
});
