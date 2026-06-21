import { defineTool } from "eve/tools";
import { z } from "zod";
import { CUSTOMER_USER_ID, getRecommendations } from "@bookstore/db";

export default defineTool({
  description:
    "Get personalized book recommendations for Ada. Scores books by genre overlap with her past orders and current cart, excludes books she already owns, and tie-breaks by rating. Returns up to 5 books with id, title, author, genre, priceCents, and rating. Use whenever Ada asks 'what should I read next', 'recommend something', or wants a suggestion.",
  inputSchema: z.object({
    limit: z
      .number()
      .int()
      .min(1)
      .max(10)
      .optional()
      .describe("Max recommendations to return. Default 5."),
  }),
  async execute({ limit }) {
    return getRecommendations(CUSTOMER_USER_ID, limit);
  },
});
