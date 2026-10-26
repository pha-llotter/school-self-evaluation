import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ErrorBox, Spinner } from "../../components/ui";
import { ApiError } from "../../lib/api";
import { useAdmin } from "../../lib/admin";

export default function AdminLogin() {
  const { user, login } = useAdmin();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (user === undefined) return <Spinner />;
  if (user) return <Navigate to="/admin" replace />;

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login(username, password);
      navigate("/admin");
    } catch (err) {
      setError(err instanceof ApiError && err.status !== 401 ? err.message : "Wrong username or password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-wrap">
      <section className="login-hero" aria-hidden>
        <img src="/crest.png" alt="" />
        <div className="school">School Self-Evaluation</div>
        <div className="motto">Fides · Bonitatem · Perseverantia</div>
      </section>
      <div className="login-side">
        <form className="login-card" onSubmit={submit}>
          <h1>
            Self-<span>Evaluation</span>
          </h1>
          <p className="muted small" style={{ marginTop: -8 }}>Administrator sign-in</p>
          <ErrorBox error={error} />
          <label className="field">
            <span>Username</span>
            <input className="input" autoFocus autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>
          <label className="field">
            <span>Password</span>
            <input className="input" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <button className="btn btn-primary btn-big" style={{ width: "100%", marginTop: 4 }} disabled={busy || !username || !password}>
            Sign in
          </button>
          <p className="small muted center" style={{ marginTop: 18, marginBottom: 0 }}>
            <a href="/">◀ Back to the form</a>
          </p>
        </form>
      </div>
    </div>
  );
}
