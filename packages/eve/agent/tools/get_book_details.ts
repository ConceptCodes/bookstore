import { defineTool } from "eve/tools";
import { z } from "zod";
import { getBookById } from "@bookstore/db";

export default defineTool({
  description:
    "Fetch full details for a single book by its numeric id, including description, ISBN, and stock. Use this when Ada asks about a specific book she already knows the id of, or after search_books when she wants more about one result.",
  inputSchema: z.object({
    bookId: z
      .number()
      .int()
      .positive()
      .describe("Numeric book id from a previous search or recommendation result."),
  }),
  async execute({ bookId }) {
    const book = getBookById(bookId);
    if (!book) {
      throw new Error(`Book ${bookId} not found.`);
    }
    return book;
  },
});
