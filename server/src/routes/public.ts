import { Router } from "express";
import rateLimit from "express-rate-limit";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { db, transaction } from "../db.js";
import { ah, HttpError, parse } from "../http.js";
import { INSTRUMENTS } from "../instruments.js";
import { bandSummary, RATINGS } from "../ratings.js";
import { getSchool } from "../school.js";

/** Open to anyone with the link: the form definitions and submitting a response. */
export const publicRouter = Router();

publicRouter.get("/form", (_req, res) => {
  res.json({ school: getSchool(), ratings: RATINGS, instruments: INSTRUMENTS });
});

const submitLimiter = rateLimit({
  windowMs: 10 * 60_000,
  limit: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many submissions from this computer. Please wait a few minutes." },
});

const text = (max: number) => z.string().trim().max(max);

const submission = z.object({
  name: text(80).min(2, "Please enter your name"),
  position: text(80).default(""),
  instruments: z
    .array(
      z.object({
        number: z.number().int().min(1).max(99),
        comment: text(2000).default(""),
        answers: z
          .array(
            z.object({
              code: text(20),
              part: text(40).default(""),
              situation: text(200),
              rating: z.number().int().min(0).max(5),
            }),
          )
          .max(500),
      }),
    )
    .max(INSTRUMENTS.length),
});

type Submission = z.infer<typeof submission>;

/** Every instrument must be included and fully answered with valid choices. */
function validate(s: Submission) {
  const missing = INSTRUMENTS.filter((def) => !s.instruments.some((i) => i.number === def.number)).map((def) => def.number);
  if (missing.length) throw new HttpError(400, `Please complete every section (missing: ${missing.join(", ")})`);
  const seen = new Set<number>();
  for (const inst of s.instruments) {
    const def = INSTRUMENTS.find((i) => i.number === inst.number);
    if (!def) throw new HttpError(400, `Unknown instrument ${inst.number}`);
    if (seen.has(inst.number)) throw new HttpError(400, `Instrument ${inst.number} was sent twice`);
    seen.add(inst.number);

    const given = new Map(inst.answers.map((a) => [`${a.code}|${a.part}`, a]));
    if (given.size !== inst.answers.length) throw new HttpError(400, `Duplicate answers in instrument ${inst.number}`);
    let expected = 0;
    for (const item of def.items) {
      for (const part of item.parts ?? [""]) {
        expected++;
        const a = given.get(`${item.code}|${part}`);
        if (!a) throw new HttpError(400, `Instrument ${inst.number}: please answer ${item.code}${part ? ` (${part})` : ""}`);
        // A "not applicable" rating does not need a current situation.
        const situationOk = item.options.includes(a.situation) || (a.rating === 0 && a.situation === "");
        if (!situationOk) throw new HttpError(400, `Instrument ${inst.number}: invalid choice for ${item.code}`);
      }
    }
    if (expected !== inst.answers.length) throw new HttpError(400, `Instrument ${inst.number} has unexpected answers`);
  }
}

publicRouter.post(
  "/responses",
  submitLimiter,
  ah((req, res) => {
    const s = parse(submission, req.body);
    validate(s);
    const id = randomUUID();
    transaction(() => {
      db.prepare("INSERT INTO responses (id, name, position, created_at, ip, user_agent) VALUES (?, ?, ?, ?, ?, ?)").run(
        id,
        s.name,
        s.position,
        new Date().toISOString(),
        req.ip ?? null,
        req.get("user-agent")?.slice(0, 300) ?? null,
      );
      const addInstrument = db.prepare("INSERT INTO response_instruments (response_id, instrument, comment) VALUES (?, ?, ?)");
      const addAnswer = db.prepare(
        "INSERT INTO answers (response_id, instrument, item_code, part, situation, rating) VALUES (?, ?, ?, ?, ?, ?)",
      );
      for (const inst of s.instruments) {
        addInstrument.run(id, inst.number, inst.comment);
        for (const a of inst.answers) addAnswer.run(id, inst.number, a.code, a.part, a.situation, a.rating);
      }
    });
    res.status(201).json({
      id,
      summary: s.instruments.map((i) => ({ number: i.number, ...bandSummary(i.answers.map((a) => a.rating)) })),
    });
  }),
);
