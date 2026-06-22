import { defineConfig } from "drizzle-kit";
import { env } from "@bookstore/config";

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./migrations",
  dbCredentials: { url: env.BOOKSTORE_DB_PATH },
  dialect: "sqlite",
});
