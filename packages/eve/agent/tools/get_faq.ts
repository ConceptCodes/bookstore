import { defineTool } from "eve/tools";
import { z } from "zod";
import { searchFaq } from "@bookstore/db";

export default defineTool({
  description:
    "Search the bookstore FAQ by free-text query (matches question or answer) with an optional category filter (Shipping, Returns, Payments, Account). Returns matching entries with question, answer, and category. Use whenever Ada asks a policy question — shipping times, returns, payment methods, account help.",
  inputSchema: z.object({
    query: z
      .string()
      .min(1)
      .optional()
      .describe("Free-text search across FAQ questions and answers."),
    category: z
      .string()
      .optional()
      .describe(
        "Filter to a category: 'Shipping', 'Returns', 'Payments', or 'Account'.",
      ),
  }),
  async execute({ query, category }) {
    return searchFaq({ query, category });
  },
});
