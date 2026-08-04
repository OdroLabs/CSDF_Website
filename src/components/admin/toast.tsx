"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AlertTriangle, CheckCircle2, Info, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastVariant = "success" | "error" | "info" | "loading";

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  /** Milliseconds before auto-dismiss. 0 keeps it until dismissed. */
  duration?: number;
}

interface Toast extends ToastOptions {
  id: number;
}

interface ToastApi {
  /** Show a toast. Returns its id so it can be updated or dismissed. */
  toast: (options: ToastOptions) => number;
  /** Replace an existing toast in place — used to turn "Saving…" into "Saved". */
  update: (id: number, options: ToastOptions) => void;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

/** Errors stay longer than confirmations; loading stays until replaced. */
const DEFAULT_DURATION: Record<ToastVariant, number> = {
  success: 3500,
  info: 4000,
  error: 8000,
  loading: 0,
};

const STYLES: Record<ToastVariant, { wrap: string; icon: string }> = {
  success: { wrap: "border-teal-300 bg-teal-50 text-teal-900", icon: "text-teal-600" },
  error: { wrap: "border-red-300 bg-red-50 text-red-900", icon: "text-red-600" },
  info: { wrap: "border-border bg-white text-foreground", icon: "text-primary" },
  loading: { wrap: "border-border bg-white text-foreground", icon: "text-primary" },
};

const ICONS: Record<ToastVariant, typeof Info> = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info,
  loading: Loader2,
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: number) => {
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const schedule = useCallback(
    (id: number, variant: ToastVariant, duration?: number) => {
      const existing = timers.current.get(id);
      if (existing) clearTimeout(existing);
      const ms = duration ?? DEFAULT_DURATION[variant];
      if (ms > 0) timers.current.set(id, setTimeout(() => dismiss(id), ms));
    },
    [dismiss]
  );

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = nextId.current++;
      const variant = options.variant ?? "info";
      setToasts((prev) => [...prev, { ...options, variant, id }]);
      schedule(id, variant, options.duration);
      return id;
    },
    [schedule]
  );

  const update = useCallback(
    (id: number, options: ToastOptions) => {
      const variant = options.variant ?? "info";
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...options, variant, id } : t))
      );
      schedule(id, variant, options.duration);
    },
    [schedule]
  );

  // Clear pending timers if the provider unmounts.
  useEffect(() => {
    const map = timers.current;
    return () => {
      map.forEach((t) => clearTimeout(t));
      map.clear();
    };
  }, []);

  const api = useMemo<ToastApi>(() => ({ toast, update, dismiss }), [toast, update, dismiss]);

  return (
    <ToastContext.Provider value={api}>
      {children}

      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed right-4 top-[4.75rem] z-[100] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2"
      >
        {toasts.map((t) => {
          const variant = t.variant ?? "info";
          const Icon = ICONS[variant];
          return (
            <div
              key={t.id}
              role={variant === "error" ? "alert" : "status"}
              className={cn(
                "pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg shadow-navy-950/10",
                "animate-in fade-in slide-in-from-top-2 duration-200",
                STYLES[variant].wrap
              )}
            >
              <Icon
                className={cn(
                  "mt-0.5 h-4 w-4 shrink-0",
                  STYLES[variant].icon,
                  variant === "loading" && "animate-spin"
                )}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-snug">{t.title}</p>
                {t.description && (
                  <p className="mt-0.5 break-words text-xs leading-relaxed opacity-80">
                    {t.description}
                  </p>
                )}
              </div>
              {variant !== "loading" && (
                <button
                  type="button"
                  onClick={() => dismiss(t.id)}
                  aria-label="Dismiss"
                  className="-mr-1 -mt-1 rounded-md p-1 opacity-50 transition-opacity hover:opacity-100"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
