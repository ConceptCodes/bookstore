import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./migrations",
  dbCredentials: { url: "./data/bookstore.db" },
  dialect: "sqlite",
});
