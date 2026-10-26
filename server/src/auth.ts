import type { NextFunction, Request, Response } from "express";
import { createHmac, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { promisify } from "node:util";
import { getSetting, setSetting } from "./db.js";
import { DATA_DIR, env } from "./env.js";
import { HttpError } from "./http.js";

const scryptAsync = promisify(scrypt) as (pw: string, salt: Buffer, len: number, opts: object) => Promise<Buffer>;

export const COOKIE = "sse_admin";
const SESSION_HOURS = 8;
const SCRYPT = { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

// ---------------------------------------------------------------------------
// Password hashing (scrypt, salted)
// ---------------------------------------------------------------------------

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scryptAsync(password, salt, 32, SCRYPT);
  return `scrypt$${SCRYPT.N}$${SCRYPT.r}$${SCRYPT.p}$${salt.toString("hex")}$${hash.toString("hex")}`;
}

export async function verifyPassword(stored: string, password: string): Promise<boolean> {
  const [kind, N, r, p, saltHex, hashHex] = stored.split("$");
  if (kind !== "scrypt" || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = await scryptAsync(password, Buffer.from(saltHex, "hex"), expected.length, {
    N: Number(N),
    r: Number(r),
    p: Number(p),
    maxmem: SCRYPT.maxmem,
  });
  return timingSafeEqual(actual, expected);
}

export function passwordProblem(password: string): string | null {
  if (password.length < 10) return "Use at least 10 characters.";
  if (password.length > 128) return "Use at most 128 characters.";
  if (/^(password|admin|changeme|school|protea|welcome)\w{0,4}$/i.test(password)) return "That password is too easy to guess.";
  return null;
}

// ---------------------------------------------------------------------------
// The single admin account (stored in settings)
// ---------------------------------------------------------------------------

/**
 * On first start, creates the admin account with a random password, written to
 * data/ADMIN-FIRST-LOGIN.txt and printed in the console. It must be changed at first sign-in.
 */
export async function ensureAdmin() {
  if (getSetting("admin_hash")) return;
  const password = randomBytes(9).toString("base64url");
  setSetting("admin_username", "admin");
  setSetting("admin_hash", await hashPassword(password));
  setSetting("admin_must_change", "1");
  // Bump rather than reset, so sessions from before a password reset stay invalid
  setSetting("admin_session_version", String(Number(getSetting("admin_session_version") ?? "0") + 1));
  const file = resolve(DATA_DIR, "ADMIN-FIRST-LOGIN.txt");
  writeFileSync(
    file,
    `School Self-Evaluation - first admin sign-in\nUsername: admin\nPassword: ${password}\n\nYou will be asked to choose a new password. Delete this file afterwards.\n`,
    { mode: 0o600 },
  );
  console.log(`\nFirst admin sign-in: username "admin", password "${password}" (also saved in ${file})\n`);
}

export const adminUsername = () => getSetting("admin_username") ?? "admin";
export const mustChangePassword = () => getSetting("admin_must_change") === "1";
const sessionVersion = () => getSetting("admin_session_version") ?? "1";

// Lockout: 5 wrong passwords lock sign-in for 15 minutes.
let failures = 0;
let lockedUntil = 0;

export async function checkLogin(username: string, password: string): Promise<boolean> {
  if (Date.now() < lockedUntil) throw new HttpError(423, "Too many wrong passwords. Try again in a few minutes.");
  const passwordOk = await verifyPassword(getSetting("admin_hash") ?? "", password);
  const ok = username.trim().toLowerCase() === adminUsername() && passwordOk;
  if (ok) {
    failures = 0;
    return true;
  }
  failures++;
  if (failures >= 5) {
    lockedUntil = Date.now() + 15 * 60_000;
    failures = 0;
  }
  return false;
}

export async function changePassword(next: string) {
  setSetting("admin_hash", await hashPassword(next));
  setSetting("admin_must_change", "0");
  // Signs out every other session.
  setSetting("admin_session_version", String(Number(sessionVersion()) + 1));
}

// ---------------------------------------------------------------------------
// Signed session cookie
// ---------------------------------------------------------------------------

const sign = (data: string) => createHmac("sha256", env.sessionSecret).update(data).digest("base64url");

const cookieOptions = { httpOnly: true, sameSite: "strict" as const, secure: env.https, path: "/" };

export function issueSession(res: Response) {
  const payload = Buffer.from(JSON.stringify({ sv: sessionVersion(), exp: Date.now() + SESSION_HOURS * 3600_000 })).toString("base64url");
  res.cookie(COOKIE, `${payload}.${sign(payload)}`, { ...cookieOptions, maxAge: SESSION_HOURS * 3600_000 });
}

export function clearSession(res: Response) {
  res.clearCookie(COOKIE, cookieOptions);
}

function validSession(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return false;
  try {
    const { sv, exp } = JSON.parse(Buffer.from(payload, "base64url").toString()) as { sv: string; exp: number };
    return exp > Date.now() && sv === sessionVersion();
  } catch {
    return false;
  }
}

/** Requests allowed while the first-login password still has to be changed. */
const CHANGE_ALLOWED = ["/api/admin/me", "/api/admin/password", "/api/admin/logout"];

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!validSession(req.cookies?.[COOKIE])) return next(new HttpError(401, "Please sign in"));
  if (mustChangePassword() && !CHANGE_ALLOWED.includes(req.originalUrl.split("?")[0])) {
    return next(new HttpError(403, "Please choose a new password first"));
  }
  next();
}
