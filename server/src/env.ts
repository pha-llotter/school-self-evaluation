import { randomBytes } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

/** Everything the app stores lives in this folder (database, session key). Back it up. */
export const DATA_DIR = resolve(process.env.DATA_DIR ?? resolve(import.meta.dirname, "../../data"));
mkdirSync(DATA_DIR, { recursive: true });

/** Random key for signing admin sessions, created on first start and kept in the data folder. */
function sessionSecret(): string {
  if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 32) return process.env.SESSION_SECRET;
  const file = resolve(DATA_DIR, "session.key");
  if (!existsSync(file)) writeFileSync(file, randomBytes(48).toString("hex"), { mode: 0o600 });
  return readFileSync(file, "utf8").trim();
}

/** TRUST_PROXY: "true" = one proxy in front (e.g. Caddy on the same server), a number = that many hops, or an Express trust-proxy string. */
function trustProxy(): boolean | number | string {
  const v = process.env.TRUST_PROXY?.trim();
  if (!v || v === "false") return false;
  if (v === "true") return 1;
  return /^\d+$/.test(v) ? Number(v) : v;
}

export const env = {
  port: Number(process.env.PORT ?? 5050),
  /** 0.0.0.0 = reachable on the network; 127.0.0.1 = only through a local reverse proxy */
  host: process.env.HOST ?? "0.0.0.0",
  trustProxy: trustProxy(),
  sessionSecret: sessionSecret(),
  /** Set to true only when the app is served over HTTPS (secure cookies). */
  https: process.env.HTTPS === "true",
  timezone: process.env.TZ_NAME ?? "Africa/Johannesburg",
};
