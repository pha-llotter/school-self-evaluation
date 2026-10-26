import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorBox, ProgressBar, Spinner } from "../components/ui";
import { useForm } from "../lib/form";

/** Welcome: who is filling in the evaluation and which instruments they will complete. */
export default function StartPage() {
  const { def, error, draft, update, progress, clear } = useForm();
  const navigate = useNavigate();
  const [problem, setProblem] = useState<string | null>(null);

  if (error) return <ErrorBox error={error} />;
  if (!def) return <Spinner />;
  const { school, instruments } = def;
  const started = Object.keys(draft.answers).length > 0;

  function toggle(n: number) {
    update({ selected: draft.selected.includes(n) ? draft.selected.filter((x) => x !== n) : [...draft.selected, n].sort((a, b) => a - b) });
  }

  function start() {
    if (draft.name.trim().length < 2) return setProblem("Please enter your name.");
    if (!draft.selected.length) return setProblem("Choose at least one instrument to complete.");
    setProblem(null);
    navigate(`/form/${draft.selected[0]}`);
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
          For every indicator, choose the <b>current situation</b> and a <b>rating</b> from 5 (Outstanding) to 1, or 0 when it does not apply.
          Your answers are saved on this computer as you go, until you submit.
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
        <div className="row between" style={{ marginBottom: 12 }}>
          <h2 style={{ margin: 0 }}>Choose your instruments</h2>
          <span className="row">
            <button className="btn btn-sm" onClick={() => update({ selected: instruments.map((i) => i.number) })}>Select all</button>
            <button className="btn btn-sm" onClick={() => update({ selected: [] })}>None</button>
          </span>
        </div>
        <div className="instrument-list">
          {instruments.map((inst) => {
            const p = progress(inst.number);
            const on = draft.selected.includes(inst.number);
            return (
              <label key={inst.number} className={`instrument-choice${on ? " on" : ""}`}>
                <input type="checkbox" checked={on} onChange={() => toggle(inst.number)} />
                <span className="num">{inst.number}</span>
                <span className="info">
                  <b>{inst.title}</b>
                  <small className="muted">{inst.items.length} indicators</small>
                  {p.answered > 0 && (
                    <span className="mini-progress">
                      <ProgressBar value={p.answered} max={p.total} ok={p.answered === p.total} />
                      <small>{p.answered} of {p.total} answered</small>
                    </span>
                  )}
                </span>
              </label>
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
            {started ? "Continue ▶" : "Start ▶"}
          </button>
        </div>
      </section>
    </div>
  );
}
