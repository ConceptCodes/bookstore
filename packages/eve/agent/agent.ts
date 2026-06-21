import { defineAgent } from "eve";

export default defineAgent({
  model: "anthropic/claude-sonnet-4.6",
  build: {
    externalDependencies: ["@bookstore/db", "better-sqlite3"],
  },
});
