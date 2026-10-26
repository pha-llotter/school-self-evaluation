import { useEffect, useState } from "react";
import { Navigate, NavLink, Outlet } from "react-router-dom";
import { Shell } from "../../components/Layout";
import { Spinner } from "../../components/ui";
import { api } from "../../lib/api";
import { useAdmin } from "../../lib/admin";
import type { FormDefinition } from "../../lib/types";
import { PasswordForm } from "./Settings";

/** Signed-in admin area. Forces a password change on first sign-in. */
export default function AdminLayout() {
  const { user, logout, refresh } = useAdmin();
  const [school, setSchool] = useState<string>();

  useEffect(() => {
    api.get<FormDefinition>("/form").then((d) => setSchool(d.school.schoolName)).catch(() => {});
  }, []);

  if (user === undefined) return <Spinner />;
  if (!user) return <Navigate to="/admin/login" replace />;

  const nav = user.mustChangePassword ? null : (
    <>
      <NavLink to="/admin" end>Dashboard</NavLink>
      <NavLink to="/admin/responses">Responses</NavLink>
      <NavLink to="/admin/settings">Settings</NavLink>
    </>
  );
  const right = (
    <button className="streak-pill" style={{ border: 0, cursor: "pointer", font: "inherit" }} onClick={logout}>
      Sign out
    </button>
  );

  return (
    <Shell school={school} nav={nav} right={right}>
      {user.mustChangePassword ? (
        <div className="page-card" style={{ maxWidth: 520, margin: "0 auto", width: "100%" }}>
          <h1>Choose a new password</h1>
          <p className="muted">This is your first sign-in with the generated password. Please choose your own password before continuing.</p>
          <PasswordForm onDone={refresh} />
        </div>
      ) : (
        <Outlet />
      )}
    </Shell>
  );
}
