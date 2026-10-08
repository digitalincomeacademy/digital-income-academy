"use client";
import {
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  HeartHandshake,
} from "lucide-react";
import { useSettings } from "@/hooks/useSettings";

const DEFAULT_POINTS = [
  "প্র্যাক্টিক্যাল ও বাস্তবভিত্তিক অনলাইন ইনকাম স্কিল",
  "আধুনিক ওয়েবসাইট ও ডিজিটাল ল্যান্ডিং পেজ তৈরি",
  "ডিজিটাল মার্কেটিং ও কনটেন্ট স্ট্র্যাটেজি",
  "ভিডিও মার্কেটিং ও এআই টুলস কার্যকারিতা",
  "লাইভ সাপোর্ট ও একতাবদ্ধ কমিউনিটি",
  "সৎ ও স্থায়ী অনলাইন আয়ের সঠিক পথনির্দেশনা",
];

export default function AboutSection() {
  const { settings } = useSettings();

  if (settings && settings.aboutEnabled === false) return null;

  const points =
    settings?.aboutPoints && settings.aboutPoints.length > 0
      ? settings.aboutPoints
      : DEFAULT_POINTS;

  const aboutTitle = settings?.aboutTitle || "আমাদের সম্পর্কে ও লক্ষ্য";
  const aboutDescription =
    settings?.aboutDescription ||
    "Digital Income Academy হলো একটি বিশ্বস্ত ও আধুনিক ডিজিটাল শিক্ষা প্ল্যাটফর্ম। আমরা বিশ্বাস করি সঠিক দক্ষতা ও সৎ প্রচেষ্টার মাধ্যমে যেকোনো আগ্রহী শিক্ষার্থী ঘরে বসেই সম্মানজনক অনলাইন ক্যারিয়ার গড়ে তুলতে পারেন।";
  const slogan =
    settings?.slogan || settings?.tagline || "শিখুন, তৈরি করুন, আয় করুন — সৎভাবে";

  return (
    <section id="about" className="py-16 md:py-24 bg-slate-950 relative border-t border-slate-900 overflow-hidden">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>আমাদের মূল উদ্দেশ্য</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {aboutTitle}
            </h2>

            <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              {aboutDescription}
            </p>

            <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">একাডেমির মূল স্লোগান:</span>
                <p className="text-sm sm:text-base font-bold text-emerald-300">
                  “{slogan}”
                </p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {points.map((point, index) => (
                <div
                  key={index}
                  className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-start gap-3 hover:border-emerald-500/30 transition-colors"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-200 font-medium leading-snug">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-8 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3 pb-6 border-b border-slate-800">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                    <ShieldCheck className="w-7 h-7 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">কেন আমাদের বেছে নেবেন?</h3>
                    <p className="text-xs text-slate-400">বিশ্বাসযোগ্যতা ও বাস্তবতার মাপকাঠি</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    ["১", "কোনো অবাস্তব স্বপ্ন নয়", "আমরা আপনাকে রাতারাতি বড়লোক বানানোর মিথ্যা প্রলোভন দিই না।"],
                    ["২", "হাতে-কলমে কাজ শেখানো", "কোর্সের প্রথম দিন থেকেই রিয়েল-লাইফ প্রজেক্ট ও পোর্টফোলিও তৈরি।"],
                    ["৩", "সার্বক্ষণিক কমিউনিটি সহায়তা", "টেলিগ্রাম ও ফেসবুক গ্রুপের মাধ্যমে প্রতিটি প্রশ্নের দ্রুত সমাধান।"],
                  ].map(([num, title, desc]) => (
                    <div key={num} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 text-emerald-400 font-bold text-sm">
                        {num}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-200">{title}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>অভিজ্ঞ মেন্টর প্যানেল</span>
                  <span className="text-emerald-400 font-semibold">লাইভ সেশন অন্তর্ভুক্ত</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
