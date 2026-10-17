"use client";
import { useState } from "react";
import { Megaphone, Pause, Play } from "lucide-react";
import { useCollection } from "@/hooks/useCollection";
import { stripEmojis } from "@/lib/siteData";

export default function AnnouncementTicker() {
  const [isPaused, setIsPaused] = useState(false);
  const { data } = useCollection("announcements", (a) => a.active !== false);
  const announcements = data
    .map((a) => ({ ...a, text: stripEmojis(a.text) }))
    .filter((a) => a.text);

  if (!announcements.length) return null;
  const items = [...announcements, ...announcements];

  return (
    <div className="relative border-y border-emerald-500/20 bg-gradient-to-r from-emerald-950/40 via-slate-900/90 to-emerald-950/40 backdrop-blur-md overflow-hidden text-sm py-2">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-3">
        <div className="flex-shrink-0 flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold text-xs px-2.5 py-1 rounded-full shadow-inner z-10">
          <Megaphone className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
          <span className="tracking-wide">নোটিশ বোর্ড</span>
        </div>

        <div
          className="relative flex-1 overflow-hidden mask-gradient"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className={`flex items-center gap-8 whitespace-nowrap text-slate-200 font-medium ${isPaused ? "" : "animate-ticker"}`}
            style={{ animationPlayState: isPaused ? "paused" : "running" }}
          >
            {items.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="inline-flex items-center gap-2 group hover:text-emerald-300 transition-colors"
              >
                <span className="text-emerald-500/60 text-xs font-mono">✦</span>
                <span className="text-xs sm:text-sm tracking-wide">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setIsPaused(!isPaused)}
          title={isPaused ? "প্লে করুন" : "পজ করুন"}
          aria-label={isPaused ? "Play announcement ticker" : "Pause announcement ticker"}
          className="flex-shrink-0 p-1 text-slate-400 hover:text-emerald-400 rounded transition-colors"
        >
          {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}
