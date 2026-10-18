"use client";
import { useEffect } from "react";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";
import { motion, AnimatePresence } from "framer-motion";
import { X, Pin, Calendar, ExternalLink } from "lucide-react";
import { formatBnDate } from "@/lib/siteData";
import ShareButton from "@/components/ShareButton";
import PromptBox from "@/components/PromptBox";

export default function PostDetailModal({ post, onClose, onOpenLink }) {
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
      {post && (
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

            {post.imageUrl && (
              <div className="relative aspect-video w-full overflow-hidden rounded-t-3xl">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                {post.pinned && (
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500 text-slate-950 font-bold text-xs">
                      <Pin className="w-3 h-3 fill-slate-950" /> পিন্ড পোস্ট
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug flex-1">
                  {post.title}
                </h2>
                <ShareButton
                  title={post.title}
                  url={typeof window !== "undefined" ? `${window.location.origin}/#posts` : ""}
                  size="lg"
                />
              </div>
              {post.createdAt && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{formatBnDate(post.createdAt)}</span>
                </div>
              )}
              <p className="mt-4 text-slate-300 leading-relaxed whitespace-pre-wrap">
                {post.description || post.content || "বিস্তারিত শীঘ্রই যোগ করা হবে।"}
              </p>

              <PromptBox prompt={post.prompt} />

              {post.externalUrl && (
                <div className="mt-6 pt-5 border-t border-slate-800">
                  <button
                    onClick={() => onOpenLink(post)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>লিংকে যান</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
