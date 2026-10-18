"use client";
import { ExternalLink, X, ShieldAlert } from "lucide-react";
import { useSite } from "@/components/SiteContext";

export default function ExternalLinkNotice() {
  const { externalLink, closeExternalLink } = useSite();
  if (!externalLink.open) return null;

  const go = () => {
    const url = externalLink.url;
    closeExternalLink();
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md modal-fade">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <button
          onClick={closeExternalLink}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="বন্ধ করুন"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white leading-snug">
              {externalLink.title || "বাইরের লিংক"}
            </h3>
            {externalLink.type && (
              <p className="text-xs text-slate-400">{externalLink.type}</p>
            )}
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          আপনি এখন আমাদের ওয়েবসাইট ছেড়ে একটি বাইরের ওয়েবসাইটে যাচ্ছেন। এগিয়ে যেতে
          চাইলে নিচের বোতামে ক্লিক করুন।
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={closeExternalLink}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-colors cursor-pointer"
          >
            বাতিল
          </button>
          <button
            onClick={go}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-colors cursor-pointer"
          >
            <span>এগিয়ে যান</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
