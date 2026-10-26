import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../../components/Toasts";
import { ErrorBox, Modal, Spinner } from "../../components/ui";
import { api, fmtDateTime } from "../../lib/api";
import type { BandSummary } from "../../lib/types";
import type { ResponseListItem } from "./adminTypes";

/** Small stacked green/amber/red/N/A bar. */
function MiniBar({ s }: { s: BandSummary }) {
  return (
    <span className="band-bar mini" title={`Green ${s.percent.green}% · Amber ${s.percent.amber}% · Red ${s.percent.red}% · N/A ${s.percent.na}%`}>
      {(["green", "amber", "red", "na"] as const).map((b) => (s.percent[b] ? <span key={b} className={`b-${b}`} style={{ width: `${s.percent[b]}%` }} /> : null))}
    </span>
  );
}

/** Confirm with the word DELETE and the admin password before wiping every submission. */
function DeleteAllModal({ count, onClose, onDone }: { count: number; onClose(): void; onDone(deleted: number): void }) {
  const [confirm, setConfirm] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const r = await api.post<{ deleted: number }>("/admin/responses/delete-all", { confirm, password });
      onDone(r.deleted);
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  return (
    <Modal title="Delete all responses" onClose={onClose}>
      <form onSubmit={submit}>
        <div className="alert alert-error">
          This permanently deletes all <b>{count}</b> submission{count === 1 ? "" : "s"} and every answer and comment in them. It cannot be undone. Export the CSV first if
          you need a copy.
        </div>
        <ErrorBox error={error} />
        <label className="field">
          <span>Type DELETE to confirm</span>
          <input className="input" autoFocus value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </label>
        <label className="field">
          <span>Your admin password</span>
          <input className="input" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <div className="footer-bar">
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-danger" disabled={busy || confirm !== "DELETE" || !password}>
            {busy ? "Deleting…" : "Delete everything"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

/** Everyone who submitted, newest first. */
export default function Responses() {
  const [rows, setRows] = useState<ResponseListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [deleting, setDeleting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    api.get<{ responses: ResponseListItem[] }>("/admin/responses").then((d) => setRows(d.responses)).catch((e) => setError(e.message));
  }, []);

  if (error) return <ErrorBox error={error} />;
  if (!rows) return <Spinner />;
  const needle = q.trim().toLowerCase();
  const shown = rows.filter((r) => !needle || `${r.name} ${r.position}`.toLowerCase().includes(needle));

  return (
    <>
      <div className="page-head">
        <h1 style={{ margin: 0 }}>Responses ({rows.length})</h1>
        <span className="row">
          <input className="input" placeholder="Search name or position…" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: 240 }} />
          <a className="btn" href="/api/admin/export.csv">⬇ CSV</a>
          {rows.length > 0 && (
            <button className="btn btn-danger" onClick={() => setDeleting(true)}>Delete all responses</button>
          )}
        </span>
      </div>
      {deleting && (
        <DeleteAllModal
          count={rows.length}
          onClose={() => setDeleting(false)}
          onDone={(n) => {
            setDeleting(false);
            setRows([]);
            toast(`${n} response${n === 1 ? "" : "s"} deleted`);
          }}
        />
      )}
      {rows.length === 0 ? (
        <div className="empty page-card">No one has submitted the self-evaluation yet. Share the form link: {window.location.origin}/</div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Submitted</th>
                <th>Instruments</th>
                <th>Overall</th>
                <th className="right">Avg</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r.id}>
                  <td>
                    <Link to={`/admin/responses/${r.id}`}><b>{r.name}</b></Link>
                  </td>
                  <td>{r.position || <span className="faint">–</span>}</td>
                  <td className="nowrap">{fmtDateTime(r.created_at)}</td>
                  <td>
                    <span className="chip-row">
                      {r.instruments.map((i) => (
                        <span key={i.number} className="inst-chip" title={`Instrument ${i.number}`}>
                          {i.number}
                          <MiniBar s={i} />
                        </span>
                      ))}
                    </span>
                  </td>
                  <td style={{ minWidth: 140 }}>
                    <MiniBar s={r.overall} />
                  </td>
                  <td className="right">{r.overall.average ?? "–"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
