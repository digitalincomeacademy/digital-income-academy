"use client";
import { Radio, Play, ExternalLink, X, Clock, Bell } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { useSite } from "@/components/SiteContext";
import { stripEmojis } from "@/lib/siteData";

export default function LiveBanner() {
  const { settings } = useSettings();
  const {
    liveModalOpen,
    setLiveModalOpen,
    setExternalLinkNotice,
    subscribeToLiveNotifications,
    hasSubscribedNotifications,
  } = useSite();

  const live = settings?.live;
  if (!live || !live.enabled) return null;

  const handleJoinLive = () => {
    setLiveModalOpen(false);
    if (!live.url) return;
    setExternalLinkNotice({
      open: true,
      url: live.url,
      title: live.title || "লাইভ ক্লাস",
      type: `${live.platform || "লাইভ"} লাইভ ক্লাস সেশন`,
    });
  };

  return (
    <>
      <div className="bg-gradient-to-r from-red-950/90 via-red-900/80 to-slate-950 border-b border-red-500/40 py-2.5 px-4 shadow-xl shadow-red-950/40 relative z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-90"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
              <span className="inline-flex items-center gap-1 bg-red-600 text-white font-extrabold text-xs px-2.5 py-0.5 rounded uppercase tracking-wider shadow-sm animate-pulse">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-90"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                LIVE
              </span>
              <strong className="text-white text-sm font-semibold truncate max-w-md">
                {stripEmojis(live.title)}
              </strong>
              {live.startTime && (
                <span className="text-xs text-red-200/80 hidden md:inline">
                  • সময়: {live.startTime}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLiveModalOpen(true)}
              className="px-3 py-1 rounded-lg bg-red-800/60 hover:bg-red-700/80 text-red-100 text-xs font-medium border border-red-500/30 transition-colors cursor-pointer"
            >
              বিস্তারিত
            </button>
            <button
              onClick={handleJoinLive}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-600/30 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Join Live ({live.platform || "লাইভ"})</span>
            </button>
          </div>
        </div>
      </div>

      {liveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md modal-fade">
          <div className="relative w-full max-w-lg bg-slate-900 border border-red-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-red-950/50">
            <button
              onClick={() => setLiveModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider mb-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-90"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              <span>আমরা এখন সরাসরি লাইভে আছি</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
              {stripEmojis(live.title)}
            </h3>

            {live.description && (
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                {stripEmojis(live.description)}
              </p>
            )}

            {live.thumbnailUrl && (
              <div className="mt-4 rounded-xl overflow-hidden aspect-video border border-slate-800">
                <img
                  src={live.thumbnailUrl}
                  alt="Live Session Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="mt-5 p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-red-400" />
                <span>
                  প্ল্যাটফর্ম: <strong className="text-white">{live.platform || "—"}</strong>
                </span>
              </div>
              {live.startTime && (
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{live.startTime}</span>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleJoinLive}
                className="w-full flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-600/30 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>সরাসরি জয়েন করুন</span>
                <ExternalLink className="w-4 h-4" />
              </button>

              <button
                onClick={subscribeToLiveNotifications}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  hasSubscribedNotifications
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                    : "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600"
                }`}
              >
                <Bell className="w-4 h-4 text-amber-400" />
                <span>
                  {hasSubscribedNotifications ? "নোটিফিকেশন অন আছে" : "অ্যালার্ট পান"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
