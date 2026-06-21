import { defineTool } from "eve/tools";
import { z } from "zod";
import { CUSTOMER_USER_ID, clearCart } from "@bookstore/db";

export default defineTool({
  description:
    "Empty Ada's cart entirely — every line removed. Returns the (now empty) cart. Use only when Ada explicitly asks to clear or start over; confirm first if the cart has many items.",
  inputSchema: z.object({}),
  async execute() {
    return clearCart(CUSTOMER_USER_ID);
  },
});
