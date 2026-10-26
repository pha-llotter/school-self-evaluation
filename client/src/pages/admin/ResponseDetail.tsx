import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../components/Toasts";
import { BandStrip, ErrorBox, RatingTag, Spinner } from "../../components/ui";
import { api, fmtDateTime } from "../../lib/api";
import type { ResponseDetailData } from "./adminTypes";

const RATING_LABEL = ["NOT APPLICABLE", "WEAK", "NEEDS IMPROVEMENT", "ACCEPTABLE", "GOOD", "OUTSTANDING"];

/** One person's submission, laid out like the templates. */
export default function ResponseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [data, setData] = useState<ResponseDetailData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<ResponseDetailData>(`/admin/responses/${id}`).then(setData).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <ErrorBox error={error} />;
  if (!data) return <Spinner />;
  const r = data.response;

  async function remove() {
    if (!confirm(`Delete the submission by ${r.name}? This cannot be undone.`)) return;
    try {
      await api.del(`/admin/responses/${r.id}`);
      toast("Submission deleted");
      navigate("/admin/responses");
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <>
      <div className="page-head">
        <div>
          <Link to="/admin/responses" className="small no-print">◀ Responses</Link>
          <h1 style={{ margin: "4px 0 0" }}>{r.name}</h1>
          <div className="muted small">
            {r.position && `${r.position} · `}Submitted {fmtDateTime(r.created_at)} · average {data.summary.average ?? "–"}
          </div>
        </div>
        <span className="row no-print">
          <button className="btn" onClick={() => window.print()}>🖨 Print</button>
          <button className="btn btn-danger" onClick={remove}>Delete</button>
        </span>
      </div>
      <section className="page-card" style={{ marginBottom: 18 }}>
        <BandStrip summary={data.summary} />
      </section>

      {data.instruments.map((inst) => (
        <section key={inst.number} className="page-card response-instrument">
          <h2 style={{ marginTop: 0 }}>
            {inst.number}. {inst.title}
          </h2>
          <BandStrip summary={inst.summary} compact />
          <div className="table-wrap" style={{ marginTop: 12 }}>
            <table className="table answers-table">
              <thead>
                <tr>
                  <th style={{ width: 80 }}>Code</th>
                  <th>Indicator</th>
                  <th style={{ width: "24%" }}>Current situation</th>
                  <th style={{ width: 150 }}>Rating</th>
                </tr>
              </thead>
              <tbody>
                {inst.items.flatMap((item) =>
                  item.answers.map((a, i) => (
                    <tr key={`${item.code}|${a.part}`}>
                      <td className="mono small">{i === 0 ? item.code : ""}</td>
                      <td>
                        {i === 0 && (
                          <>
                            {item.heading && <b>{item.heading}</b>}
                            {item.indicator && <div className="small pre">{item.indicator}</div>}
                          </>
                        )}
                        {a.part && (
                          <div className="small">
                            <span className="muted">{item.partsLabel}</span> <b>{a.part}</b>
                          </div>
                        )}
                      </td>
                      <td className="small">{a.situation || <span className="faint">{a.rating === 0 ? "Not applicable" : "–"}</span>}</td>
                      <td>
                        <RatingTag rating={a.rating} label={a.rating === null ? undefined : `${a.rating}= ${RATING_LABEL[a.rating]}`} />
                      </td>
                    </tr>
                  )),
                )}
              </tbody>
            </table>
          </div>
          {inst.comment && (
            <blockquote className="comment">
              <p>{inst.comment}</p>
            </blockquote>
          )}
        </section>
      ))}
    </>
  );
}
