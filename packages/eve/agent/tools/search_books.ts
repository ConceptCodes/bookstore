import { defineTool } from "eve/tools";
import { z } from "zod";
import { searchBooks } from "@bookstore/db";

export default defineTool({
  description:
    "Search the bookstore catalog by free-text query (matches title, author, or description) with an optional genre filter. Returns up to 12 books ranked by rating. Each result includes id, title, author, genre, priceCents, rating, stock, and coverUrl. Use this whenever Ada mentions a book, author, genre, topic, or asks what's available.",
  inputSchema: z.object({
    query: z
      .string()
      .min(1)
      .optional()
      .describe("Free-text search across title, author, and description."),
    genre: z
      .string()
      .optional()
      .describe(
        "Filter to a specific genre (e.g. 'Sci-Fi', 'Fantasy', 'Mystery'). Omit for all genres.",
      ),
    limit: z
      .number()
      .int()
      .min(1)
      .max(50)
      .optional()
      .describe("Max results to return. Default 12."),
  }),
  async execute({ query, genre, limit }) {
    return searchBooks({ query, genre, limit });
  },
});
