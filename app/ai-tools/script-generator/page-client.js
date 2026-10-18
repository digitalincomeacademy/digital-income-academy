"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clapperboard, Copy, Check, Loader2, AlertTriangle } from "lucide-react";
import ApiKeyManager from "@/components/ai-tools/ApiKeyManager";
import { generateText, friendlyError, hasKey, HONEST_GUARDRAIL } from "@/lib/aiTools";

const TYPES = [
  { id: "short", label: "শর্ট ভিডিও (৩০–৬০ সেকেন্ড)", desc: "Reels / Shorts / TikTok" },
  { id: "long", label: "লং ভিডিও (৩–৫ মিনিট)", desc: "YouTube / Facebook" },
];
const TONES = ["শিক্ষামূলক", "মোটিভেশনাল", "মজার/এন্টারটেইনিং", "সরাসরি/বিক্রয়মুখী"];

const SYSTEM = `তুমি Digital Income Academy-র ভিডিও স্ক্রিপ্ট রাইটার। বাংলাদেশি দর্শকের জন্য সহজ, প্রাণবন্ত বাংলায় স্ক্রিপ্ট লিখবে।
${HONEST_GUARDRAIL}`;

function buildPrompt({ topic, type, tone }) {
  const len = type === "short"
    ? "৩০–৬০ সেকেন্ডের শর্ট ভিডিওর জন্য (১২০–১৬০ শব্দ)"
    : "৩–৫ মিনিটের লং ভিডিওর জন্য (৪৫০–৬০০ শব্দ)";
  return `টপিক: "${topic}"
ভিডিও টাইপ: ${len}
টোন: ${tone}

নিচের ফরম্যাটে স্ক্রিপ্ট দাও:

🎯 হুক (প্রথম ৩ সেকেন্ড): [দর্শককে থামিয়ে দেওয়ার মতো ১–২ লাইন]

📝 স্ক্রিপ্ট:
[টাইমস্ট্যাম্প/সেকশন ভাগ করে পুরো স্ক্রিপ্ট — বলার মতো স্বাভাবিক ভাষায়]

📢 CTA (শেষে): [সাবস্ক্রাইব/ফলো/কমেন্টের আহ্বান — ১–২ লাইন]`;
}

export default function ScriptGenerator() {
  const [topic, setTopic] = useState("");
  const [type, setType] = useState("short");
  const [tone, setTone] = useState(TONES[0]);
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState(false);
  const [keyTick, setKeyTick] = useState(0);

  const run = async () => {
    setErr(""); setOut(""); setCopied(false);
    if (!topic.trim()) { setErr("প্রথমে টপিক লিখুন।"); return; }
    if (!hasKey()) { setErr("প্রথমে উপরে আপনার ফ্রি API কী সেট করুন।"); return; }
    setLoading(true);
    try {
      const text = await generateText({ system: SYSTEM, prompt: buildPrompt({ topic: topic.trim(), type, tone }) });
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
          <span className="w-11 h-11 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
            <Clapperboard size={22} />
          </span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">ভিডিও স্ক্রিপ্ট + হুক জেনারেটর</h1>
            <p className="text-sm text-slate-400 mt-0.5">টপিক দিন — হুকসহ পুরো স্ক্রিপ্ট পান</p>
          </div>
        </div>

        <div className="mt-6 mb-6">
          <ApiKeyManager compact onChange={() => setKeyTick((t) => t + 1)} />
        </div>

        <div className="glass rounded-2xl p-5 sm:p-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-200 mb-1.5 block">ভিডিওর টপিক *</label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="যেমন: ফেসবুক পেজ থেকে আয় করার ৩টি উপায়"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-200 mb-1.5 block">ভিডিও টাইপ</label>
            <div className="grid sm:grid-cols-2 gap-2">
              {TYPES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setType(t.id)}
                  className={`text-left px-4 py-3 rounded-xl border transition ${
                    type === t.id
                      ? "bg-cyan-500/15 border-cyan-400 text-white"
                      : "bg-slate-950 border-slate-700 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  <span className="font-semibold text-sm">{t.label}</span>
                  <span className="block text-xs text-slate-500 mt-0.5">{t.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-200 mb-1.5 block">টোন</label>
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`px-4 py-2 rounded-full text-sm border transition ${
                    tone === t
                      ? "bg-cyan-500 text-slate-950 border-cyan-400 font-semibold"
                      : "bg-slate-950 border-slate-700 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={run}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold text-base hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (<><Loader2 size={18} className="animate-spin" /> স্ক্রিপ্ট লেখা হচ্ছে…</>) : "✨ স্ক্রিপ্ট বানান"}
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
              <h2 className="font-bold text-white">আপনার স্ক্রিপ্ট</h2>
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
