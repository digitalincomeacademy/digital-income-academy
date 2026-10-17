"use client";
import { useState, useMemo } from "react";
import { Award, ChevronDown } from "lucide-react";
import { useCollection } from "@/hooks/useCollection";
import { useResponsiveLimit } from "@/hooks/useResponsiveLimit";

const FALLBACK_PHOTO =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80";

export default function SuccessStories() {
  const { data, loading } = useCollection("successStories", (t) => t.active !== false);
  const [expanded, setExpanded] = useState(false);
  const limit = useResponsiveLimit();

  const items = useMemo(() => {
    const arr = [...data];
    arr.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
    return arr;
  }, [data]);
  const visible = expanded ? items : items.slice(0, limit);

  if (loading || items.length === 0) return null;

  return (
    <section className="py-10 md:py-14 bg-slate-950 relative border-t border-slate-900">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>সফলতার গল্প</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            আমাদের হাত ধরে{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
              সফলতা
            </span>
          </h2>
          <p className="mt-3 text-slate-400 text-base sm:text-lg">
            আমাদের কাছে কাজ শিখে সফল হয়েছেন যারা
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-2xl bg-slate-900/60 border border-slate-800 h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {visible.map((t) => (
              <div
                key={t.id}
                className="group relative card card-hover p-6 flex flex-col items-center text-center hover:border-amber-500/40"
              >
                <div className="relative w-24 h-24 mb-4">
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-amber-500/40 p-1 group-hover:border-amber-400 transition-colors">
                    <img
                      src={t.image || FALLBACK_PHOTO}
                      alt={t.name}
                      loading="lazy"
                      className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { e.currentTarget.src = FALLBACK_PHOTO; }}
                    />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                  {t.name}
                </h3>
                <span className="text-xs font-semibold text-amber-400 mt-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                  সফল শিক্ষার্থী
                </span>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed line-clamp-4">
                  {t.text}
                </p>
              </div>
            ))}
          </div>
        )}

        {items.length > limit && (
          <div className="text-center mt-10">
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors border border-slate-700"
            >
              <span>{expanded ? "কম দেখুন" : `আরও দেখুন (${items.length - limit})`}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
