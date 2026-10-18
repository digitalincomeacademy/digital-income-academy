"use client";
import Link from "next/link";
import { Clapperboard, Type, Mic, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import ApiKeyManager from "@/components/ai-tools/ApiKeyManager";
import { useSettings } from "@/hooks/useSettings";
import { useState } from "react";
import { BookOpen, ChevronDown } from "lucide-react";

const TOOLS = [
  {
    href: "/ai-tools/script-generator",
    icon: Clapperboard,
    title: "ভিডিও স্ক্রিপ্ট + হুক জেনারেটর",
    desc: "যেকোনো টপিকে বাংলায় প্রফেশনাল ভিডিও স্ক্রিপ্ট — প্রথম ৩ সেকেন্ডের শক্তিশালী হুক, সেকশন-ভাগ করা স্ক্রিপ্ট ও CTA সহ।",
    points: ["শক্তিশালী হুক", "সৎ মার্কেটিং গার্ডরেল", "শর্ট ও লং ফরম্যাট"],
  },
  {
    href: "/ai-tools/caption-generator",
    icon: Type,
    title: "টাইটেল / ট্যাগ / ক্যাপশন জেনারেটর",
    desc: "TikTok, YouTube, Instagram, Facebook — প্রতিটা প্ল্যাটফর্মের জন্য টাইটেল, ট্যাগ ও ভাইরাল-স্টাইল ক্যাপশন।",
    points: ["প্ল্যাটফর্ম-ভিত্তিক", "হ্যাশট্যাগ সেট", "কপি-পেস্ট রেডি"],
  },
  {
    href: "/ai-tools/voice-guide",
    icon: Mic,
    title: "ফ্রি ভয়েস ক্লোনিং গাইড",
    desc: "VoiceStudio দিয়ে নিজের ভয়েস ক্লোন করে সম্পূর্ণ ফ্রিতে, আনলিমিটেড ভয়েসওভার বানানোর ধাপে ধাপে বাংলা গাইড।",
    points: ["সম্পূর্ণ ফ্রি", "নিজের PC-তে", "বাংলা গাইড"],
  },
];

export default function AiToolsHub() {
  const { settings } = useSettings();
  const [showGuide, setShowGuide] = useState(false);
  const enabled = settings?.sectionVisibility?.aitools !== false;

  if (!enabled) {
    return (
      <div className="pt-28 md:pt-32 pb-16 md:pb-24">
        <div className="mx-auto max-w-[720px] px-4">
          <div className="glass rounded-3xl p-10 text-center">
            <Sparkles size={36} className="mx-auto text-slate-500" />
            <h1 className="mt-3 text-xl font-bold text-white">AI টুলস বর্তমানে বন্ধ আছে</h1>
            <p className="mt-2 text-sm text-slate-400">শীঘ্রই আবার চালু হবে — আপডেটের জন্য চোখ রাখুন।</p>
            <Link href="/" className="mt-6 inline-block px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold transition">
              হোমে ফিরুন
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 md:pt-32 pb-16 md:pb-24">
      <div className="mx-auto max-w-[1200px] px-4">
        <SectionHeading
          title="ফ্রি AI টুলস"
          sub="আপনার নিজের ফ্রি API কী দিয়ে চালান — কী শুধু আপনার ব্রাউজারে থাকে, একাডেমি দেখে না।"
        />

        <Reveal className="max-w-[720px] mx-auto mb-8">
          <ApiKeyManager />
        </Reveal>

        <Reveal className="max-w-[720px] mx-auto mb-8">
          <div className="glass rounded-2xl border border-emerald-500/20 overflow-hidden">
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
            >
              <span className="flex items-center gap-2.5 font-bold text-white">
                <span className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
                  <BookOpen size={18} />
                </span>
                কীভাবে ব্যবহার করবেন — গাইডলাইন
              </span>
              <ChevronDown size={18} className={`text-slate-400 transition-transform ${showGuide ? "rotate-180" : ""}`} />
            </button>
            {showGuide && (
              <div className="px-5 pb-5 pt-1 space-y-4">
                {[
                  {
                    t: "ধাপ ১: ফ্রি API কী নিন",
                    d: "উপরের 'ফ্রি কী নিন' লিংকে ক্লিক করে Google AI Studio (বা Groq/Mistral) থেকে ফ্রি কী নিন — কোনো কার্ড লাগে না, ২ মিনিটের কাজ।",
                  },
                  {
                    t: "ধাপ ২: কী বসান",
                    d: "কী টা কপি করে উপরের বক্সে পেস্ট করুন — স্বয়ংক্রিয়ভাবে সেভ হয়ে যাবে। কী শুধু আপনার ব্রাউজারে থাকে, একাডেমি দেখে না।",
                  },
                  {
                    t: "ধাপ ৩: টুল ব্যবহার করুন",
                    d: "নিচের যেকোনো টুল খুলে টপিক লিখে 'বানান' চাপুন — উত্তর এলে 'কপি করুন' দিয়ে নিয়ে নিন।",
                  },
                  {
                    t: "ফোন ও PC নোট",
                    d: "কী প্রতিটা ডিভাইসের ব্রাউজারে আলাদা থাকে — ফোনে একবার, PC-তে একবার বসালেই হবে। ফ্রি কী-এর দৈনিক লিমিট আছে; লিমিট শেষ হলে অপেক্ষা করুন বা অন্য প্রোভাইডার বেছে নিন।",
                  },
                ].map((s, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="shrink-0 w-7 h-7 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">{s.t}</p>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{s.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TOOLS.map((t, i) => (
            <Reveal key={t.href} delay={i * 0.07}>
              <Link
                href={t.href}
                className="glass rounded-2xl p-6 group hover:border-emerald-400/60 transition block h-full"
              >
                <span className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
                  <t.icon size={22} />
                </span>
                <h3 className="mt-4 font-bold text-white text-lg group-hover:text-emerald-300 transition">{t.title}</h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">{t.desc}</p>
                <ul className="mt-3 space-y-1">
                  {t.points.map((pt) => (
                    <li key={pt} className="text-xs text-slate-500 flex items-center gap-1.5">
                      <ShieldCheck size={12} className="text-emerald-500" /> {pt}
                    </li>
                  ))}
                </ul>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-300 group-hover:gap-2.5 transition-all">
                  খুলুন <ArrowRight size={16} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-slate-500 max-w-[720px] mx-auto leading-relaxed">
          নোট: ফ্রি API-গুলোর দৈনিক/মাসিক লিমিট থাকে — লিমিট শেষ হলে কিছুক্ষণ অপেক্ষা করুন বা
          অন্য প্রোভাইডার বেছে নিন। একাডেমি কোনো আয়ের গ্যারান্টি দেয় না; টুলের আউটপুট
          যাচাই করে ব্যবহার করুন।
        </p>
      </div>
    </div>
  );
}
