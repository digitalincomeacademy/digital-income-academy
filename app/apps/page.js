"use client";
import Image from "next/image";
import { Download, Send, Smartphone } from "lucide-react";
import { useCollection } from "@/hooks/useCollection";
import SectionHeading from "@/components/SectionHeading";

export default function AppsPage() {
  const { data, loading } = useCollection("apps", (a) => a.active !== false);

  return (
    <div className="pt-28 md:pt-32 pb-16 md:pb-24">
      <div className="mx-auto max-w-[1200px] px-4">
        <SectionHeading title="দরকারি অ্যাপস" sub="কাজের জন্য বাছাই করা দরকারি অ্যাপের তালিকা।" />
        {loading ? (
          <div className="grid sm:grid-cols-2 gap-6">
            {[0, 1, 2, 3].map((i) => <div key={i} className="skeleton h-56" />)}
          </div>
        ) : data.length === 0 ? (
          <div className="glass rounded-3xl p-10 text-center">
            <Smartphone size={36} className="mx-auto text-slate-500" />
            <p className="mt-3 text-slate-300">এখনো কোনো অ্যাপ যোগ করা হয়নি। শিগগিরই আসছে।</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {data.map((a) => (
              <article key={a.id} className="glass rounded-3xl p-6 flex gap-5">
                <div className="shrink-0">
                  {a.icon ? (
                    <Image src={a.icon} alt={a.name || "অ্যাপ"} width={72} height={72} className="rounded-2xl object-cover" />
                  ) : (
                    <div className="w-[72px] h-[72px] rounded-2xl bg-navy-800 flex items-center justify-center">
                      <Smartphone size={30} className="text-brand-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  {a.name && <h3 className="text-lg font-bold">{a.name}</h3>}
                  {a.category && <span className="inline-block mt-1 text-xs text-gold-400">{a.category}</span>}
                  {a.description && <p className="mt-2 text-sm text-slate-300 line-clamp-3">{a.description}</p>}
                  <div className="mt-4 flex flex-wrap gap-3">
                    {a.downloadUrl && (
                      <a href={a.downloadUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary !min-h-[40px] !px-5 text-sm">
                        <Download size={16} /> ডাউনলোড
                      </a>
                    )}
                    {a.telegramUrl && (
                      <a href={a.telegramUrl} target="_blank" rel="noopener noreferrer" className="btn btn-gold !min-h-[40px] !px-5 text-sm">
                        <Send size={16} /> টেলিগ্রামে যোগ দিন
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
