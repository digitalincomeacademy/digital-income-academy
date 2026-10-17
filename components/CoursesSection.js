"use client";
import { useState, useMemo } from "react";
import { Pin, Sparkles, ExternalLink, BookOpen, AlertCircle, Info, ChevronDown } from "lucide-react";
import { useCollection } from "@/hooks/useCollection";
import { useSite } from "@/components/SiteContext";
import { normCourse } from "@/lib/siteData";
import CourseDetailModal from "@/components/CourseDetailModal";
import BuyModal from "@/components/BuyModal";
import { useSettings } from "@/hooks/useSettings";
import { useResponsiveLimit } from "@/hooks/useResponsiveLimit";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80";
const FALLBACK_IMG2 =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80";

export default function CoursesSection() {
  const { data, loading } = useCollection("courses", (c) => c.active !== false);
  const { setExternalLinkNotice } = useSite();
  const courses = useMemo(() => {
    const arr = data.map(normCourse);
    arr.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
    return arr;
  }, [data]);
  const [selected, setSelected] = useState(null);
  const [buyItem, setBuyItem] = useState(null);
  const { settings } = useSettings();
  const [expanded, setExpanded] = useState(false);
  const limit = useResponsiveLimit();
  const visible = expanded ? courses : courses.slice(0, limit);

  const handleBuy = (course) => {
    const template = settings?.payment?.bkashMerchantLink || "";
    if (template) {
      const numericPrice = String(course.price || "").replace(/[^0-9]/g, "");
      const link = template.replace("{amount}", numericPrice).replace("{price}", numericPrice);
      window.open(link, "_blank", "noopener");
    }
    setBuyItem(course);
  };

  const handleJoinCourse = (course) => {
    if (course.internal) {
      window.location.href = course.joinUrl;
      return;
    }
    if (!course.joinUrl) return;
    setExternalLinkNotice({
      open: true,
      url: course.joinUrl,
      title: course.title,
      type: course.isFree ? "ফ্রি কোর্স রেজিস্ট্রেশন" : "কোর্স এনরোলমেন্ট",
    });
  };

  return (
    <section id="courses" className="py-10 md:py-14 bg-slate-950 relative border-t border-slate-900">
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>প্রফেশনাল লার্নিং</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            আমাদের জনপ্রিয়{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              কোর্সসমূহ
            </span>
          </h2>
          <p className="mt-3 text-slate-400 text-base sm:text-lg">
            দক্ষতা অর্জন করুন বাস্তব প্রজেক্টের মাধ্যমে এবং আন্তর্জাতিক মানের অনলাইন
            ক্যারিয়ার শুরু করুন।
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl bg-slate-900/60 border border-slate-800 h-96 animate-pulse" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 max-w-md mx-auto">
            <AlertCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3 opacity-80" />
            <h3 className="text-lg font-semibold text-slate-200">শীঘ্রই নতুন কোর্স আসছে</h3>
            <p className="text-sm text-slate-400 mt-1">
              আমাদের টিম নতুন শিক্ষামূলক কোর্স তৈরির কাজ করছে। দ্রুত যুক্ত হতে চোখ রাখুন।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {visible.map((course) => (
              <div
                key={course.id}
                className={`group relative card card-hover flex flex-col ${
                  course.pinned
                    ? "border-emerald-500/40 shadow-lg shadow-emerald-500/5"
                    : "border-slate-800 hover:border-slate-700"
                }`}
              >
                <div
                  className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950 cursor-pointer"
                  onClick={() => setSelected(course)}
                >
                  <img
                    src={course.imageUrl || FALLBACK_IMG}
                    alt={course.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMG2;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {course.pinned && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500 text-slate-950 font-bold text-xs shadow-md">
                          <Pin className="w-3 h-3 fill-slate-950" />
                          <span>পিন্ড</span>
                        </span>
                      )}
                      {course.featured && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/90 text-slate-950 font-bold text-xs shadow-md">
                          <Sparkles className="w-3 h-3" />
                          <span>স্পেশাল</span>
                        </span>
                      )}
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-md ${
                        course.isFree
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-md"
                          : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 backdrop-blur-md"
                      }`}
                    >
                      {course.isFree ? "FREE" : `${course.price} ${course.currency}`}
                    </span>
                  </div>

                  {!course.isFree && course.oldPrice > course.price && (
                    <div className="absolute bottom-3 right-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-red-500 text-white shadow-lg">
                        {Math.round(((course.oldPrice - course.price) / course.oldPrice) * 100)}% ছাড়
                      </span>
                    </div>
                  )}

                  {course.category && (
                    <div className="absolute bottom-3 left-3">
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-900/80 text-slate-300 border border-slate-700/60 backdrop-blur-sm">
                        {course.category}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2 cursor-pointer"
                      onClick={() => setSelected(course)}
                    >
                      {course.title}
                    </h3>
                    <p className="mt-2.5 text-sm text-slate-400 line-clamp-3 leading-relaxed">
                      {course.description}
                    </p>
                    <button
                      onClick={() => setSelected(course)}
                      className="mt-2 inline-flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300 font-medium"
                    >
                      <Info className="w-4 h-4" />
                      বিস্তারিত দেখুন
                    </button>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500">মূল্য</span>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-lg font-bold text-slate-100">
                          {course.isFree ? (
                            <span className="text-emerald-400">সম্পূর্ণ ফ্রি</span>
                          ) : (
                            `${course.price} ${course.currency}`
                          )}
                        </span>
                        {!course.isFree && course.oldPrice > course.price && (
                          <>
                            <span className="text-sm line-through text-slate-500">
                              {course.oldPrice} {course.currency}
                            </span>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/30">
                              {Math.round(((course.oldPrice - course.price) / course.oldPrice) * 100)}% ছাড়
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleJoinCourse(course)}
                      className={`shrink-0 whitespace-nowrap inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md cursor-pointer ${
                        course.isFree
                          ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-500/20"
                          : "bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-cyan-500/20"
                      }`}
                    >
                      <span>{course.isFree ? "Join Free" : "Join Course"}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </button>
                    {course.buyable && !course.isFree && (
                      <button
                        onClick={() => handleBuy(course)}
                        className="shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md shadow-amber-500/20 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                      >
                        <span>🛒 কিনুন</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {courses.length > limit && (
          <div className="text-center mt-10">
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors border border-slate-700"
            >
              <span>{expanded ? "কম দেখুন" : `আরও দেখুন (${courses.length - limit})`}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
            </button>
          </div>
        )}
      </div>

      <CourseDetailModal
        course={selected}
        onClose={() => setSelected(null)}
        onJoin={(c) => { setSelected(null); handleJoinCourse(c); }}
      />
      <BuyModal
        item={buyItem}
        itemType="course"
        onClose={() => setBuyItem(null)}
        linkOpened={!!(buyItem && (settings?.payment?.bkashMerchantLink || ""))}
      />
    </section>
  );
}
