"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Bell,
  Menu,
  X,
  GraduationCap,
} from "lucide-react";
import SocialIcons from "@/components/SocialIcons";
import AnnouncementTicker from "@/components/AnnouncementTicker";
import NoticeBanner from "@/components/NoticeBanner";
import LiveBanner from "@/components/LiveBanner";
import { useSettings } from "@/hooks/useSettings";
import { useLiveVisitors } from "@/lib/visitors";
import { useSite } from "@/components/SiteContext";
import { socialsToLinks } from "@/lib/siteData";

const NAV_LINKS = [
  { id: "courses", label: "কোর্সসমূহ" },
  { id: "tools", label: "ডিজিটাল টুলস" },
  { id: "videos", label: "ভিডিও" },
  { id: "posts", label: "সাম্প্রতিক পোস্ট" },
  { id: "about", label: "আমাদের সম্পর্কে" },
  { id: "team", label: "টিম" },
];

function goSection(id) {
  if (typeof window === "undefined") return;
  if (window.location.pathname !== "/") {
    window.location.href = `/#${id}`;
    return;
  }
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export default function Navbar() {
  const { settings, loading: settingsLoading } = useSettings();
  const { liveCount, loading: liveLoading } = useLiveVisitors();
  const {
    setSearchOpen,
    setLiveModalOpen,
    subscribeToLiveNotifications,
    hasSubscribedNotifications,
  } = useSite();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const academyName = settings?.academyName || "Digital Income Academy";
  const slogan =
    settings?.slogan || settings?.tagline || "শিখুন, তৈরি করুন, আয় করুন — সৎভাবে";
  const socialLinks = socialsToLinks(settings?.socials);
  const live = settings?.live;
  const totalVisits = settings?.stats?.totalVisits ?? 0;

  return (
    <>
      <NoticeBanner />
      <AnnouncementTicker />
      <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 transition-all">
        {/* Top Bar — আসল লাইভ সংখ্যা */}
        <div className="bg-slate-900/60 border-b border-slate-800/50 text-xs py-1.5 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                বর্তমানে ব্যবহার করছেন:
                {liveLoading ? (
                  <span className="inline-block w-8 h-3.5 ml-1 rounded bg-slate-700 animate-pulse" />
                ) : (
                  <strong className="text-emerald-300 font-bold ml-1">
                    {liveCount.toLocaleString("bn-BD")} জন
                  </strong>
                )}
              </span>
              <span className="hidden md:inline text-slate-700">|</span>
              <span className="hidden md:inline text-slate-400">
                মোট ভিজিট:{" "}
                {settingsLoading ? (
                  <span className="inline-block w-10 h-3.5 rounded bg-slate-700 animate-pulse" />
                ) : (
                  <strong className="text-slate-200">
                    {Number(totalVisits).toLocaleString("bn-BD")} জন
                  </strong>
                )}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 hidden sm:inline font-medium">
                কমিউনিটি যুক্ত হোন:
              </span>
              <SocialIcons links={socialLinks} size="sm" />
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            <Link
              href="/"
              className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
            >
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all duration-300 transform group-hover:scale-105">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-emerald-400 transform group-hover:-rotate-6 transition-transform" />
                  </div>
                </div>
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-black tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                  {academyName}
                </span>
                <span className="text-xs sm:text-[13px] text-emerald-400/90 font-medium tracking-wide">
                  {slogan}
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium text-slate-300">
              {NAV_LINKS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => goSection(l.id)}
                  className="px-3 py-2 rounded-lg hover:text-white hover:bg-slate-800/60 transition-all"
                >
                  {l.label}
                </button>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {live?.enabled ? (
                <button
                  onClick={() => setLiveModalOpen(true)}
                  className="relative inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-red-600/20 border border-red-500/50 text-red-400 font-semibold text-xs sm:text-sm hover:bg-red-600/30 transition-all transform hover:scale-105 shadow-lg shadow-red-500/20"
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-90"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                  </span>
                  <span className="animate-pulse tracking-wide">আমরা এখন LIVE</span>
                </button>
              ) : null}

              <button
                onClick={subscribeToLiveNotifications}
                title={
                  hasSubscribedNotifications
                    ? "নোটিফিকেশন সক্রিয় আছে"
                    : "লাইভ নোটিফিকেশন চালু করুন"
                }
                aria-label="Toggle live notification"
                className={`p-2.5 rounded-xl border transition-all ${
                  hasSubscribedNotifications
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-slate-900 border-slate-800 text-slate-300 hover:text-emerald-400 hover:border-slate-700"
                }`}
              >
                <Bell
                  className={`w-4 h-4 ${hasSubscribedNotifications ? "fill-emerald-400/20" : ""}`}
                />
              </button>

              <button
                onClick={() => setSearchOpen(true)}
                title="সার্চ করুন (কোর্স, টুলস, ভিডিও)"
                aria-label="Open search dialog"
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all"
              >
                <Search className="w-4 h-4" />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-950/95 border-b border-slate-800 px-4 pt-3 pb-6 space-y-4 shadow-2xl backdrop-blur-2xl modal-fade">
            <div className="flex flex-col space-y-2 text-base font-medium">
              {NAV_LINKS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    goSection(l.id);
                  }}
                  className="text-left py-2.5 px-3 rounded-lg text-slate-200 hover:bg-slate-900 hover:text-emerald-400 transition-colors"
                >
                  {l.label}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  subscribeToLiveNotifications();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm flex items-center justify-center gap-2 hover:border-emerald-500/50"
              >
                <Bell className="w-4 h-4 text-emerald-400" />
                <span>
                  {hasSubscribedNotifications
                    ? "নোটিফিকেশন সক্রিয় আছে"
                    : "লাইভ নোটিফিকেশন চালু করুন"}
                </span>
              </button>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400 font-medium">সোশ্যাল মিডিয়া:</span>
                <SocialIcons links={socialLinks} size="sm" />
              </div>
            </div>
          </div>
        )}
      </header>
      <LiveBanner />
    </>
  );
}
