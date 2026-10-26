import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api, ApiError } from "./api";

export interface AdminUser {
  username: string;
  mustChangePassword: boolean;
}

interface AdminState {
  /** undefined while checking the session, null when signed out */
  user: AdminUser | null | undefined;
  login(username: string, password: string): Promise<void>;
  logout(): Promise<void>;
  refresh(): Promise<void>;
}

const AdminContext = createContext<AdminState | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null | undefined>(undefined);

  const refresh = useCallback(async () => {
    try {
      setUser(await api.get<AdminUser>("/admin/me"));
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) setUser(null);
      else throw e;
    }
  }, []);

  useEffect(() => {
    refresh().catch(() => setUser(null));
  }, [refresh]);

  const value = useMemo<AdminState>(
    () => ({
      user,
      refresh,
      login: async (username, password) => setUser(await api.post<AdminUser>("/admin/login", { username, password })),
      logout: async () => {
        await api.post("/admin/logout").catch(() => {});
        setUser(null);
      },
    }),
    [user, refresh],
  );
  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin(): AdminState {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin outside AdminProvider");
  return ctx;
}
