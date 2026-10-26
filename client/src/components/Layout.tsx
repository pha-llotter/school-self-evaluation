import type { ReactNode } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

/** Crest + wordmark, styled like TypeQuest's header. */
export function Brand({ school }: { school?: string }) {
  return (
    <span className="brand">
      <img src="/crest-128.png" alt="" />
      <span className="brand-text">
        <span className="brand-name">
          Self-<span>Evaluation</span>
        </span>
        {school && <span className="brand-school">{school}</span>}
      </span>
    </span>
  );
}

export function Shell({ school, nav, right, children }: { school?: string; nav?: ReactNode; right?: ReactNode; children: ReactNode }) {
  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-inner">
          <Link to="/" className="brand-link" aria-label="Home">
            <Brand school={school} />
          </Link>
          <nav className="mainnav">{nav}</nav>
          <div className="header-right">{right}</div>
        </div>
      </header>
      <main className="app-main">{children}</main>
      <footer className="app-footer">
        <span>© {new Date().getFullYear()} {school ?? "School Self-Evaluation"}</span>
        <span className="motto">Fides · Bonitatem · Perseverantia</span>
      </footer>
    </div>
  );
}

/** Layout for the public form. */
export function PublicLayout({ school }: { school?: string }) {
  return (
    <Shell school={school} right={<NavLink to="/admin" className="streak-pill" style={{ textDecoration: "none" }}>Admin</NavLink>}>
      <Outlet />
    </Shell>
  );
}
