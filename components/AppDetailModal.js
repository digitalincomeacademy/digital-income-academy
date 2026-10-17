"use client";
import { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Smartphone, Download, ExternalLink } from "lucide-react";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";
import ShareButton from "@/components/ShareButton";

export default function AppDetailModal({ app, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    lockScroll();
    return () => {
      window.removeEventListener("keydown", onKey);
      unlockScroll();
    };
  }, [onClose]);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/apps#${app?.id || ""}`
      : "";

  return (
    <AnimatePresence>
      {app && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl"
          >
            <button
              onClick={onClose}
              aria-label="বন্ধ করুন"
              className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 shrink-0">
                  {app.icon ? (
                    <Image
                      src={app.icon}
                      alt={app.name || "অ্যাপ"}
                      width={80}
                      height={80}
                      className="rounded-2xl object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full rounded-2xl bg-navy-800 flex items-center justify-center">
                      <Smartphone size={32} className="text-brand-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                    {app.name || app.title}
                  </h2>
                  {app.category && (
                    <span className="inline-block mt-2 text-xs font-semibold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 rounded-full px-3 py-1">
                      {app.category}
                    </span>
                  )}
                </div>
                <ShareButton title={app.name || app.title} url={shareUrl} size="lg" />
              </div>

              {(app.description || app.excerpt) && (
                <p className="mt-5 text-slate-300 leading-relaxed whitespace-pre-line">
                  {app.description || app.excerpt}
                </p>
              )}

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                {app.downloadUrl && (
                  <a
                    href={app.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-3 transition-colors"
                  >
                    <Download className="w-5 h-5" /> ডাউনলোড করুন
                  </a>
                )}
                {app.telegramUrl && (
                  <a
                    href={app.telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold px-4 py-3 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" /> টেলিগ্রামে জয়েন
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
