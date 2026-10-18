"use client";
import { useState } from "react";
import { Copy, Check, ChevronDown, ChevronUp, Terminal } from "lucide-react";

const PREVIEW_LEN = 220;

export default function PromptBox({ prompt }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  if (!prompt) return null;

  const isLong = prompt.length > PREVIEW_LEN;
  const shown = expanded || !isLong ? prompt : prompt.slice(0, PREVIEW_LEN) + "…";

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = prompt;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mt-5 rounded-2xl border border-cyan-500/25 bg-cyan-950/40 overflow-hidden">
      <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-cyan-500/15">
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-300">
          <Terminal className="w-4 h-4" /> প্রম্পট
        </span>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 active:scale-95 transition-all"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "কপি হয়েছে!" : "কপি করুন"}
        </button>
      </div>
      <p className="px-4 py-3 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap break-words">
        {shown}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full px-4 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/10 transition-colors inline-flex items-center justify-center gap-1"
        >
          {expanded ? (
            <>সংক্ষেপ করুন <ChevronUp className="w-3.5 h-3.5" /></>
          ) : (
            <>পুরোটা দেখুন <ChevronDown className="w-3.5 h-3.5" /></>
          )}
        </button>
      )}
    </div>
  );
}
// Force rebuild 1792087738

