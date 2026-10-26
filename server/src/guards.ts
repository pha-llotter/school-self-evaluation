import type { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/** True if the request comes from this site (blocks other websites posting to the API). */
function sameOrigin(req: Request): boolean {
  const origin = req.get("origin");
  if (origin) {
    try {
      return new URL(origin).host === req.get("host");
    } catch {
      return false;
    }
  }
  const site = req.get("sec-fetch-site");
  return !site || site === "same-origin" || site === "none";
}

/** Rate limit, same-site check for changes, JSON-only bodies and no caching of API responses. */
export function apiGuards() {
  const limiter = rateLimit({
    windowMs: 60_000,
    limit: 600,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests. Please slow down." },
  });
  return [
    limiter,
    (req: Request, res: Response, next: NextFunction) => {
      res.set("Cache-Control", "no-store");
      if (SAFE_METHODS.has(req.method)) return next();
      if (!sameOrigin(req)) return res.status(403).json({ error: "Cross-site request blocked" });
      const hasBody = Number(req.get("content-length") ?? 0) > 0 || req.get("transfer-encoding");
      if (hasBody && !req.is("application/json")) return res.status(415).json({ error: "Send JSON" });
      next();
    },
  ];
}
