import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorBox, ProgressBar, Spinner } from "../components/ui";
import { useForm } from "../lib/form";

/** Welcome: who is filling in the evaluation, and the sections they must all complete. */
export default function StartPage() {
  const { def, error, draft, update, progress, clear } = useForm();
  const navigate = useNavigate();
  const [problem, setProblem] = useState<string | null>(null);

  if (error) return <ErrorBox error={error} />;
  if (!def) return <Spinner />;
  const { school, instruments } = def;
  const started = Object.keys(draft.answers).length > 0;
  // Continue at the first section that is not finished yet
  const next = instruments.find((i) => {
    const p = progress(i.number);
    return p.answered < p.total;
  });

  function start() {
    if (draft.name.trim().length < 2) return setProblem("Please enter your name.");
    setProblem(null);
    navigate(next ? `/form/${next.number}` : "/review");
  }

  return (
    <div className="start-grid">
      <section className="page-card">
        <h1>{school.year} School Self-Evaluation</h1>
        <dl className="kv" style={{ margin: "10px 0 20px" }}>
          <dt>School</dt>
          <dd>{school.schoolName}</dd>
          <dt>EMIS number</dt>
          <dd>{school.emis}</dd>
          <dt>Education district</dt>
          <dd>{school.district}</dd>
          <dt>Circuit</dt>
          <dd>{school.circuit}</dd>
        </dl>
        <p className="muted">
          Please complete <b>all {instruments.length} sections</b>. For every indicator, choose the <b>current situation</b> and a <b>rating</b> from 5 (Outstanding)
          to 1, or 0 when it does not apply. Your answers are saved on this computer as you go, so you can finish later.
        </p>
        <label className="field">
          <span>Your name</span>
          <input className="input" value={draft.name} maxLength={80} autoFocus onChange={(e) => update({ name: e.target.value })} />
        </label>
        <label className="field">
          <span>Position (optional)</span>
          <input className="input" value={draft.position} maxLength={80} placeholder="e.g. Principal, Deputy Principal, HoD" onChange={(e) => update({ position: e.target.value })} />
        </label>
      </section>

      <section className="page-card">
        <h2 style={{ marginTop: 0 }}>Sections to complete</h2>
        <div className="instrument-list">
          {instruments.map((inst) => {
            const p = progress(inst.number);
            const done = p.answered === p.total;
            return (
              <div key={inst.number} className={`instrument-choice${done ? " on" : ""}`} style={{ cursor: "default" }}>
                <span className="num">{done ? "✓" : inst.number}</span>
                <span className="info">
                  <b>{inst.title}</b>
                  <small className="muted">{inst.items.length} indicators</small>
                  {p.answered > 0 && (
                    <span className="mini-progress">
                      <ProgressBar value={p.answered} max={p.total} ok={done} />
                      <small>{p.answered} of {p.total} answered</small>
                    </span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
        <ErrorBox error={problem} />
        <div className="footer-bar">
          {started && (
            <button
              className="btn btn-danger"
              onClick={() => {
                if (confirm("Clear all your answers on this computer?")) clear();
              }}
            >
              Clear my answers
            </button>
          )}
          <button className="btn btn-primary btn-big" onClick={start}>
            {!started ? "Start ▶" : next ? "Continue ▶" : "Review & submit ▶"}
          </button>
        </div>
      </section>
    </div>
  );
}
