"use client";
import { Pin, Newspaper, Calendar, ArrowRight, AlertCircle } from "lucide-react";
import { useCollection } from "@/hooks/useCollection";
import { useSite } from "@/components/SiteContext";
import { normPost, formatBnDate } from "@/lib/siteData";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80";
const FALLBACK_IMG2 =
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80";

export default function PostsSection() {
  const { data, loading } = useCollection("posts", (p) => p.active !== false);
  const { setExternalLinkNotice } = useSite();
  const posts = data.map(normPost);

  const handleOpenPostLink = (post) => {
    if (!post.externalUrl) return;
    setExternalLinkNotice({
      open: true,
      url: post.externalUrl,
      title: post.title,
      type: "পোস্ট লিংক",
    });
  };

  return (
    <section id="posts" className="py-16 md:py-24 bg-slate-900/40 relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <Newspaper className="w-3.5 h-3.5" />
            <span>ব্লগ ও আপডেট</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            সাম্প্রতিক{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              পোস্ট ও বার্তা
            </span>
          </h2>
          <p className="mt-3 text-slate-400 text-base sm:text-lg">
            ডিজিটাল আয়ের সঠিক উপায়, নতুন প্রযুক্তি ও ফ্রিল্যান্সিং ক্যারিয়ার সম্পর্কিত
            জরুরি বার্তা।
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl bg-slate-900/60 border border-slate-800 h-96 animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 max-w-md mx-auto">
            <AlertCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3 opacity-80" />
            <h3 className="text-lg font-semibold text-slate-200">শীঘ্রই নতুন পোস্ট আসবে</h3>
            <p className="text-sm text-slate-400 mt-1">
              আমাদের মেন্টরদের নিয়মিত আপডেট পেতে অপেক্ষা করুন।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className={`group relative rounded-2xl bg-slate-950/80 border transition-all duration-300 flex flex-col justify-between overflow-hidden hover:shadow-xl hover:-translate-y-1 ${
                  post.pinned
                    ? "border-emerald-500/40 shadow-lg shadow-emerald-500/5"
                    : "border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                  <img
                    src={post.imageUrl || FALLBACK_IMG}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMG2;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {post.pinned && (
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-500 text-slate-950 font-bold text-xs shadow-md">
                        <Pin className="w-3 h-3 fill-slate-950" />
                        <span>পিন্ড পোস্ট</span>
                      </span>
                    </div>
                  )}

                  {post.createdAt && (
                    <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 text-[11px] text-slate-300 bg-slate-950/70 px-2 py-0.5 rounded backdrop-blur-sm">
                      <Calendar className="w-3 h-3 text-emerald-400" />
                      <span>{formatBnDate(post.createdAt)}</span>
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-sm text-slate-400 line-clamp-3 leading-relaxed">
                      {post.description}
                    </p>
                  </div>

                  {post.externalUrl && (
                    <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-xs text-slate-500">অফিশিয়াল কমিউনিটি</span>
                      <button
                        onClick={() => handleOpenPostLink(post)}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors group/link cursor-pointer"
                      >
                        <span>সম্পূর্ণ পড়ুন</span>
                        <ArrowRight className="w-3.5 h-3.5 transform group-hover/link:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
