"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Type, Copy, Check, Loader2, AlertTriangle } from "lucide-react";
import ApiKeyManager from "@/components/ai-tools/ApiKeyManager";
import { generateText, friendlyError, hasKey, HONEST_GUARDRAIL } from "@/lib/aiTools";

const PLATFORMS = ["TikTok", "YouTube Shorts", "YouTube (লং)", "Instagram Reels", "Facebook Reels"];

const SYSTEM = `তুমি Digital Income Academy-র সোশ্যাল মিডিয়া ক্যাপশন এক্সপার্ট। বাংলাদেশি দর্শকের জন্য লিখবে।
${HONEST_GUARDRAIL}`;

function buildPrompt({ topic, platform }) {
  return `ভিডিও টপিক: "${topic}"
প্ল্যাটফর্ম: ${platform}

নিচের ফরম্যাটে দাও (বাংলায়, ইমোজি ব্যবহার করে):

📌 টাইটেল (৩টি অপশন):
1.
2.
3.

🏷️ ট্যাগ/কীওয়ার্ড (কমা দিয়ে ৮–১০টি):

📝 ক্যাপশন:
[হুক লাইন → ✅ ৩-৪ পয়েন্টের চেকলিস্ট → এক লাইনের সারসংক্ষেপ → "Digital Income Academy" ব্র্যান্ড নাম → ৬-৮টি মিক্সড হ্যাশট্যাগ (বাংলা+ইংরেজি)]

📢 CTA: [কমেন্ট/ফলো/শেয়ারের আহ্বান — ১ লাইন]`;
}

export default function CaptionGenerator() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState(false);

  const run = async () => {
    setErr(""); setOut(""); setCopied(false);
    if (!topic.trim()) { setErr("প্রথমে টপিক লিখুন।"); return; }
    if (!hasKey()) { setErr("প্রথমে উপরে আপনার ফ্রি API কী সেট করুন।"); return; }
    setLoading(true);
    try {
      const text = await generateText({ system: SYSTEM, prompt: buildPrompt({ topic: topic.trim(), platform }) });
      setOut(text);
    } catch (e) {
      setErr(friendlyError(e));
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(out);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (_) {}
  };

  return (
    <div className="pt-28 md:pt-32 pb-16 md:pb-24">
      <div className="mx-auto max-w-[860px] px-4">
        <Link href="/ai-tools" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-5">
          <ArrowLeft size={16} /> সব AI টুলস
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <span className="w-11 h-11 rounded-2xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-300">
            <Type size={22} />
          </span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">টাইটেল / ট্যাগ / ক্যাপশন জেনারেটর</h1>
            <p className="text-sm text-slate-400 mt-0.5">প্ল্যাটফর্ম বেছে নিন — পোস্ট-রেডি ক্যাপশন পান</p>
          </div>
        </div>

        <div className="mt-6 mb-6">
          <ApiKeyManager compact />
        </div>

        <div className="glass rounded-2xl p-5 sm:p-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-200 mb-1.5 block">ভিডিওর টপিক *</label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="যেমন: ঘরে বসে মোবাইল দিয়ে আয়"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:border-violet-400"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-200 mb-1.5 block">প্ল্যাটফর্ম</label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`px-4 py-2 rounded-full text-sm border transition ${
                    platform === p
                      ? "bg-violet-500 text-white border-violet-400 font-semibold"
                      : "bg-slate-950 border-slate-700 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={run}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-400 text-white font-bold text-base hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (<><Loader2 size={18} className="animate-spin" /> লেখা হচ্ছে…</>) : "✨ ক্যাপশন বানান"}
          </button>

          {err && (
            <p className="flex items-start gap-2 text-sm text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" /> {err}
            </p>
          )}
        </div>

        {out && (
          <div className="mt-6 glass rounded-2xl p-5 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-white">আপনার ক্যাপশন সেট</h2>
              <button
                onClick={copy}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                {copied ? (<><Check size={14} className="text-emerald-400" /> কপি হয়েছে</>) : (<><Copy size={14} /> কপি করুন</>)}
              </button>
            </div>
            <div className="whitespace-pre-wrap text-sm sm:text-[15px] leading-relaxed text-slate-200 bg-slate-950/60 rounded-xl p-4 border border-slate-800">
              {out}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
