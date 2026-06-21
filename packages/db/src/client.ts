import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { env } from "@bookstore/config";
import * as schema from "./schema.ts";

export const DB_PATH = env.BOOKSTORE_DB_PATH;

mkdirSync(dirname(DB_PATH), { recursive: true });

declare global {
  var __bookstoreSqlite: Database.Database | undefined;
}

function createSqlite() {
  const instance = new Database(DB_PATH);
  instance.pragma("journal_mode = WAL");
  instance.pragma("foreign_keys = ON");
  return instance;
}

export const sqlite = globalThis.__bookstoreSqlite ?? createSqlite();

if (process.env.NODE_ENV !== "production") {
  globalThis.__bookstoreSqlite = sqlite;
}

export const db = drizzle(sqlite, { schema });
export type DB = typeof db;
