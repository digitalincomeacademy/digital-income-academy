"use client";
import { useState } from "react";
import { Wrench, Pin, Sparkles, ExternalLink, AlertCircle } from "lucide-react";
import { useCollection } from "@/hooks/useCollection";
import { useSite } from "@/components/SiteContext";
import { normTool } from "@/lib/siteData";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80";
const FALLBACK_IMG2 =
  "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=800&q=80";

export default function ToolsSection() {
  const { data, loading } = useCollection("tools", (t) => t.active !== false);
  const { setExternalLinkNotice } = useSite();
  const [filter, setFilter] = useState("ALL");

  const tools = data.map(normTool);
  const filteredTools = tools.filter((tool) => {
    if (filter === "ALL") return true;
    return tool.type === filter;
  });

  const handleUseTool = (tool) => {
    if (!tool.url) return;
    setExternalLinkNotice({
      open: true,
      url: tool.url,
      title: tool.title,
      type: tool.type === "FREE" ? "ফ্রি টুল ভিজিট" : "প্রো টুল এক্সেস",
    });
  };

  const tabs = [
    { key: "ALL", label: `সব (${tools.length})` },
    { key: "FREE", label: `ফ্রি (${tools.filter((t) => t.type === "FREE").length})` },
    { key: "PRO", label: `প্রো (${tools.filter((t) => t.type === "PRO").length})` },
  ];

  return (
    <section id="tools" className="py-16 md:py-24 bg-slate-900/40 relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

          <div className="mt-8 inline-flex p-1 rounded-xl bg-slate-950 border border-slate-800 shadow-inner">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  filter === tab.key
                    ? tab.key === "FREE"
                      ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shadow-md"
                      : tab.key === "PRO"
                        ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-md"
                        : "bg-slate-800 text-white shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
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
            {filteredTools.map((tool) => (
              <div
                key={tool.id}
                className={`group relative rounded-2xl bg-slate-950/80 border transition-all duration-300 flex flex-col justify-between overflow-hidden hover:shadow-xl hover:-translate-y-1 ${
                  tool.pinned
                    ? "border-cyan-500/40 shadow-lg shadow-cyan-500/5"
                    : "border-slate-800/90 hover:border-slate-700"
                }`}
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
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

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold shadow-md ${
                        tool.type === "FREE"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      }`}
                    >
                      {tool.type === "FREE" ? "FREE" : "PRO"}
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
                      {tool.type === "PRO" && tool.price ? (
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-500">প্রো ফি</span>
                          <span className="text-sm font-bold text-amber-300">
                            {tool.price} {tool.currency}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs font-medium text-emerald-400">
                          {tool.type === "FREE" ? "ফ্রি ব্যবহারযোগ্য" : "প্রো রিসোর্স"}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleUseTool(tool)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer shadow-sm group/btn"
                    >
                      <span>ব্যবহার করুন</span>
                      <ExternalLink className="w-3.5 h-3.5 transform group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
