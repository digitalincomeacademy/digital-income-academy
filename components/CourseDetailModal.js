"use client";
import { useEffect } from "react";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";
import { motion, AnimatePresence } from "framer-motion";
import { X, Pin, Sparkles, ExternalLink } from "lucide-react";
import ShareButton from "@/components/ShareButton";

export default function CourseDetailModal({ course, onClose, onJoin }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    lockScroll();
    return () => {
      window.removeEventListener("keydown", onKey);
      unlockScroll();
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      {course && (
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
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl"
          >
            <button
              onClick={onClose}
              aria-label="বন্ধ করুন"
              className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {course.imageUrl && (
              <div className="relative aspect-video w-full overflow-hidden rounded-t-3xl">
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  {course.pinned && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500 text-slate-950 font-bold text-xs">
                      <Pin className="w-3 h-3 fill-slate-950" /> পিন্ড
                    </span>
                  )}
                  {course.featured && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/90 text-slate-950 font-bold text-xs">
                      <Sparkles className="w-3 h-3" /> স্পেশাল
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="p-6 sm:p-8">
              {course.category && (
                <span className="text-xs font-medium px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {course.category}
                </span>
              )}
              <div className="flex items-start justify-between gap-4">
                <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-white leading-snug flex-1">
                  {course.title}
                </h2>
                <ShareButton
                  title={course.title}
                  url={typeof window !== "undefined" ? `${window.location.origin}/#courses` : ""}
                  size="lg"
                />
              </div>
              <p className="mt-4 text-slate-300 leading-relaxed whitespace-pre-wrap">
                {course.description || "বিস্তারিত বিবরণ শীঘ্রই যোগ করা হবে।"}
              </p>

              <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <span className="text-xs text-slate-500 block">মূল্য</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-2xl font-extrabold text-slate-100">
                      {course.isFree ? (
                        <span className="text-emerald-400">সম্পূর্ণ ফ্রি</span>
                      ) : (
                        `${course.price} ${course.currency}`
                      )}
                    </span>
                    {!course.isFree && course.oldPrice > course.price && (
                      <>
                        <span className="text-base line-through text-slate-500">
                          {course.oldPrice} {course.currency}
                        </span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/30">
                          {Math.round(((course.oldPrice - course.price) / course.oldPrice) * 100)}% ছাড়
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => onJoin(course)}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md ${
                    course.isFree
                      ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                      : "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                  }`}
                >
                  <span>{course.isFree ? "Join Free" : "Join Course"}</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
