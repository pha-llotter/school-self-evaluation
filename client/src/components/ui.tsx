import { useEffect, type ReactNode } from "react";
import { BAND_LABEL } from "../lib/bands";
import type { Band, BandSummary } from "../lib/types";

export function Spinner() {
  return <div className="spinner" role="status" aria-label="Loading" />;
}

export function ErrorBox({ error }: { error: string | null | undefined }) {
  if (!error) return null;
  return <div className="alert alert-error">{error}</div>;
}

export function Tile({ label, value, hint, tone }: { label: ReactNode; value: ReactNode; hint?: ReactNode; tone?: "good" | "warn" | "bad" | "na" }) {
  return (
    <div className={`tile${tone ? ` ${tone}` : ""}`}>
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      {hint && <div className="hint">{hint}</div>}
    </div>
  );
}

export function ProgressBar({ value, max, ok }: { value: number; max: number; ok?: boolean }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className={`progress${ok ? " ok" : ""}`} role="progressbar" aria-valuenow={value} aria-valuemax={max}>
      <div style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Modal({ title, children, footer, onClose }: { title: ReactNode; children: ReactNode; footer?: ReactNode; onClose(): void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-head">
          <h2>{title}</h2>
          <button className="btn btn-link" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

const BANDS: Band[] = ["green", "amber", "red", "na"];

/** The GREEN / AMBER / RED / N/A strip from the templates, plus a stacked bar. */
export function BandStrip({ summary, compact = false }: { summary: BandSummary; compact?: boolean }) {
  return (
    <div className={`band-strip${compact ? " compact" : ""}`}>
      <div className="band-bar" aria-hidden>
        {BANDS.map((b) => (summary.percent[b] ? <span key={b} className={`b-${b}`} style={{ width: `${summary.percent[b]}%` }} /> : null))}
        {!summary.total && <span className="b-empty" style={{ width: "100%" }} />}
      </div>
      <div className="band-legend">
        {BANDS.map((b) => (
          <span key={b}>
            <i className={`dot b-${b}`} /> {BAND_LABEL[b]} <b>{summary.percent[b]}%</b>
          </span>
        ))}
      </div>
    </div>
  );
}

/** Coloured tag for one rating (5= OUTSTANDING …). */
export function RatingTag({ rating, label }: { rating: number | null; label?: string }) {
  if (rating === null) return <span className="tag">–</span>;
  const b = rating >= 4 ? "green" : rating === 3 ? "amber" : rating >= 1 ? "red" : "na";
  return <span className={`rating-tag r-${b}`}>{label ?? rating}</span>;
}
