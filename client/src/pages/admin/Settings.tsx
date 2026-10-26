import { useEffect, useState, type FormEvent } from "react";
import { useToast } from "../../components/Toasts";
import { ErrorBox, Spinner } from "../../components/ui";
import { api } from "../../lib/api";
import type { FormDefinition, School } from "../../lib/types";

/** Change the admin password (also used for the forced first-sign-in change). */
export function PasswordForm({ onDone }: { onDone?: () => void }) {
  const toast = useToast();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirmNext, setConfirmNext] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (next !== confirmNext) return setError("The new passwords do not match.");
    setBusy(true);
    setError(null);
    try {
      await api.post("/admin/password", { current, next });
      setCurrent("");
      setNext("");
      setConfirmNext("");
      toast("Password changed");
      onDone?.();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <ErrorBox error={error} />
      <label className="field">
        <span>Current password</span>
        <input className="input" type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} />
      </label>
      <label className="field">
        <span>New password (at least 10 characters)</span>
        <input className="input" type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} />
      </label>
      <label className="field">
        <span>Repeat new password</span>
        <input className="input" type="password" autoComplete="new-password" value={confirmNext} onChange={(e) => setConfirmNext(e.target.value)} />
      </label>
      <button className="btn btn-primary" disabled={busy || !current || !next}>Change password</button>
    </form>
  );
}

function SchoolForm() {
  const toast = useToast();
  const [school, setSchool] = useState<School | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get<FormDefinition>("/form").then((d) => setSchool(d.school)).catch((e) => setError(e.message));
  }, []);

  if (!school) return error ? <ErrorBox error={error} /> : <Spinner />;
  const field = (key: keyof School, label: string) => (
    <label className="field">
      <span>{label}</span>
      <input className="input" value={school[key]} onChange={(e) => setSchool({ ...school, [key]: e.target.value })} />
    </label>
  );

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const d = await api.put<{ school: School }>("/admin/school", school);
      setSchool(d.school);
      toast("School details saved");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <ErrorBox error={error} />
      {field("schoolName", "School name")}
      <div className="grid-2">
        {field("emis", "EMIS number")}
        {field("year", "Year")}
        {field("district", "Education district")}
        {field("circuit", "Circuit")}
      </div>
      <button className="btn btn-primary" disabled={busy}>Save</button>
    </form>
  );
}

export default function Settings() {
  return (
    <div className="grid-2" style={{ alignItems: "start" }}>
      <section className="page-card">
        <h2 style={{ marginTop: 0 }}>School details</h2>
        <p className="muted small">Shown at the top of the form and on the dashboard.</p>
        <SchoolForm />
      </section>
      <section className="page-card">
        <h2 style={{ marginTop: 0 }}>Admin password</h2>
        <PasswordForm />
      </section>
    </div>
  );
}
