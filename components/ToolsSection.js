"use client";
import { useState, useMemo } from "react";
import { Wrench, Pin, Sparkles, ExternalLink, AlertCircle, ChevronDown } from "lucide-react";
import { useCollection } from "@/hooks/useCollection";
import { useSite } from "@/components/SiteContext";
import { normTool } from "@/lib/siteData";
import { useResponsiveLimit } from "@/hooks/useResponsiveLimit";
import BuyModal from "@/components/BuyModal";
import { useSettings } from "@/hooks/useSettings";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80";
const FALLBACK_IMG2 =
  "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=800&q=80";

export default function ToolsSection() {
  const { data, loading } = useCollection("tools", (t) => t.active !== false);
  const { setExternalLinkNotice } = useSite();
  // All tools shown — no filter needed (all free)
  const [expanded, setExpanded] = useState(false);
  const [buyItem, setBuyItem] = useState(null);
  const { settings } = useSettings();

  const tools = useMemo(() => {
    const arr = data.map(normTool);
    arr.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
    return arr;
  }, [data]);
  const filteredTools = tools;
  const limit = useResponsiveLimit();
  const visibleTools = expanded ? filteredTools : filteredTools.slice(0, limit);

  const handleBuy = (tool) => {
    const template = settings?.payment?.bkashMerchantLink || "";
    if (template) {
      const numericPrice = String(tool.price || "").replace(/[^0-9]/g, "");
      const link = template.replace("{amount}", numericPrice).replace("{price}", numericPrice);
      window.open(link, "_blank", "noopener");
    }
    setBuyItem(tool);
  };

  const handleUseTool = (tool) => {
    if (!tool.url) return;
    setExternalLinkNotice({
      open: true,
      url: tool.url,
      title: tool.title,
      type: "ফ্রি টুল ভিজিট",
    });
  };



  return (
    <section id="tools" className="py-10 md:py-14 bg-slate-900/40 relative border-t border-slate-800/80">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-3">
            <Wrench className="w-3.5 h-3.5" />
            <span>প্রয়োজনীয় রিসোর্স</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            স্মার্ট{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">
              ডিজিটাল টুলস
            </span>
          </h2>
          <p className="mt-3 text-slate-400 text-base sm:text-lg">
            আপনার অনলাইন কাজ ও ব্যবসার গতি বহুগুণ বাড়িয়ে দেওয়ার জন্য প্রয়োজনীয়
            সকল প্রস্তুতকৃত টুলস।
          </p>

          {/* Filter tabs removed — all tools are free */}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-2xl bg-slate-900/60 border border-slate-800 h-80 animate-pulse" />
            ))}
          </div>
        ) : filteredTools.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 max-w-md mx-auto">
            <AlertCircle className="w-10 h-10 text-cyan-400 mx-auto mb-3 opacity-80" />
            <h3 className="text-lg font-semibold text-slate-200">শীঘ্রই নতুন টুল যুক্ত করা হবে</h3>
            <p className="text-sm text-slate-400 mt-1">
              এই ক্যাটাগরিতে বর্তমানে কোনো টুলস নেই। অ্যাডমিন প্যানেল থেকে খুব শীঘ্রই
              নতুন টুলস আসবে।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleTools.map((tool) => (
              <div
                key={tool.id}
                className={`group relative card card-hover flex flex-col justify-between ${
                  tool.pinned
                    ? "border-cyan-500/40 shadow-lg shadow-cyan-500/5"
                    : ""
                }`}
              >
                <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                  <img
                    src={tool.imageUrl || FALLBACK_IMG}
                    alt={tool.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMG2;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1 pointer-events-none">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {tool.pinned && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-400 text-slate-950 font-bold text-xs shadow-md">
                          <Pin className="w-3 h-3 fill-slate-950" />
                          <span>পিন্ড</span>
                        </span>
                      )}
                      {tool.featured && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-bold text-xs shadow-md">
                          <Sparkles className="w-3 h-3" />
                          <span>সেরা</span>
                        </span>
                      )}
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold shadow-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      FREE
                    </span>
                  </div>

                  {tool.category && (
                    <div className="absolute bottom-2.5 left-3">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-900/90 text-slate-300 border border-slate-700/60">
                        {tool.category}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                      {tool.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-medium text-emerald-400">
                        ফ্রি ব্যবহারযোগ্য
                      </span>
                    </div>

                    <button
                      onClick={() => handleUseTool(tool)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer shadow-sm group/btn"
                    >
                      <span>ব্যবহার করুন</span>
                      <ExternalLink className="w-3.5 h-3.5 transform group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                    {tool.buyable && tool.price && (
                      <button
                        onClick={() => handleBuy(tool)}
                        className="shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer shadow-sm"
                      >
                        <span>🛒 কিনুন</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredTools.length > limit && (
          <div className="text-center mt-10">
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors border border-slate-700"
            >
              <span>{expanded ? "কম দেখুন" : `আরও দেখুন (${filteredTools.length - limit})`}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
            </button>
          </div>
        )}
      </div>

      <BuyModal
        item={buyItem}
        itemType="tool"
        onClose={() => setBuyItem(null)}
        linkOpened={!!(buyItem && (settings?.payment?.bkashMerchantLink || ""))}
      />
    </section>
  );
}
