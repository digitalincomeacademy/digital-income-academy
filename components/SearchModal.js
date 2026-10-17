"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  X,
  BookOpen,
  Wrench,
  Video,
  Newspaper,
  Users,
  ExternalLink,
} from "lucide-react";
import { useCollection } from "@/hooks/useCollection";
import { useSite } from "@/components/SiteContext";
import { normCourse, normTool, normVideo, normPost, normMember } from "@/lib/siteData";

function getIcon(type) {
  switch (type) {
    case "course":
      return <BookOpen className="w-4 h-4 text-emerald-400" />;
    case "tool":
      return <Wrench className="w-4 h-4 text-cyan-400" />;
    case "video":
      return <Video className="w-4 h-4 text-red-400" />;
    case "post":
      return <Newspaper className="w-4 h-4 text-amber-400" />;
    case "team":
      return <Users className="w-4 h-4 text-purple-400" />;
    default:
      return <Search className="w-4 h-4 text-slate-400" />;
  }
}

const TYPE_LABEL = {
  course: "কোর্স",
  tool: "টুল",
  video: "ভিডিও",
  post: "পোস্ট",
  team: "টিম",
};

const SECTION_ID = {
  course: "courses",
  tool: "tools",
  video: "videos",
  post: "posts",
  team: "team",
};

export default function SearchModal() {
  const { searchOpen, setSearchOpen, setExternalLinkNotice } = useSite();
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  const { data: courses } = useCollection("courses", (c) => c.active !== false);
  const { data: tools } = useCollection("tools", (t) => t.active !== false);
  const { data: videos } = useCollection("videos", (v) => v.active !== false);
  const { data: posts } = useCollection("posts", (p) => p.active !== false);
  const { data: team } = useCollection("team", (m) => m.active !== false);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [searchOpen ]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const out = [];
    const match = (text) => (text || "").toLowerCase().includes(q);

    courses.map(normCourse).forEach((c) => {
      if (match(c.title) || match(c.description) || match(c.category))
        out.push({
          key: `course-${c.id}`,
          type: "course",
          title: c.title,
          description: c.description,
          badge: c.isFree ? "ফ্রি" : `${c.price} ${c.currency}`,
          url: c.internal ? c.joinUrl : "",
          externalUrl: c.internal ? "" : c.joinUrl,
        });
    });
    tools.map(normTool).forEach((t) => {
      if (match(t.title) || match(t.description) || match(t.category))
        out.push({
          key: `tool-${t.id}`,
          type: "tool",
          title: t.title,
          description: t.description,
          badge: t.type === "FREE" ? "ফ্রি" : "প্রো",
          url: "",
          externalUrl: t.url,
        });
    });
    videos.map(normVideo).forEach((v) => {
      if (match(v.title) || match(v.description) || match(v.platform))
        out.push({
          key: `video-${v.id}`,
          type: "video",
          title: v.title,
          description: v.description,
          badge: v.platform,
          url: "",
          externalUrl: v.videoUrl,
        });
    });
    posts.map(normPost).forEach((p) => {
      if (match(p.title) || match(p.description))
        out.push({
          key: `post-${p.id}`,
          type: "post",
          title: p.title,
          description: p.description,
          badge: "পোস্ট",
          url: "",
          externalUrl: p.externalUrl,
        });
    });
    team.map(normMember).forEach((m) => {
      if (match(m.name) || match(m.position) || match(m.bio))
        out.push({
          key: `team-${m.id}`,
          type: "team",
          title: m.name,
          description: m.position,
          badge: "টিম",
          url: "",
          externalUrl: "",
        });
    });
    return out.slice(0, 20);
  }, [query, courses, tools, videos, posts, team]);

  if (!searchOpen) return null;

  const handleSelectResult = (item) => {
    setSearchOpen(false);
    if (item.externalUrl) {
      setExternalLinkNotice({
        open: true,
        url: item.externalUrl,
        title: item.title,
        type: item.badge || "রিসোর্স",
      });
    } else if (item.url) {
      window.location.href = item.url;
    } else {
      const el = document.getElementById(SECTION_ID[item.type] || "courses");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-20 bg-slate-950/85 backdrop-blur-md modal-fade">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center gap-3 bg-slate-950/60">
          <Search className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="কোর্স, টুলস, ভিডিও, পোস্ট বা টিম খুঁজুন..."
            className="flex-1 bg-transparent text-base sm:text-lg text-white placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-slate-400 hover:text-white"
              aria-label="মুছুন"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setSearchOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-semibold px-2"
          >
            বন্ধ করুন
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1">
          {query.trim() === "" ? (
            <div className="text-center py-12 text-slate-500">
              <p className="text-sm">অনুসন্ধানের জন্য যেকোনো শব্দ টাইপ করুন</p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                {["মার্কেটিং", "ল্যান্ডিং পেজ", "এআই টুলস", "ফ্রিল্যান্সিং", "ভিডিও"].map(
                  (tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="text-xs px-3 py-1 rounded-full bg-slate-800/80 hover:bg-emerald-500/20 hover:text-emerald-300 text-slate-400 border border-slate-700/60 transition-colors"
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p className="text-base font-semibold text-slate-300">কোনো ফলাফল পাওয়া যায়নি</p>
              <p className="text-xs text-slate-400 mt-1">
                “{query}” দিয়ে কিছু মেলেনি। বানান চেক করে আবার চেষ্টা করুন।
              </p>
            </div>
          ) : (
            results.map((item) => (
              <div
                key={item.key}
                onClick={() => handleSelectResult(item)}
                className="group p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-900 transition-all cursor-pointer flex items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex-shrink-0 group-hover:scale-105 transition-transform">
                    {getIcon(item.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {item.title}
                      </h4>
                      {item.badge && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-1">
                      {TYPE_LABEL[item.type]} • {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex-shrink-0 text-slate-500 group-hover:text-emerald-400 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
