import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { adminUsername, changePassword, checkLogin, clearSession, issueSession, mustChangePassword, passwordProblem, requireAdmin, verifyPassword } from "../auth.js";
import { db, getSetting } from "../db.js";
import { env } from "../env.js";
import { ah, HttpError, parse } from "../http.js";
import { INSTRUMENTS } from "../instruments.js";
import { band, bandSummary } from "../ratings.js";
import { getSchool, saveSchool } from "../school.js";

/** Admin: sign-in, results, summaries and settings. */
export const adminRouter = Router();

interface AnswerRow {
  response_id: string;
  instrument: number;
  item_code: string;
  part: string;
  situation: string;
  rating: number;
}

interface ResponseRow {
  id: string;
  name: string;
  position: string;
  created_at: string;
}

const loginLimiter = rateLimit({ windowMs: 10 * 60_000, limit: 20, standardHeaders: true, legacyHeaders: false, message: { error: "Too many sign-in attempts. Please wait a few minutes." } });

adminRouter.post(
  "/login",
  loginLimiter,
  ah(async (req, res) => {
    const { username, password } = parse(z.object({ username: z.string().max(100), password: z.string().max(128) }), req.body);
    if (!(await checkLogin(username, password))) throw new HttpError(401, "Wrong username or password");
    issueSession(res);
    res.json({ username: adminUsername(), mustChangePassword: mustChangePassword() });
  }),
);

adminRouter.post("/logout", (_req, res) => {
  clearSession(res);
  res.json({ ok: true });
});

adminRouter.use(requireAdmin);

adminRouter.get("/me", (_req, res) => {
  res.json({ username: adminUsername(), mustChangePassword: mustChangePassword() });
});

adminRouter.post(
  "/password",
  ah(async (req, res) => {
    const { current, next } = parse(z.object({ current: z.string().max(128), next: z.string().max(128) }), req.body);
    if (!(await verifyPassword(getSetting("admin_hash") ?? "", current))) throw new HttpError(400, "Current password is wrong");
    const problem = passwordProblem(next);
    if (problem) throw new HttpError(400, problem);
    if (next === current) throw new HttpError(400, "Choose a password that is different from the current one.");
    await changePassword(next);
    issueSession(res); // keep this browser signed in; other sessions end
    res.json({ ok: true });
  }),
);

// ---------------------------------------------------------------------------
// Results
// ---------------------------------------------------------------------------

const allAnswers = () => db.prepare("SELECT * FROM answers").all() as unknown as AnswerRow[];

/** Per-instrument totals across all respondents (the dashboard). */
adminRouter.get("/summary", (_req, res) => {
  const answers = allAnswers();
  const responses = (db.prepare("SELECT COUNT(*) AS n FROM responses").get() as { n: number }).n;
  const respondentsBy = new Map<number, number>();
  for (const r of db.prepare("SELECT instrument, COUNT(*) AS n FROM response_instruments GROUP BY instrument").all() as unknown as { instrument: number; n: number }[]) {
    respondentsBy.set(r.instrument, r.n);
  }
  const instruments = INSTRUMENTS.map((inst) => {
    const ratings = answers.filter((a) => a.instrument === inst.number).map((a) => a.rating);
    return { number: inst.number, title: inst.title, items: inst.items.length, respondents: respondentsBy.get(inst.number) ?? 0, ...bandSummary(ratings) };
  });
  res.json({ school: getSchool(), responses, overall: bandSummary(answers.map((a) => a.rating)), instruments });
});

/** One instrument: per item (and sub-row) rating spread, average and the situations chosen. */
adminRouter.get("/instruments/:number", (req, res) => {
  const inst = INSTRUMENTS.find((i) => i.number === Number(req.params.number));
  if (!inst) throw new HttpError(404, "Instrument not found");
  const answers = db.prepare("SELECT * FROM answers WHERE instrument = ?").all(inst.number) as unknown as AnswerRow[];
  const items = inst.items.map((item) => ({
    ...item,
    rows: (item.parts ?? [""]).map((part) => {
      const mine = answers.filter((a) => a.item_code === item.code && a.part === part);
      const ratingCounts = [0, 0, 0, 0, 0, 0];
      const situations = new Map<string, number>();
      for (const a of mine) {
        ratingCounts[a.rating]++;
        situations.set(a.situation, (situations.get(a.situation) ?? 0) + 1);
      }
      return {
        part,
        ...bandSummary(mine.map((a) => a.rating)),
        ratingCounts,
        situations: [...situations.entries()].sort((a, b) => b[1] - a[1]).map(([situation, count]) => ({ situation, count })),
      };
    }),
  }));
  const comments = db
    .prepare(
      "SELECT r.name, r.position, r.created_at, ri.comment FROM response_instruments ri JOIN responses r ON r.id = ri.response_id WHERE ri.instrument = ? AND ri.comment <> '' ORDER BY r.created_at DESC",
    )
    .all(inst.number);
  res.json({
    instrument: { number: inst.number, title: inst.title, purpose: inst.purpose },
    respondents: (db.prepare("SELECT COUNT(*) AS n FROM response_instruments WHERE instrument = ?").get(inst.number) as { n: number }).n,
    summary: bandSummary(answers.map((a) => a.rating)),
    items,
    comments,
  });
});

