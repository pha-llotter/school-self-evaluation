import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

interface Toast {
  id: number;
  content: ReactNode;
}

const ToastContext = createContext<(content: ReactNode, ms?: number) => void>(() => {});

/** App-wide notifications (badges earned, level up, saved, …). */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((content: ReactNode, ms = 4500) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, content }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), ms);
  }, []);
  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="toast-stack" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="toast">{t.content}</div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
