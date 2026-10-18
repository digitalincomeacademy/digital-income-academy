"use client";
import { useEffect, useState } from "react";
import { KeyRound, Eye, EyeOff, Trash2, ExternalLink, CheckCircle2, ShieldCheck } from "lucide-react";
import { PROVIDERS, loadKeyState, saveKeyState, clearKeyState } from "@/lib/aiTools";

export default function ApiKeyManager({ compact = false, onChange }) {
  const [state, setState] = useState(() => loadKeyState());
  const [show, setShow] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setState(loadKeyState());
  }, []);

  const p = PROVIDERS[state.provider] || PROVIDERS.gemini;

  const update = (patch) => {
    const next = { ...state, ...patch };
    setState(next);
    saveKeyState(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
    onChange && onChange(next);
  };

  const setKey = (v) => update({ keys: { ...state.keys, [p.id]: v } });
  const setModel = (v) => update({ models: { ...state.models, [p.id]: v } });

  const handleClear = () => {
    if (!window.confirm("সব API কী মুছে ফেলবেন?")) return;
    clearKeyState();
    const fresh = loadKeyState();
    setState(fresh);
    onChange && onChange(fresh);
  };

  const hasAnyKey = Object.values(state.keys || {}).some((k) => String(k || "").trim());

  return (
    <div className="glass rounded-2xl p-5 border border-cyan-500/20">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
            <KeyRound className="w-4.5 h-4.5 text-cyan-300" size={18} />
          </span>
          <div>
            <h3 className="font-bold text-white text-sm sm:text-base">আপনার ফ্রি API কী</h3>
            <p className="text-xs text-slate-400">BYOK — কী শুধু আপনার ব্রাউজারে থাকে</p>
          </div>
        </div>
        {saved && (
          <span className="inline-flex items-center gap-1 text-xs text-emerald-300 font-medium">
            <CheckCircle2 size={14} /> সেভ হয়েছে
          </span>
        )}
      </div>

      {!compact && (
        <p className="mt-3 text-xs leading-relaxed text-slate-400 flex gap-1.5">
          <ShieldCheck size={14} className="shrink-0 mt-0.5 text-emerald-400" />
          <span>
            একাডেমি আপনার কী দেখে না বা সংরক্ষণ করে না। নিচের প্রোভাইডার থেকে ফ্রি কী
            নিন (কার্ড লাগে না), এখানে বসান — তারপর টুল ব্যবহার করুন।
          </span>
        </p>
      )}

      <div className="mt-4 grid gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-300 mb-1.5 block">প্রোভাইডার</label>
          <div className="flex flex-wrap gap-2">
            {Object.values(PROVIDERS).map((pr) => (
              <button
                key={pr.id}
                onClick={() => update({ provider: pr.id })}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition ${
                  state.provider === pr.id
                    ? "bg-cyan-500 text-slate-950 border-cyan-400"
                    : "bg-slate-900 border-slate-700 text-slate-300 hover:border-cyan-500/50"
                }`}
              >
                {pr.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
            <span>API কী ({p.label})</span>
            {p.keyUrl && (
              <a
                href={p.keyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-cyan-300 hover:text-cyan-200 font-medium"
              >
                ফ্রি কী নিন <ExternalLink size={12} />
              </a>
            )}
          </label>
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              value={state.keys[p.id] || ""}
              onChange={(e) => setKey(e.target.value)}
              placeholder="এখানে আপনার কী পেস্ট করুন…"
              autoComplete="off"
              spellCheck={false}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-4 pr-11 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-400 font-mono"
            />
            <button
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              aria-label={show ? "লুকান" : "দেখান"}
            >
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {p.keyHint && <p className="mt-1 text-[11px] text-slate-500">{p.keyHint}</p>}
        </div>

        {p.id === "custom" && (
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Base URL</label>
            <input
              value={state.customBase || ""}
              onChange={(e) => update({ customBase: e.target.value })}
              placeholder="https://example.com/v1"
              autoComplete="off"
              spellCheck={false}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-400 font-mono"
            />
          </div>
        )}

        <div>
          <label className="text-xs font-semibold text-slate-300 mb-1.5 block">মডেল</label>
          {p.models?.length ? (
            <select
              value={state.models[p.id] || p.defaultModel}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-400"
            >
              {p.models.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          ) : (
            <input
              value={state.models[p.id] || ""}
              onChange={(e) => setModel(e.target.value)}
              placeholder="মডেলের নাম লিখুন"
              autoComplete="off"
              spellCheck={false}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-400 font-mono"
            />
          )}
        </div>

        {hasAnyKey && (
          <button
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 text-xs text-red-400/80 hover:text-red-300 font-medium self-start"
          >
            <Trash2 size={13} /> সব কী মুছে ফেলুন
          </button>
        )}
      </div>
    </div>
  );
}