/** All submissions with each respondent's colour summary per instrument. */
adminRouter.get("/responses", (_req, res) => {
  const responses = db.prepare("SELECT id, name, position, created_at FROM responses ORDER BY created_at DESC").all() as unknown as ResponseRow[];
  const answers = allAnswers();
  res.json({
    responses: responses.map((r) => {
      const mine = answers.filter((a) => a.response_id === r.id);
      const numbers = [...new Set(mine.map((a) => a.instrument))].sort((a, b) => a - b);
      return {
        ...r,
        overall: bandSummary(mine.map((a) => a.rating)),
        instruments: numbers.map((n) => ({ number: n, ...bandSummary(mine.filter((a) => a.instrument === n).map((a) => a.rating)) })),
      };
    }),
  });
});

/** One submission in full, laid out like the templates. */
adminRouter.get("/responses/:id", (req, res) => {
  const r = db.prepare("SELECT id, name, position, created_at FROM responses WHERE id = ?").get(req.params.id) as unknown as ResponseRow | undefined;
  if (!r) throw new HttpError(404, "Response not found");
  const answers = db.prepare("SELECT * FROM answers WHERE response_id = ?").all(r.id) as unknown as AnswerRow[];
  const comments = new Map(
    (db.prepare("SELECT instrument, comment FROM response_instruments WHERE response_id = ?").all(r.id) as unknown as { instrument: number; comment: string }[]).map(
      (c) => [c.instrument, c.comment],
    ),
  );
  const instruments = INSTRUMENTS.filter((i) => comments.has(i.number)).map((inst) => {
    const mine = answers.filter((a) => a.instrument === inst.number);
    return {
      number: inst.number,
      title: inst.title,
      purpose: inst.purpose,
      comment: comments.get(inst.number) ?? "",
      summary: bandSummary(mine.map((a) => a.rating)),
      items: inst.items.map((item) => ({
        ...item,
        answers: (item.parts ?? [""]).map((part) => {
          const a = mine.find((x) => x.item_code === item.code && x.part === part);
          return { part, situation: a?.situation ?? "", rating: a?.rating ?? null };
        }),
      })),
    };
  });
  res.json({ response: r, summary: bandSummary(answers.map((a) => a.rating)), instruments });
});

/** Wipe every submission. Needs the admin password again, as it cannot be undone. */
adminRouter.post(
  "/responses/delete-all",
  ah(async (req, res) => {
    const { password, confirm } = parse(z.object({ password: z.string().max(128), confirm: z.string().max(20) }), req.body);
    if (confirm !== "DELETE") throw new HttpError(400, 'Type DELETE to confirm.');
    if (!(await verifyPassword(getSetting("admin_hash") ?? "", password))) throw new HttpError(400, "Password is wrong");
    const result = db.prepare("DELETE FROM responses").run();
    res.json({ deleted: Number(result.changes) });
  }),
);

adminRouter.delete("/responses/:id",(req, res) => {
  const result = db.prepare("DELETE FROM responses WHERE id = ?").run(req.params.id);
  if (!result.changes) throw new HttpError(404, "Response not found");
  res.json({ ok: true });
});

// ---------------------------------------------------------------------------
// CSV export (every answer, one row each)
// ---------------------------------------------------------------------------

function csvCell(v: unknown): string {
  let s = v === null || v === undefined ? "" : String(v);
  // Text such as "=HYPERLINK(…)" would run as a formula in Excel: neutralise it.
  if (typeof v === "string" && /^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// "2027-03-14 09:05" in the school's time zone
const localTime = new Intl.DateTimeFormat("sv-SE", { timeZone: env.timezone, dateStyle: "short", timeStyle: "short" });

adminRouter.get("/export.csv", (_req, res) => {
  const responses = new Map((db.prepare("SELECT id, name, position, created_at FROM responses").all() as unknown as ResponseRow[]).map((r) => [r.id, r]));
  const header = ["Respondent", "Position", "Submitted", "Instrument", "Code", "Part", "Document / criteria", "Core indicator", "Current situation", "Rating", "Band"];
  const lines = [header.join(",")];
  for (const a of allAnswers().sort((x, y) => x.response_id.localeCompare(y.response_id) || x.instrument - y.instrument || x.item_code.localeCompare(y.item_code, undefined, { numeric: true }))) {
    const r = responses.get(a.response_id);
    const inst = INSTRUMENTS.find((i) => i.number === a.instrument);
    const item = inst?.items.find((i) => i.code === a.item_code);
    lines.push(
      [r?.name, r?.position, r ? localTime.format(new Date(r.created_at)) : "",inst ? `${inst.number}. ${inst.title}` : a.instrument, a.item_code, a.part, item?.heading, item?.indicator, a.situation, a.rating, band(a.rating).toUpperCase()]
        .map(csvCell)
        .join(","),
    );
  }
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="self-evaluation-responses.csv"`);
  res.send("﻿" + lines.join("\r\n"));
});

// ---------------------------------------------------------------------------
// School details
// ---------------------------------------------------------------------------

adminRouter.put("/school", (req, res) => {
  const s = parse(
    z.object({
      schoolName: z.string().trim().min(1).max(120),
      emis: z.string().trim().max(40),
      district: z.string().trim().max(80),
      circuit: z.string().trim().max(20),
      year: z.string().trim().max(10),
    }),
    req.body,
  );
  saveSchool(s);
  res.json({ school: getSchool() });
});
