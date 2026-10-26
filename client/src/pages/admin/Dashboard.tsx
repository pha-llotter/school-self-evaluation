import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BandStrip, ErrorBox, Spinner, Tile } from "../../components/ui";
import { api } from "../../lib/api";
import type { SummaryResponse } from "./adminTypes";

/** Overview: how many people responded and the colour spread for every instrument. */
export default function Dashboard() {
  const [data, setData] = useState<SummaryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<SummaryResponse>("/admin/summary").then(setData).catch((e) => setError(e.message));
  }, []);

  if (error) return <ErrorBox error={error} />;
  if (!data) return <Spinner />;
  const { school, overall } = data;

  return (
    <>
      <div className="page-head">
        <div>
          <h1 style={{ margin: 0 }}>{school.year} School Self-Evaluation</h1>
          <div className="muted small">
            {school.schoolName} · EMIS {school.emis} · {school.district} · Circuit {school.circuit}
          </div>
        </div>
        <a className="btn" href="/api/admin/export.csv">⬇ Export all answers (CSV)</a>
      </div>

      <div className="tiles">
        <Tile label="Responses" value={data.responses} hint="people who submitted" />
        <Tile label="Ratings given" value={overall.total} />
        <Tile label="Average rating" value={overall.average ?? "–"} hint="out of 5 (N/A excluded)" />
        <Tile label="Green (4–5)" value={`${overall.percent.green}%`} tone="good" />
        <Tile label="Amber (3)" value={`${overall.percent.amber}%`} tone="warn" />
        <Tile label="Red (1–2)" value={`${overall.percent.red}%`} tone={overall.percent.red ? "bad" : undefined} />
        <Tile label="N/A (0)" value={`${overall.percent.na}%`} tone="na" />
      </div>

      <section className="page-card" style={{ marginTop: 18 }}>
        <h2 style={{ marginTop: 0 }}>All instruments</h2>
        <BandStrip summary={overall} />
      </section>

      <div className="instrument-cards">
        {data.instruments.map((inst) => (
          <Link key={inst.number} to={`/admin/instruments/${inst.number}`} className="instrument-card">
            <div className="row between">
              <span className="num">{inst.number}</span>
              <span className="small muted">
                {inst.respondents} respondent{inst.respondents === 1 ? "" : "s"} · avg {inst.average ?? "–"}
              </span>
            </div>
            <h3>{inst.title}</h3>
            <div className="small muted" style={{ marginBottom: 8 }}>{inst.items} indicators</div>
            <BandStrip summary={inst} compact />
          </Link>
        ))}
      </div>
    </>
  );
}
