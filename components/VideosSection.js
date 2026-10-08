"use client";
import { useState } from "react";
import {
  Play,
  Pin,
  Sparkles,
  ExternalLink,
  Video as VideoIcon,
  X,
  AlertCircle,
} from "lucide-react";
import { useCollection } from "@/hooks/useCollection";
import { useSite } from "@/components/SiteContext";
import { normVideo, getYouTubeEmbedId } from "@/lib/siteData";

const FALLBACK_THUMB =
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80";

function platformBadge(platform) {
  const p = (platform || "").toLowerCase();
  if (p.includes("youtube")) return "bg-red-500/20 text-red-400 border-red-500/30";
  if (p.includes("facebook")) return "bg-blue-500/20 text-blue-400 border-blue-500/30";
  if (p.includes("tiktok")) return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
  return "bg-purple-500/20 text-purple-300 border-purple-500/30";
}

export default function VideosSection() {
  const { data, loading } = useCollection("videos", (v) => v.active !== false);
  const { setExternalLinkNotice } = useSite();
  const [activeEmbedVideo, setActiveEmbedVideo] = useState(null);

  const videos = data.map(normVideo);

  const handlePlayOrOpen = (video) => {
    const ytId = getYouTubeEmbedId(video.videoUrl);
    if (ytId && video.platform === "YouTube") {
      setActiveEmbedVideo(video);
    } else {
      if (!video.videoUrl) return;
      setExternalLinkNotice({
        open: true,
        url: video.videoUrl,
        title: video.title,
        type: `${video.platform} ভিডিও টিউটোরিয়াল`,
      });
    }
  };

  return (
    <section id="videos" className="py-16 md:py-24 bg-slate-950 relative border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold mb-3">
            <VideoIcon className="w-3.5 h-3.5" />
            <span>টিউটোরিয়াল ও গাইডলাইন</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            শিক্ষামূলক{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-300">
              ভিডিও রিসোর্স
            </span>
          </h2>
          <p className="mt-3 text-slate-400 text-base sm:text-lg">
            সরাসরি বাস্তব কাজের কৌশল, টিপস ও অনুপ্রেরণামূলক সেশন দেখুন আমাদের
            অফিসিয়াল ভিডিও থেকে।
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl bg-slate-900/60 border border-slate-800 h-80 animate-pulse" />
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 max-w-md mx-auto">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3 opacity-80" />
            <h3 className="text-lg font-semibold text-slate-200">শীঘ্রই নতুন ভিডিও প্রকাশ হবে</h3>
            <p className="text-sm text-slate-400 mt-1">
              ইউটিউব এবং ফেসবুকের নতুন ভিডিও দ্রুত আপডেট করা হবে।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {videos.map((video) => {
              const ytId = getYouTubeEmbedId(video.videoUrl);
              const thumb =
                video.thumbnailUrl ||
                (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : FALLBACK_THUMB);

              return (
                <div
                  key={video.id}
                  className={`group relative rounded-2xl bg-slate-900/80 border transition-all duration-300 flex flex-col justify-between overflow-hidden hover:shadow-2xl hover:-translate-y-1 ${
                    video.pinned
                      ? "border-red-500/40 shadow-lg shadow-red-500/5"
                      : "border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div
                    onClick={() => handlePlayOrOpen(video)}
                    className="relative aspect-video w-full overflow-hidden bg-slate-950 cursor-pointer"
                  >
                    <img
                      src={thumb}
                      alt={video.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_THUMB;
                      }}
                    />
                    <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors" />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-red-600/90 group-hover:bg-red-500 text-white flex items-center justify-center shadow-xl shadow-red-600/40 transform group-hover:scale-110 transition-all duration-300">
                        <Play className="w-6 h-6 fill-white ml-0.5" />
                      </div>
                    </div>

                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                      <div className="flex items-center gap-1.5">
                        {video.pinned && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-red-500 text-white font-bold text-xs shadow-md">
                            <Pin className="w-3 h-3 fill-white" />
                            <span>পিন্ড</span>
                          </span>
                        )}
                        {video.featured && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-bold text-xs shadow-md">
                            <Sparkles className="w-3 h-3" />
                            <span>হাইলাইট</span>
                          </span>
                        )}
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${platformBadge(video.platform)}`}>
                        {video.platform}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3
                        onClick={() => handlePlayOrOpen(video)}
                        className="text-lg font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2 cursor-pointer"
                      >
                        {video.title}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed">
                        {video.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        প্ল্যাটফর্ম: <strong className="text-slate-300">{video.platform}</strong>
                      </span>

                      <button
                        onClick={() => handlePlayOrOpen(video)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-red-600 hover:text-white text-slate-300 text-xs font-semibold transition-all cursor-pointer"
                      >
                        <span>{ytId && video.platform === "YouTube" ? "ভিডিও চালান" : "ভিডিও দেখুন"}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeEmbedVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md modal-fade">
            <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b border-slate-800">
                <h3 className="text-sm sm:text-base font-bold text-white truncate pr-4">
                  {activeEmbedVideo.title}
                </h3>
                <button
                  onClick={() => setActiveEmbedVideo(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                  aria-label="বন্ধ করুন"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative aspect-video w-full bg-black">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${getYouTubeEmbedId(activeEmbedVideo.videoUrl)}?autoplay=1&rel=0`}
                  title={activeEmbedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="p-4 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
                <span className="truncate">{activeEmbedVideo.description}</span>
                <a
                  href={activeEmbedVideo.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-red-400 hover:underline flex-shrink-0 ml-4 font-semibold"
                >
                  <span>ইউটিউবে খুলুন</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
