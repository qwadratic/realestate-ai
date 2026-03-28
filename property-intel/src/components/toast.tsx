"use client";

import { useState, useCallback, createContext, useContext } from "react";

type ToastType = "error" | "success" | "info";

interface Toast {
  id: number;
  type: ToastType;
  title: string;
  message: string;
  persistent: boolean;
}

const ToastContext = createContext<{
  addToast: (t: Omit<Toast, "id">) => void;
  removeToast: (id: number) => void;
}>({ addToast: () => {}, removeToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

let nextId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((t: Omit<Toast, "id">) => {
    const id = nextId++;
    setToasts((prev) => [...prev, { ...t, id }]);
    if (!t.persistent) {
      setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 5000);
    }
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const colors = {
    error: { bg: "bg-signal-red/10", border: "border-signal-red/30", text: "text-signal-red", dot: "bg-signal-red" },
    success: { bg: "bg-signal-green/10", border: "border-signal-green/30", text: "text-signal-green", dot: "bg-signal-green" },
    info: { bg: "bg-copper/10", border: "border-copper/30", text: "text-copper", dot: "bg-copper" },
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast container — left side */}
      <div className="fixed bottom-6 left-6 z-[100] flex flex-col gap-2 max-w-[380px]">
        {toasts.map((t) => {
          const c = colors[t.type];
          return (
            <div
              key={t.id}
              className={`${c.bg} border ${c.border} rounded-[4px] px-4 py-3 shadow-lg animate-in slide-in-from-left`}
            >
              <div className="flex items-start gap-3">
                <span className={`w-2 h-2 rounded-full ${c.dot} mt-1.5 shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-[14px] font-medium ${c.text}`}>{t.title}</p>
                  <p className="text-[13px] text-text mt-0.5 break-words">{t.message}</p>
                </div>
                {t.persistent && (
                  <button
                    onClick={() => removeToast(t.id)}
                    className="text-muted hover:text-text shrink-0 ml-2"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
