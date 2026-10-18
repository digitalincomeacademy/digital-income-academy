"use client";
import Link from "next/link";
import { Sparkles, Clapperboard, Type, Mic, ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";

const CARDS = [
  {
    href: "/ai-tools/script-generator",
    icon: Clapperboard,
    title: "ভিডিও স্ক্রিপ্ট + হুক জেনারেটর",
    desc: "বাংলায় ভিডিও স্ক্রিপ্ট — প্রথম ৩ সেকেন্ডের শক্তিশালী হুকসহ।",
    grad: "from-cyan-500/20 to-teal-500/10 border-cyan-500/25",
    iconBg: "bg-cyan-500/15 border-cyan-500/30 text-cyan-300",
  },
  {
    href: "/ai-tools/caption-generator",
    icon: Type,
    title: "টাইটেল / ট্যাগ / ক্যাপশন জেনারেটর",
    desc: "প্রতিটা প্ল্যাটফর্মের জন্য টাইটেল, ট্যাগ ও ক্যাপশন এক ক্লিকে।",
    grad: "from-violet-500/20 to-purple-500/10 border-violet-500/25",
    iconBg: "bg-violet-500/15 border-violet-500/30 text-violet-300",
  },
  {
    href: "/ai-tools/voice-guide",
    icon: Mic,
    title: "ফ্রি ভয়েস ক্লোনিং গাইড",
    desc: "নিজের ভয়েস ক্লোন করে সম্পূর্ণ ফ্রিতে ভয়েসওভার বানান।",
    grad: "from-amber-500/20 to-orange-500/10 border-amber-500/25",
    iconBg: "bg-amber-500/15 border-amber-500/30 text-amber-300",
  },
];

export default function AiToolsSection() {
  return (
    <section id="aitools" className="py-10 md:py-14 relative border-t border-slate-800/80">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>নতুন — AI টুলস</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            ফ্রি{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">
              AI টুলস
            </span>
          </h2>
          <p className="mt-3 text-slate-400 text-base sm:text-lg">
            আপনার নিজের ফ্রি API কী দিয়ে চালান — একাডেমির কোনো খরচ নেই,
            আপনার কী শুধু আপনার ব্রাউজারেই থাকে।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {CARDS.map((c, i) => (
            <Reveal key={c.href} delay={i * 0.08}>
              <Link
                href={c.href}
                className={`group flex flex-col h-full rounded-2xl border bg-gradient-to-br ${c.grad} p-6 hover:-translate-y-1 transition-all duration-300`}
              >
                <span className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${c.iconBg}`}>
                  <c.icon size={22} />
                </span>
                <h3 className="mt-4 text-lg font-bold text-white">{c.title}</h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed flex-1">{c.desc}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-300 group-hover:gap-2.5 transition-all">
                  ব্যবহার করুন <ArrowRight size={16} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
