import { defineTool } from "eve/tools";
import { always } from "eve/tools/approval";
import { z } from "zod";
import { CUSTOMER_USER_ID, createOrder } from "@bookstore/db";

export default defineTool({
  description:
    "Place an order for everything currently in Ada's cart using the chosen shipping option. This is a real side effect: it creates an order record, decrements stock, and clears the cart. Ada will be asked to approve before it runs. Before calling this, always summarize the cart and shipping choice to Ada so she knows what she's approving.",
  inputSchema: z.object({
    shippingOptionId: z
      .string()
      .describe(
        "Shipping option id from get_shipping_options: 'standard', 'express', or 'overnight'.",
      ),
  }),
  needsApproval: always(),
  async execute({ shippingOptionId }) {
    return createOrder(CUSTOMER_USER_ID, shippingOptionId);
  },
});
