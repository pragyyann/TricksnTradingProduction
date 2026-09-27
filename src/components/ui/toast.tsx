import * as React from "react";
import { CheckCircle2, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
}

interface ToastContextType {
  toast: (message: Omit<ToastMessage, "id">) => void;
  dismiss: (id: string) => void;
  toasts: ToastMessage[];
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback(({ title, description, type = "success", duration = 5000 }: Omit<ToastMessage, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, type, duration }]);

    setTimeout(() => {
      dismiss(id);
    }, duration);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ toast, dismiss, toasts }}>
      {children}
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  dismiss: (id: string) => void;
}

function ToastContainer({ toasts, dismiss }: ToastContainerProps) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 w-full max-w-sm px-4 md:px-0">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "flex items-start gap-3 p-4 rounded-xl shadow-lg border animate-in slide-in-from-bottom duration-300 bg-[#FBF9F4]",
            {
              "border-emerald-700/30 bg-emerald-50 text-emerald-800": t.type === "success",
              "border-rose-700/30 bg-rose-50 text-rose-800": t.type === "error",
              "border-[#496A82]/30 bg-[#496A82]/10 text-[#496A82]": t.type === "info",
            }
          )}
        >
          {t.type === "success" && <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />}
          {t.type === "error" && <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />}
          {t.type === "info" && <CheckCircle2 className="h-5 w-5 text-[#496A82] shrink-0 mt-0.5" />}

          <div className="flex-1">
            <h4 className="font-semibold text-sm leading-tight text-[#3A3024]">{t.title}</h4>
            {t.description && <p className="text-xs mt-1 text-[#756B5D] leading-snug">{t.description}</p>}
          </div>

          <button
            onClick={() => dismiss(t.id)}
            className="text-[#756B5D] hover:text-[#3A3024] cursor-pointer shrink-0 mt-0.5"
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
