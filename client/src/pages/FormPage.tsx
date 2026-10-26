import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { BandStrip, ErrorBox, ProgressBar, Spinner } from "../components/ui";
import { answerKey, isAnswered, useForm } from "../lib/form";

/** One instrument: every indicator with its "current situation" and rating. */
export default function FormPage() {
  const { number } = useParams();
  const n = Number(number);
  const { def, error, draft, setAnswer, progress, summary, instrument } = useForm();
  const navigate = useNavigate();
  const [showMissing, setShowMissing] = useState(false);

  useEffect(() => {
    setShowMissing(false);
    window.scrollTo(0, 0);
  }, [n]);

  if (error) return <ErrorBox error={error} />;
  if (!def) return <Spinner />;
  const inst = instrument(n);
  if (!inst || !draft.selected.includes(n) || draft.name.trim().length < 2) return <Navigate to="/" replace />;

  const order = draft.selected;
  const index = order.indexOf(n);
  const prev = order[index - 1];
  const next = order[index + 1];
  const p = progress(n);
  const complete = p.answered === p.total;

  function go(to: string) {
    if (!complete) {
      setShowMissing(true);
      const first = document.querySelector(".answer-row.missing");
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      if (!confirm("Some indicators in this instrument are not answered yet. Continue anyway? (You can come back before submitting.)")) return;
    }
    navigate(to);
  }

  return (
    <div className="form-layout">
      <nav className="stepper" aria-label="Instruments">
        {order.map((m) => {
          const ip = progress(m);
          const t = instrument(m);
          return (
            <Link key={m} to={`/form/${m}`} className={`step${m === n ? " active" : ""}${ip.answered === ip.total ? " done" : ""}`}>
              <span className="num">{m}</span>
              <span className="label">{t?.title}</span>
              <small>{ip.answered}/{ip.total}</small>
            </Link>
          );
        })}
        <Link to="/review" className="step review">
          <span className="num">✓</span>
          <span className="label">Review &amp; submit</span>
        </Link>
      </nav>

      <div>
        <section className="panel instrument-head">
          <div className="small muted">Instrument {inst.number}</div>
          <h1 style={{ margin: "2px 0 6px" }}>{inst.title}</h1>
          <p className="small" style={{ marginBottom: 12 }}>
            <b>Purpose:</b> {inst.purpose}
          </p>
          <div className="row between small">
            <span>
              {p.answered} of {p.total} answered
            </span>
          </div>
          <ProgressBar value={p.answered} max={p.total} ok={complete} />
          <div style={{ marginTop: 12 }}>
            <BandStrip summary={summary(n)} />
          </div>
        </section>

        {inst.items.map((item, i) => {
          const sameHeading = i > 0 && inst.items[i - 1].heading === item.heading && item.heading !== "";
          return (
            <article key={item.code} className="item-card">
              <div className="item-head">
                <span className="code">{item.code}</span>
                <div>
                  {item.heading && !sameHeading && <h3>{item.heading}</h3>}
                  {item.indicator && <p className="indicator">{item.indicator}</p>}
                </div>
              </div>
              {(item.parts ?? [""]).map((part) => {
                const a = draft.answers[answerKey(n, item.code, part)] ?? {};
                const missing = showMissing && !isAnswered(a);
                const na = a.rating === 0;
                return (
                  <div key={part || "main"} className={`answer-row${missing ? " missing" : ""}`}>
                    {part && (
                      <span className="part">
                        <small className="muted">{item.partsLabel ?? ""}</small> {part}
                      </span>
                    )}
                    <label className="field">
                      <span>Current situation{na && <small className="muted"> (optional for N/A)</small>}</span>
                      <select
                        className="select"
                        value={a.situation ?? ""}
                        onChange={(e) => setAnswer(n, item.code, part, { situation: e.target.value || undefined })}
                      >
                        <option value="">{na ? "NOT APPLICABLE" : "PLEASE SELECT"}</option>
                        {item.options.map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </label>
                    <label className="field">
                      <span>Rating</span>
                      <select
                        className={`select rating-select${a.rating !== undefined ? ` r-${a.rating >= 4 ? "green" : a.rating === 3 ? "amber" : a.rating >= 1 ? "red" : "na"}` : ""}`}
                        value={a.rating ?? ""}
                        onChange={(e) => setAnswer(n, item.code, part, { rating: e.target.value === "" ? undefined : Number(e.target.value) })}
                      >
                        <option value="">PLEASE SELECT</option>
                        {def.ratings.map((r) => (
                          <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                );
              })}
            </article>
          );
        })}

        <div className="footer-bar">
          {prev !== undefined && <button className="btn" onClick={() => navigate(`/form/${prev}`)}>◀ Previous instrument</button>}
          <span className="spacer" />
          {next !== undefined ? (
            <button className="btn btn-primary btn-big" onClick={() => go(`/form/${next}`)}>Next instrument ▶</button>
          ) : (
            <button className="btn btn-primary btn-big" onClick={() => go("/review")}>Review &amp; submit ▶</button>
          )}
        </div>
      </div>
    </div>
  );
}
