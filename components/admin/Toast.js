"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, Info } from "lucide-react";

const ToastContext = createContext(null);

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const BORDER_COLOR = {
  success: "border-green-500/40",
  error: "border-red-500/40",
  info: "border-brand-400/40",
};

const ICON_COLOR = {
  success: "text-green-400",
  error: "text-red-400",
  info: "text-brand-400",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (type, message) => {
      const id = ++idRef.current;
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => dismiss(id), 3000);
    },
    [dismiss]
  );

  const toast = {
    success: (message) => push("success", message),
    error: (message) => push("error", message),
    info: (message) => push("info", message),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = ICONS[t.type];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 60 }}
                transition={{ duration: 0.25 }}
                className={`flex items-center gap-3 rounded-xl border bg-navy-900 px-4 py-3 shadow-xl ${BORDER_COLOR[t.type]}`}
              >
                <Icon className={`h-5 w-5 shrink-0 ${ICON_COLOR[t.type]}`} />
                <p className="flex-1 font-body text-sm text-white">{t.message}</p>
                <button
                  onClick={() => dismiss(t.id)}
                  className="shrink-0 text-slate-400 transition hover:text-white"
                  aria-label="বন্ধ করুন"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast অবশ্যই ToastProvider-এর ভেতরে ব্যবহার করতে হবে।");
  return ctx;
}
