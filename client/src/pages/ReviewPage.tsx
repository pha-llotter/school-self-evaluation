import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { BandStrip, ErrorBox, ProgressBar, Spinner } from "../components/ui";
import { api, ApiError } from "../lib/api";
import { answerKey, useForm } from "../lib/form";
import type { BandSummary } from "../lib/types";

export interface SubmitResult {
  id: string;
  summary: ({ number: number } & BandSummary)[];
}

/** Check every chosen instrument, add optional comments, then submit once. */
export default function ReviewPage() {
  const { def, error, draft, update, progress, summary, instrument, clear } = useForm();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (error) return <ErrorBox error={error} />;
  if (!def) return <Spinner />;
  if (!draft.selected.length || draft.name.trim().length < 2) return <Navigate to="/" replace />;

  const incomplete = draft.selected.filter((n) => {
    const p = progress(n);
    return p.answered < p.total;
  });

  async function submit() {
    setBusy(true);
    setSubmitError(null);
    try {
      const body = {
        name: draft.name.trim(),
        position: draft.position.trim(),
        instruments: draft.selected.map((n) => {
          const inst = instrument(n)!;
          return {
            number: n,
            comment: draft.comments[n] ?? "",
            answers: inst.items.flatMap((item) =>
              (item.parts ?? [""]).map((part) => {
                const a = draft.answers[answerKey(n, item.code, part)];
                return { code: item.code, part, situation: a?.situation ?? "", rating: a?.rating ?? -1 };
              }),
            ),
          };
        }),
      };
      const result = await api.post<SubmitResult>("/responses", body);
      const titles = Object.fromEntries(draft.selected.map((n) => [n, instrument(n)?.title ?? ""]));
      clear();
      navigate("/done", { state: { result, titles, name: body.name } });
    } catch (e) {
      setSubmitError(e instanceof ApiError ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page-card" style={{ maxWidth: 980, margin: "0 auto", width: "100%" }}>
      <h1>Review &amp; submit</h1>
      <p className="muted">
        Submitting as <b>{draft.name}</b>
        {draft.position && <> ({draft.position})</>}. You can only submit once, so check your answers first.
      </p>

      {draft.selected.map((n) => {
        const inst = instrument(n)!;
        const p = progress(n);
        const done = p.answered === p.total;
        return (
          <section key={n} className="review-block">
            <div className="row between">
              <h3 style={{ margin: 0 }}>
                {n}. {inst.title}
              </h3>
              <span className="row">
                {done ? <span className="tag tag-ok">Complete</span> : <span className="tag tag-warn">{p.total - p.answered} still to answer</span>}
                <Link className="btn btn-sm" to={`/form/${n}`}>{done ? "Edit" : "Finish"}</Link>
              </span>
            </div>
            <ProgressBar value={p.answered} max={p.total} ok={done} />
            <div style={{ margin: "10px 0" }}>
              <BandStrip summary={summary(n)} compact />
            </div>
            <label className="field">
              <span>Comments on this instrument (optional)</span>
              <textarea
                className="input"
                style={{ minHeight: 70, fontFamily: "inherit" }}
                maxLength={2000}
                value={draft.comments[n] ?? ""}
                onChange={(e) => update({ comments: { ...draft.comments, [n]: e.target.value } })}
              />
            </label>
          </section>
        );
      })}

      <ErrorBox error={submitError} />
      {incomplete.length > 0 && (
        <div className="alert alert-warn">
          Please finish instrument{incomplete.length > 1 ? "s" : ""} {incomplete.join(", ")} before submitting, or untick {incomplete.length > 1 ? "them" : "it"} on the{" "}
          <Link to="/">start page</Link>.
        </div>
      )}
      <div className="footer-bar">
        <Link to="/" className="btn">◀ Back to start</Link>
        <button className="btn btn-primary btn-big" disabled={busy || incomplete.length > 0} onClick={submit}>
          {busy ? "Submitting…" : "Submit my evaluation"}
        </button>
      </div>
    </div>
  );
}
