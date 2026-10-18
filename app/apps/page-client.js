"use client";
import { useState } from "react";
import Image from "next/image";
import { Download, Send, Smartphone } from "lucide-react";
import { useCollection } from "@/hooks/useCollection";
import SectionHeading from "@/components/SectionHeading";
import BuyModal from "@/components/BuyModal";
import AppDetailModal from "@/components/AppDetailModal";
import ShareButton from "@/components/ShareButton";
import { useSettings } from "@/hooks/useSettings";

export default function AppsPage() {
  const { data, loading } = useCollection("apps", (a) => a.active !== false);
  const [buyItem, setBuyItem] = useState(null);
  const [detailApp, setDetailApp] = useState(null);
  const { settings } = useSettings();

  const handleBuy = (app) => {
    const template = settings?.payment?.bkashMerchantLink || "";
    if (template) {
      const numericPrice = String(app.price || "").replace(/[^0-9]/g, "");
      const link = template.replace("{amount}", numericPrice).replace("{price}", numericPrice);
      window.open(link, "_blank", "noopener");
    }
    setBuyItem(app);
  };

  const sorted = [...data].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  return (
    <div className="pt-28 md:pt-32 pb-16 md:pb-24">
      <div className="mx-auto max-w-[1200px] px-4">
        <SectionHeading title="দরকারি অ্যাপস" sub="কাজের জন্য বাছাই করা দরকারি অ্যাপের তালিকা।" />
        <p className="text-center text-sm text-slate-400 -mt-4 mb-8">
          💬 যদি কোনো অ্যাপ কাজ না করে বা আপনার দরকারি কোনো অ্যাপ থাকে, আমাদের মেসেজ করুন — আমরা চেষ্টা করব।
        </p>
        {loading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="skeleton h-44 rounded-2xl" />)}
          </div>
        ) : sorted.length === 0 ? (
          <div className="glass rounded-3xl p-10 text-center">
            <Smartphone size={36} className="mx-auto text-slate-500" />
            <p className="mt-3 text-slate-300">এখনো কোনো অ্যাপ যোগ করা হয়নি। শিগগিরই আসছে।</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {sorted.map((a) => (
              <div
                key={a.id}
                onClick={() => setDetailApp(a)}
                className="glass rounded-2xl p-4 flex flex-col items-center text-center gap-2 hover:border-emerald-500/40 transition-colors cursor-pointer relative"
              >
                <div className="absolute top-2 right-2" onClick={(e) => e.stopPropagation()}>
                  <ShareButton
                    title={a.name || a.title}
                    url={typeof window !== "undefined" ? `${window.location.origin}/apps#${a.id}` : ""}
                  />
                </div>
                <div className="w-16 h-16 shrink-0">
                  {a.icon ? (
                    <Image src={a.icon} alt={a.name || "অ্যাপ"} width={64} height={64} className="rounded-2xl object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full rounded-2xl bg-navy-800 flex items-center justify-center">
                      <Smartphone size={26} className="text-brand-400" />
                    </div>
                  )}
                </div>
                {a.name && <h3 className="text-sm font-bold leading-tight line-clamp-2">{a.name}</h3>}
                <div className="flex flex-col gap-1.5 w-full mt-1">
                  {a.downloadUrl && (
                    <a
                      href={a.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold px-2 py-1.5 transition-colors"
                    >
                      <Download size={12} /> ডাউনলোড
                    </a>
                  )}
                  {a.telegramUrl && (
                    <a
                      href={a.telegramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-2 py-1.5 transition-colors"
                    >
                      <Send size={12} /> টেলিগ্রাম
                    </a>
                  )}
                  {a.buyable && a.price && (
                    <button
                      onClick={() => handleBuy(a)}
                      className="inline-flex items-center justify-center gap-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-2 py-1.5 transition-colors"
                    >
                      🛒 {a.price}৳
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BuyModal
        item={buyItem}
        itemType="app"
        onClose={() => setBuyItem(null)}
        linkOpened={!!(buyItem && (settings?.payment?.bkashMerchantLink || ""))}
      />
      <AppDetailModal app={detailApp} onClose={() => setDetailApp(null)} />
    </div>
  );
}
