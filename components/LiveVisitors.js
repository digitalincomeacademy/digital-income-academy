"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Users } from "lucide-react";
import { useLiveVisitors } from "@/lib/visitors";

// লাইভ ভিজিটর ব্যাজ — লোড না হওয়া পর্যন্ত লুকানো থাকে
export default function LiveVisitors({ className = "" }) {
  const { liveCount, loading } = useLiveVisitors();
  return (
    <AnimatePresence>
      {!loading && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          aria-live="polite"
          className={`inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs text-slate-200 whitespace-nowrap ${className}`}
        >
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <Users size={14} className="text-emerald-400 shrink-0" />
          <span>
            এই মুহূর্তে <b className="text-white font-bold">{liveCount}</b> জন
            অনলাইনে
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
