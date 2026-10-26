import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BandStrip, ErrorBox, RatingTag, Spinner, Tile } from "../../components/ui";
import { api, fmtDateTime } from "../../lib/api";
import type { InstrumentDetail } from "./adminTypes";

const RATING_NAMES = ["N/A", "Weak", "Needs impr.", "Acceptable", "Good", "Outstanding"];

/** One instrument across all respondents: every indicator's rating spread and chosen situations. */
export default function InstrumentSummary() {
  const { number } = useParams();
  const [data, setData] = useState<InstrumentDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "red" | "amber">("all");

  useEffect(() => {
    setData(null);
    api.get<InstrumentDetail>(`/admin/instruments/${number}`).then(setData).catch((e) => setError(e.message));
  }, [number]);

  if (error) return <ErrorBox error={error} />;
  if (!data) return <Spinner />;
  const { instrument: inst, summary } = data;

  const visible = data.items.filter((item) => filter === "all" || item.rows.some((r) => r.counts[filter] > 0));

  return (
    <>
      <div className="page-head">
        <div>
          <Link to="/admin" className="small">◀ Dashboard</Link>
          <h1 style={{ margin: "4px 0 0" }}>
            {inst.number}. {inst.title}
          </h1>
          <div className="muted small" style={{ maxWidth: 820 }}>{inst.purpose}</div>
        </div>
        <button className="btn no-print" onClick={() => window.print()}>🖨 Print</button>
      </div>

      <div className="tiles">
        <Tile label="Respondents" value={data.respondents} />
        <Tile label="Ratings given" value={summary.total} />
        <Tile label="Average rating" value={summary.average ?? "–"} hint="out of 5 (N/A excluded)" />
      </div>
      <section className="page-card" style={{ margin: "18px 0" }}>
        <BandStrip summary={summary} />
      </section>

      <div className="tabs no-print">
        <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>All indicators</button>
        <button className={filter === "red" ? "active" : ""} onClick={() => setFilter("red")}>With red ratings</button>
        <button className={filter === "amber" ? "active" : ""} onClick={() => setFilter("amber")}>With amber ratings</button>
      </div>

      {!data.respondents && <div className="alert alert-info">Nobody has completed this instrument yet.</div>}

      {visible.map((item) => (
        <article key={item.code} className="item-card">
          <div className="item-head">
            <span className="code">{item.code}</span>
            <div>
              {item.heading && <h3>{item.heading}</h3>}
              {item.indicator && <p className="indicator">{item.indicator}</p>}
            </div>
          </div>
          {item.rows.map((row) => (
            <div key={row.part || "main"} className="summary-row">
              {row.part && (
                <div className="part">
                  <small className="muted">{item.partsLabel}</small> {row.part}
                </div>
              )}
              <div className="summary-cols">
                <div>
                  <div className="col-label">Ratings</div>
                  <div className="rating-dist">
                    {[5, 4, 3, 2, 1, 0].map((r) => (
                      <span key={r} className={row.ratingCounts[r] ? "" : "zero"} title={RATING_NAMES[r]}>
                        <RatingTag rating={r} label={`${r}`} /> × {row.ratingCounts[r]}
                      </span>
                    ))}
                  </div>
                  <div className="small muted" style={{ marginTop: 6 }}>
                    Average: <b>{row.average ?? "–"}</b> · {row.total} answer{row.total === 1 ? "" : "s"}
                  </div>
                  {row.total > 0 && <BandStrip summary={row} compact />}
                </div>
                <div>
                  <div className="col-label">Current situation chosen</div>
                  {row.situations.length ? (
                    <ul className="situations">
                      {row.situations.map((s) => (
                        <li key={s.situation}>
                          <span>{s.situation || <i className="muted">Not given (rated N/A)</i>}</span> <b>{s.count}</b>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="muted small">No answers yet</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </article>
      ))}

      <section className="page-card" style={{ marginTop: 18 }}>
        <h2 style={{ marginTop: 0 }}>Comments</h2>
        {data.comments.length ? (
          data.comments.map((c, i) => (
            <blockquote key={i} className="comment">
              <p>{c.comment}</p>
              <footer className="small muted">
                {c.name}
                {c.position && `, ${c.position}`} · {fmtDateTime(c.created_at)}
              </footer>
            </blockquote>
          ))
        ) : (
          <p className="muted">No comments for this instrument.</p>
        )}
      </section>
    </>
  );
}
