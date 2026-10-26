import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { ensureAdmin } from "./auth.js";
import { env } from "./env.js";
import { apiGuards } from "./guards.js";
import { errorHandler } from "./http.js";
import { adminRouter } from "./routes/admin.js";
import { publicRouter } from "./routes/public.js";

const app = express();
app.disable("x-powered-by");
// Behind a reverse proxy, take the visitor's IP from X-Forwarded-For (rate limits are per visitor).
app.set("trust proxy", env.trustProxy);
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        fontSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
      },
    },
    frameguard: { action: "deny" },
    strictTransportSecurity: env.https ? { maxAge: 31536000 } : false,
  }),
);
app.use(express.json({ limit: "512kb" }));
app.use(cookieParser());
app.use("/api", apiGuards());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});
app.use("/api", publicRouter);
app.use("/api/admin", adminRouter);
app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// The built web app is served by this same process.
const clientDir = resolve(import.meta.dirname, "../../client/dist");
if (existsSync(clientDir)) {
  app.use(express.static(clientDir, { index: false, maxAge: "1h" }));
  app.get("*", (_req, res) => res.sendFile(resolve(clientDir, "index.html")));
}

app.use(errorHandler);

await ensureAdmin();
app.listen(env.port, env.host, () => {
  console.log(`School Self-Evaluation running on http://${env.host === "0.0.0.0" ? "localhost" : env.host}:${env.port}`);
});
