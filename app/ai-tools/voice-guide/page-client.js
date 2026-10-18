"use client";
import Link from "next/link";
import { ArrowLeft, Mic, Download, AudioLines, Clapperboard, AlertTriangle, ExternalLink, FlaskConical, Scale } from "lucide-react";
import Reveal from "@/components/Reveal";

const STEPS = [
  {
    icon: Download,
    title: "১. VoiceStudio ইনস্টল করুন (আপনার PC-তে)",
    body: "VoiceStudio সম্পূর্ণ ফ্রি ও ওপেন-সোর্স সফটওয়্যার — ভয়েস বানানোর ভারী কাজ আপনার নিজের কম্পিউটারে চলে, তাই PC/ল্যাপটপ লাগবে (শুধু ফোনে হবে না)। ডাউনলোড পেজ থেকে আপনার সিস্টেমের (Windows/Mac/Linux) ভার্সন নিন।",
    link: { label: "ডাউনলোড পেজ", url: "https://github.com/debpalash/VoiceStudio/releases" },
  },
  {
    icon: AudioLines,
    title: "২. ভয়েস ক্লোন করুন",
    body: "অ্যাপে Voice cloning ওয়ার্কস্পেস খুলুন। ১–২ মিনিটের পরিষ্কার রেকর্ডিং দিন (শান্ত রুমে, ফোনের মাইকই চলবে) — নিজের ভয়েস, বা যার ভয়েস ব্যবহার করবেন তার অনুমতি নিয়ে তার ভয়েস। অ্যাপ আপনার ভয়েসের ডিজিটাল কপি বানিয়ে নেবে।",
  },
  {
    icon: Mic,
    title: "৩. বাংলা টেক্সট দিয়ে ভয়েসওভার বানান",
    body: "ভিডিওর স্ক্রিপ্ট (উপরের স্ক্রিপ্ট জেনারেটর দিয়েই বানাতে পারেন!) টেক্সট বক্সে পেস্ট করুন, ক্লোন করা ভয়েস সিলেক্ট করে Generate চাপুন। অডিও ফাইল ডাউনলোড করে ভিডিও এডিটরে বসান। সম্পূর্ণ ফ্রি — যত খুশি ততবার।",
  },
  {
    icon: Clapperboard,
    title: "৪. ভিডিওতে ব্যবহার করুন",
    body: "ভয়েসওভার + আপনার ভিডিও ফুটেজ মিলিয়ে এডিট করুন। প্রথম দিকে ছোট ভিডিওতে টেস্ট করুন — ভয়েস স্বাভাবিক শোনালে তবেই বড় প্রজেক্টে ব্যবহার করুন।",
  },
];

const NOTES = [
  {
    icon: FlaskConical,
    color: "text-amber-300",
    title: "পরীক্ষামূলক",
    body: "বাংলা ভয়েসের কোয়ালিটি এখনো যাচাই করা হয়নি। ব্যবহারের আগে নিজে শুনে নিন — অস্পষ্ট বা রোবোটিক শোনালে ভিডিওতে ব্যবহার করবেন না।",
  },
  {
    icon: Scale,
    color: "text-sky-300",
    title: "লাইসেন্স",
    body: "VoiceStudio AGPL-3.0 লাইসেন্সের — ব্যক্তিগত/শিক্ষামূলক ব্যবহারে সমস্যা নেই, কিন্তু কমার্শিয়াল প্রজেক্টে ব্যবহারের আগে লাইসেন্সের শর্ত পড়ে নিন।",
  },
  {
    icon: AlertTriangle,
    color: "text-red-300",
    title: "অনুমতি ছাড়া ভয়েস ক্লোন নয়",
    body: "অন্য কারো ভয়েস তার অনুমতি ছাড়া ক্লোন করা অনৈতিক ও ক্ষতিকর হতে পারে — শুধু নিজের বা অনুমতিপ্রাপ্ত ভয়েস ব্যবহার করুন।",
  },
];

export default function VoiceGuide() {
  return (
    <div className="pt-28 md:pt-32 pb-16 md:pb-24">
      <div className="mx-auto max-w-[860px] px-4">
        <Link href="/ai-tools" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-5">
          <ArrowLeft size={16} /> সব AI টুলস
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <span className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300">
            <Mic size={22} />
          </span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">ফ্রি ভয়েস ক্লোনিং গাইড</h1>
            <p className="text-sm text-slate-400 mt-0.5">VoiceStudio দিয়ে নিজের ভয়েসে আনলিমিটেড ভয়েসওভার</p>
          </div>
        </div>

        <div className="mt-4 mb-8 flex items-start gap-2 text-sm text-amber-200/90 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3">
          <FlaskConical size={16} className="shrink-0 mt-0.5" />
          <span>এই গাইডটি <strong>পরীক্ষামূলক</strong> — বাংলা কোয়ালিটি যাচাই না হওয়া পর্যন্ত সতর্কতার সাথে ব্যবহার করুন।</span>
        </div>

        <div className="space-y-4">
          {STEPS.map((s, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <div className="glass rounded-2xl p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
                    <s.icon size={20} />
                  </span>
                  <h2 className="font-bold text-white text-base sm:text-lg">{s.title}</h2>
                </div>
                <p className="mt-3 text-sm sm:text-[15px] text-slate-300 leading-relaxed">{s.body}</p>
                {s.link && (
                  <a
                    href={s.link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-300 hover:text-amber-200"
                  >
                    {s.link.label} <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>

        <h2 className="mt-10 mb-4 text-xl font-bold text-white">জরুরি নোট</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {NOTES.map((n, i) => (
            <div key={i} className="glass rounded-2xl p-5">
              <n.icon size={20} className={n.color} />
              <h3 className="mt-2 font-bold text-white text-sm">{n.title}</h3>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">{n.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/ai-tools/script-generator"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-400 text-slate-950 font-bold hover:opacity-90 transition"
          >
            <Mic size={16} /> স্ক্রিপ্ট বানিয়ে ভয়েসওভারে ব্যবহার করুন
          </Link>
        </div>
      </div>
    </div>
  );
}
