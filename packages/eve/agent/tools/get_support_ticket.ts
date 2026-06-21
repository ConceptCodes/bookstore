import { defineTool } from "eve/tools";
import { z } from "zod";
import { CUSTOMER_USER_ID, getSupportTicket } from "@bookstore/db";

export default defineTool({
  description:
    "Fetch a single support ticket Ada previously opened, by id. Returns id, subject, body, status (open/answered/closed), and createdAt. Use when Ada asks about the status of an existing ticket.",
  inputSchema: z.object({
    ticketId: z.number().int().positive().describe("The numeric ticket id from a previous create."),
  }),
  async execute({ ticketId }) {
    const ticket = getSupportTicket(ticketId, CUSTOMER_USER_ID);
    if (!ticket) {
      throw new Error(
        `Ticket ${ticketId} not found or doesn't belong to this account.`,
      );
    }
    return ticket;
  },
});
