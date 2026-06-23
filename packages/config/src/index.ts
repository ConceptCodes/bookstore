import { envSchema, type Env } from "./schema.ts";

export { envSchema, type Env, type EnvSchema } from "./schema.ts";

export function parseEnv(source: Record<string, string | undefined> = process.env): Env {
  const result = envSchema.safeParse(source);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid environment variables:\n${issues}`);
  }
  return result.data;
}

export const env: Env = parseEnv();

export function requireEnv<K extends keyof Env>(key: K): NonNullable<Env[K]> {
  const value = env[key];
  if (value === undefined || value === null) {
    throw new Error(`Missing required environment variable: ${String(key)}`);
  }
  return value;
}

export function hasModelCredentials(): boolean {
  return Boolean(env.AI_GATEWAY_API_KEY || env.ANTHROPIC_API_KEY || env.VERCEL_OIDC_TOKEN);
}

export const isDev = env.NODE_ENV === "development";
export const isProd = env.NODE_ENV === "production";
export const isTest = env.NODE_ENV === "test";
