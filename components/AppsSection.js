"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Smartphone, Download, ArrowRight } from "lucide-react";
import { useCollection } from "@/hooks/useCollection";
import { useSettings } from "@/hooks/useSettings";
import BuyModal from "@/components/BuyModal";
import AppDetailModal from "@/components/AppDetailModal";
import ShareButton from "@/components/ShareButton";
import { useResponsiveLimit } from "@/hooks/useResponsiveLimit";

export default function AppsSection() {
  const { data, loading } = useCollection("apps", (a) => a.active !== false);
  const { settings } = useSettings();
  const [buyItem, setBuyItem] = useState(null);
  const [detailApp, setDetailApp] = useState(null);
  const limit = useResponsiveLimit();

  const handleBuy = (app) => {
    const template = settings?.payment?.bkashMerchantLink || "";
    if (template) {
      const numericPrice = String(app.price || "").replace(/[^0-9]/g, "");
      const link = template.replace("{amount}", numericPrice).replace("{price}", numericPrice);
      window.open(link, "_blank", "noopener");
    }
    setBuyItem(app);
  };

  const sorted = [...data].sort((a, b) => ((b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)) || ((a.order ?? 999) - (b.order ?? 999)));
  const visible = sorted.slice(0, limit * 2);

  if (loading || sorted.length === 0) return null;

  return (
    <section className="py-10 md:py-14 relative">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              দরকারি{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                অ্যাপস
              </span>
            </h2>
            <p className="mt-2 text-slate-400">কাজের জন্য বাছাই করা দরকারি অ্যাপ</p><p className="mt-3 text-center text-sm text-slate-400">
              💬 যদি কোনো অ্যাপ কাজ না করে বা আপনার দরকারি কোনো অ্যাপ থাকে, আমাদের মেসেজ করুন — আমরা চেষ্টা করব।
            </p>
          </div>
          <Link
            href="/apps"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300 font-semibold"
          >
            <span>সব দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {visible.map((a) => (
            <div
              key={a.id}
              onClick={() => setDetailApp(a)}
              className="card p-4 flex flex-col items-center text-center gap-2 hover:border-emerald-500/40 cursor-pointer relative"
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

        <div className="text-center mt-6 sm:hidden">
          <Link
            href="/apps"
            className="inline-flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300 font-semibold"
          >
            <span>সব অ্যাপ দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <BuyModal
        item={buyItem}
        itemType="app"
        onClose={() => setBuyItem(null)}
        linkOpened={!!(buyItem && (settings?.payment?.bkashMerchantLink || ""))}
      />
      <AppDetailModal app={detailApp} onClose={() => setDetailApp(null)} />
    </section>
  );
}
