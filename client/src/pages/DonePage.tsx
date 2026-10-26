import { Link, useLocation } from "react-router-dom";
import { BandStrip } from "../components/ui";
import type { SubmitResult } from "./ReviewPage";

/** Thank-you page with the respondent's own colour summary. */
export default function DonePage() {
  const state = useLocation().state as { result: SubmitResult; titles: Record<number, string>; name: string } | null;
  return (
    <div className="page-card" style={{ maxWidth: 820, margin: "0 auto", width: "100%" }}>
      <h1>Thank you{state?.name ? `, ${state.name.split(" ")[0]}` : ""}!</h1>
      <p>Your self-evaluation has been submitted. The administrator can now see your answers.</p>
      {state?.result.summary.map((s) => (
        <section key={s.number} className="review-block">
          <h3 style={{ marginTop: 0 }}>
            {s.number}. {state.titles[s.number]}
          </h3>
          <BandStrip summary={s} compact />
        </section>
      ))}
      <div className="footer-bar">
        <Link to="/" className="btn btn-primary">Start a new evaluation (another person)</Link>
      </div>
    </div>
  );
}
