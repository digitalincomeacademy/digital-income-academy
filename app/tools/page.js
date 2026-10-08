"use client";
import { useMemo, useState } from "react";
import { Search, ExternalLink, Wrench } from "lucide-react";
import { useCollection } from "@/hooks/useCollection";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";

export default function ToolsPage() {
  const { data, loading } = useCollection("tools", (t) => t.active !== false);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("সব");
  const cats = useMemo(() => ["সব", ...new Set(data.map((t) => t.category).filter(Boolean))], [data]);
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return data.filter((t) =>
      (cat === "সব" || t.category === cat) &&
      (!s || [t.name, t.description, t.category].filter(Boolean).join(" ").toLowerCase().includes(s))
    );
  }, [data, q, cat]);

  return (
    <div className="pt-28 md:pt-32 pb-16 md:pb-24">
      <div className="mx-auto max-w-[1200px] px-4">
        <SectionHeading title="ফ্রি টুলস" sub="কাজের জন্য দরকারি ফ্রি অনলাইন টুলের তালিকা — নিয়মিত আপডেট হয়।" />
        <Reveal className="flex flex-col md:flex-row gap-4 md:items-center mb-6">
          <div className="relative md:max-w-xs w-full">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={q} onChange={(e) => setQ(e.target.value)} placeholder="টুল খুঁজুন…"
              className="w-full glass rounded-full pl-11 pr-4 py-3 outline-none focus:border-brand-400 placeholder:text-slate-500"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {cats.map((c) => (
              <button
                key={c} onClick={() => setCat(c)}
                className={`rounded-full px-4 py-2 text-sm transition ${cat === c ? "bg-brand-400 text-navy-950 font-semibold" : "glass text-slate-300 hover:border-brand-400"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </Reveal>
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="skeleton h-40" />)}
          </div>
        ) : list.length === 0 ? (
          <div className="glass rounded-3xl p-10 text-center">
            <Wrench size={36} className="mx-auto text-slate-500" />
            <p className="mt-3 text-slate-300">
              {data.length === 0 ? "এই বিভাগে এখনো কোনো টুল যোগ করা হয়নি।" : "কোনো টুল পাওয়া যায়নি।"}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {list.map((t) => (
              <a
                key={t.id} href={t.url} target="_blank" rel="noopener noreferrer"
                className="glass rounded-2xl p-5 group hover:border-brand-400 transition block"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold group-hover:text-brand-400 transition">{t.name}</h3>
                  <ExternalLink size={16} className="text-slate-500 group-hover:text-brand-400 shrink-0 mt-1" />
                </div>
                {t.category && <span className="inline-block mt-2 text-xs text-gold-400 glass rounded-full px-2.5 py-0.5">{t.category}</span>}
                {t.description && <p className="mt-2 text-sm text-slate-400 line-clamp-2">{t.description}</p>}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
