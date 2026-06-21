import { defineTool } from "eve/tools";
import { z } from "zod";
import { CUSTOMER_USER_ID, createSupportTicket } from "@bookstore/db";

export default defineTool({
  description:
    "Open a new customer support ticket on Ada's behalf with a subject and a longer body describing the issue. Returns the created ticket with id and status (open). Use when Ada has a complaint, an unresolved question, or anything you can't handle with the other tools.",
  inputSchema: z.object({
    subject: z
      .string()
      .min(3)
      .max(120)
      .describe("Short summary of the issue, suitable for a ticket subject line."),
    body: z
      .string()
      .min(10)
      .describe(
        "Full description of the issue in Ada's interest. Include any relevant order ids, book titles, or context.",
      ),
  }),
  async execute({ subject, body }) {
    return createSupportTicket(CUSTOMER_USER_ID, subject, body);
  },
});
