"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import { Play, Clapperboard } from "lucide-react";
import { useCollection } from "@/hooks/useCollection";
import { normVideo } from "@/lib/siteData";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";

export default function VideosPage() {
  const { data, loading } = useCollection("videos", (v) => v.active !== false);
  const [cat, setCat] = useState("সব");
  const cats = useMemo(() => ["সব", ...new Set(data.map((v) => v.category).filter(Boolean))], [data]);
  const list = useMemo(
    () => data.filter((v) => cat === "সব" || v.category === cat).map(normVideo),
    [data, cat]
  );

  return (
    <div className="pt-28 md:pt-32 pb-16 md:pb-24">
      <div className="mx-auto max-w-[1200px] px-4">
        <SectionHeading title="শিক্ষামূলক ভিডিও" sub="বাংলায় হাতে-কলমে শেখার ভিডিও লাইব্রেরি।" />
        <Reveal className="flex flex-wrap gap-2 mb-8">
          {cats.map((c) => (
            <button
              key={c} onClick={() => setCat(c)}
              className={`rounded-full px-4 py-2 text-sm transition ${cat === c ? "bg-brand-400 text-navy-950 font-semibold" : "glass text-slate-300 hover:border-brand-400"}`}
            >
              {c}
            </button>
          ))}
        </Reveal>
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="skeleton h-56" />)}
          </div>
        ) : list.length === 0 ? (
          <div className="glass rounded-3xl p-10 text-center">
            <Clapperboard size={36} className="mx-auto text-slate-500" />
            <p className="mt-3 text-slate-300">
              {data.length === 0 ? "এখনো কোনো ভিডিও যোগ করা হয়নি। শিগগিরই আসছে।" : "এই ক্যাটাগরিতে কোনো ভিডিও নেই।"}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {list.map((v) => (
              <a
                key={v.id} href={v.videoUrl} target="_blank" rel="noopener noreferrer"
                className="glass rounded-2xl overflow-hidden group hover:border-brand-400 transition block"
              >
                <div className="relative aspect-video bg-navy-800">
                  {v.thumbnailUrl && (
                    <Image src={v.thumbnailUrl} alt={v.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />
                  )}
                  <div className="absolute inset-0 bg-navy-950/30 group-hover:bg-navy-950/10 transition flex items-center justify-center">
                    <span className="rounded-full bg-brand-400 text-navy-950 p-4 group-hover:scale-110 transition">
                      <Play size={22} className="ml-0.5" fill="currentColor" />
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold line-clamp-2 group-hover:text-brand-400 transition">{v.title}</h3>
                  <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                    {v.category && <span className="text-gold-400">{v.category}</span>}
                    {v.date && <span>{v.date}</span>}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
