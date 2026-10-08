"use client";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Users,
  TrendingUp,
  BookOpen,
  Wrench,
  CheckCircle2,
  PlayCircle,
} from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { useLiveVisitors } from "@/lib/visitors";
import { useSite } from "@/components/SiteContext";

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

// সংখ্যা মসৃণভাবে বাড়ানোর অ্যানিমেশন (আসল টার্গেট মানের দিকে)
function useAnimatedNumber(target) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf;
    let start = null;
    const duration = 1200;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - (1 - p) * (1 - p);
      setVal(Math.floor(eased * target));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return val;
}

export default function Hero() {
  const { settings, loading: settingsLoading } = useSettings();
  const { liveCount, loading: liveLoading } = useLiveVisitors();
  const { liveModalOpen, setLiveModalOpen } = useSite();

  const totalVisits = settings?.stats?.totalVisits ?? 0;
  const animatedActive = useAnimatedNumber(liveLoading ? 0 : liveCount);
  const animatedTotal = useAnimatedNumber(settingsLoading ? 0 : totalVisits);
  const live = settings?.live;

  const academyName = settings?.academyName || "Digital Income Academy";
  const slogan =
    settings?.slogan || settings?.tagline || "শিখুন, তৈরি করুন, আয় করুন — সৎভাবে";
  const heroDescription =
    settings?.heroDescription ||
    "অনলাইন ইনকাম, আধুনিক ওয়েবসাইট তৈরি, ডিজিটাল মার্কেটিং ও ক্যারিয়ার উপযোগী প্রফেশনাল টুলসের বাস্তবমুখী প্রশিক্ষণ। শুরু করুন আপনার সফল ডিজিটাল যাত্রা।";

  return (
    <section className="relative overflow-hidden pt-8 pb-20 md:pt-16 md:pb-28">
      {/* Background Tech Glow & Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] md:w-[900px] md:h-[500px] bg-gradient-to-tr from-emerald-600/15 via-teal-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none glow-orb" />
      <div className="absolute top-12 left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #10b981 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Floating Top Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-medium mb-6 shadow-lg shadow-emerald-500/5 backdrop-blur-md">
          <Sparkles
            className="w-3.5 h-3.5 text-emerald-400 animate-spin"
            style={{ animationDuration: "6s" }}
          />
          <span>ডিজিটাল স্কিল ও সৎ উপার্জনের বিশ্বস্ত একাডেমি</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.2] sm:leading-[1.18]">
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 pb-2">
            {academyName}
          </span>
          <span className="block text-xl sm:text-2xl md:text-3xl lg:text-4xl text-slate-300 font-semibold mt-2">
            {slogan}
          </span>
        </h1>

        {/* Dynamic Supporting Description */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-400 max-w-3xl mx-auto font-normal leading-relaxed">
          {heroDescription}
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={() => scrollTo("courses")}
            className="group relative inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:from-emerald-400 hover:to-teal-400 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-slate-950" />
            <span>কোর্স দেখুন</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => scrollTo("tools")}
            className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-200 font-semibold text-sm sm:text-base hover:bg-slate-800 hover:border-emerald-500/50 hover:text-white transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm cursor-pointer"
          >
            <Wrench className="w-4 h-4 text-emerald-400" />
            <span>ফ্রি টুলস দেখুন</span>
          </button>

          <button
            onClick={() => scrollTo("about")}
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-transparent border border-slate-800 text-slate-400 font-medium text-sm sm:text-base hover:text-slate-200 hover:border-slate-700 transition-colors cursor-pointer"
          >
            <span>আমাদের সম্পর্কে</span>
          </button>

          {live?.enabled && (
            <button
              onClick={() => setLiveModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-red-600/20 border border-red-500/40 text-red-300 font-semibold text-sm sm:text-base hover:bg-red-600/30 transition-all animate-pulse shadow-lg shadow-red-500/10 cursor-pointer"
            >
              <PlayCircle className="w-4 h-4 text-red-400" />
              <span>লাইভ ক্লাস চলছে (যুক্ত হোন)</span>
            </button>
          )}
        </div>

        {/* Live Counters & Stats Card — আসল ডেটা */}
        <div className="mt-14 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Active Users Counter (real-time) */}
          <div className="relative p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md shadow-xl hover:border-emerald-500/30 transition-all text-left group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-medium">বর্তমানে ব্যবহার করছেন</span>
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              {liveLoading ? (
                <span className="h-9 w-24 rounded bg-slate-700/60 animate-pulse" />
              ) : (
                <span className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono tracking-tight">
                  {animatedActive.toLocaleString("bn-BD")}
                </span>
              )}
              <span className="text-sm font-semibold text-slate-400">জন সক্রিয়</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span>রিয়েল-টাইম লাইভ ট্র্যাকিং</span>
            </div>
          </div>

          {/* Total Visits Counter (real, starts at 0) */}
          <div className="relative p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md shadow-xl hover:border-cyan-500/30 transition-all text-left group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-medium">মোট ভিজিটর</span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-2">
              {settingsLoading ? (
                <span className="h-9 w-24 rounded bg-slate-700/60 animate-pulse" />
              ) : (
                <span className="text-3xl sm:text-4xl font-extrabold text-cyan-300 font-mono tracking-tight">
                  {animatedTotal.toLocaleString("bn-BD")}
                </span>
              )}
              <span className="text-sm font-semibold text-slate-400">জন যুক্ত</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-cyan-400" />
              <span>সাইট চালুর দিন থেকে গণনা</span>
            </div>
          </div>

          {/* Core Trust Pillar */}
          <div className="relative p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md shadow-xl hover:border-teal-500/30 transition-all text-left sm:col-span-2 md:col-span-1 group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-medium">মূল আদর্শ</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-lg font-bold text-slate-200">সততা ও বাস্তব স্কিল</div>
            <div className="mt-1 text-xs text-slate-400 leading-snug">
              কোনো অবাস্তব স্বপ্ন নয়, কেবল সঠিক মেধা ও পরিশ্রমের মাধ্যমে ক্যারিয়ার।
            </div>
          </div>
        </div>

        {/* Feature Pills under Stats */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-400 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>১০০% বাস্তবমুখী হ্যান্ডস-অন স্কিল</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>সরাসরি মেন্টর ও কমিউনিটি সাপোর্ট</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>প্রয়োজনীয় ডিজিটাল টুলস ফ্রি অ্যাক্সেস</span>
          </div>
        </div>
      </div>
    </section>
  );
}
