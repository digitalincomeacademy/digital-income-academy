"use client";
import { useSettings } from "@/hooks/useSettings";
import { Briefcase, ArrowUpRight } from "lucide-react";

// Founder portfolio banner — links to https://mdrifatsarker.com/
// Visibility: admin /ceo-rifat-panel/settings → সেকশন দৃশ্যমানতা → পোর্টফোলিও
// Lightweight: no images, pure CSS.

const PORTFOLIO_URL = "https://mdrifatsarker.com/";

export default function PortfolioSection() {
  const { settings } = useSettings();
  const url = String(settings?.portfolioUrl || PORTFOLIO_URL).trim() || PORTFOLIO_URL;

  return (
    <section id="portfolio" className="py-10 md:py-14 relative border-t border-slate-800/80 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10 pointer-events-none" />
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 relative">
        <div className="rounded-2xl border border-emerald-500/20 bg-slate-900/60 p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <Briefcase className="w-7 h-7 text-slate-950" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              ফাউন্ডারের{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">
                পোর্টফোলিও
              </span>
            </h2>
            <p className="mt-2 text-slate-300/90 text-sm sm:text-base leading-relaxed">
              MD RIFAT SARKER — Digital Creator, Graphic Designer, Video Editor ও AI Developer.
              তার কাজ, সার্ভিস ও অভিজ্ঞতা দেখুন অফিসিয়াল পোর্টফোলিওতে।
            </p>
          </div>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-emerald-500/25 transition-transform hover:scale-105 active:scale-95"
          >
            পোর্টফোলিও দেখুন
            <ArrowUpRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
