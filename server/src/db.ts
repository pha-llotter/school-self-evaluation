import { DatabaseSync } from "node:sqlite";
import { resolve } from "node:path";
import { DATA_DIR } from "./env.js";

/** SQLite database file in the data folder (no separate database server needed). */
export const db = new DatabaseSync(resolve(DATA_DIR, "sse.db"));
db.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");

db.exec(`
  CREATE TABLE IF NOT EXISTS responses (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    position    TEXT NOT NULL DEFAULT '',
    created_at  TEXT NOT NULL,
    ip          TEXT,
    user_agent  TEXT
  );
  CREATE TABLE IF NOT EXISTS response_instruments (
    response_id TEXT NOT NULL REFERENCES responses(id) ON DELETE CASCADE,
    instrument  INTEGER NOT NULL,
    comment     TEXT NOT NULL DEFAULT '',
    PRIMARY KEY (response_id, instrument)
  );
  CREATE TABLE IF NOT EXISTS answers (
    response_id TEXT NOT NULL REFERENCES responses(id) ON DELETE CASCADE,
    instrument  INTEGER NOT NULL,
    item_code   TEXT NOT NULL,
    part        TEXT NOT NULL DEFAULT '',
    situation   TEXT NOT NULL,
    rating      INTEGER NOT NULL,
    PRIMARY KEY (response_id, instrument, item_code, part)
  );
  CREATE INDEX IF NOT EXISTS answers_by_item ON answers (instrument, item_code);
  CREATE TABLE IF NOT EXISTS settings (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

export function getSetting(key: string): string | null {
  const row = db.prepare("SELECT value FROM settings WHERE key = ?").get(key) as { value: string } | undefined;
  return row?.value ?? null;
}

export function setSetting(key: string, value: string) {
  db.prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").run(key, value);
}

/** Runs `fn` in a transaction (all or nothing). */
export function transaction<T>(fn: () => T): T {
  db.exec("BEGIN");
  try {
    const out = fn();
    db.exec("COMMIT");
    return out;
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
}
