import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const here = dirname(fileURLToPath(import.meta.url));
const DEFAULT_DB_PATH = resolve(here, "..", "..", "..", ".data", "bookstore.db");

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  BOOKSTORE_DB_PATH: z.string().min(1).default(DEFAULT_DB_PATH),

  AI_GATEWAY_API_KEY: z.string().optional(),

  ANTHROPIC_API_KEY: z.string().optional(),

  VERCEL_OIDC_TOKEN: z.string().optional(),

  EVE_NEXT_PRODUCTION_PORT: z.coerce.number().int().positive().optional(),

  EVE_NEXT_PRODUCTION_ORIGIN: z.string().url().optional(),

  PORT: z.coerce.number().int().positive().optional(),
});

export type EnvSchema = typeof envSchema;
export type Env = z.infer<typeof envSchema>;
