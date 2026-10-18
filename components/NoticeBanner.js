"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";

const DISMISS_KEY = "noticeBannerDismissed";

export default function NoticeBanner() {
  const { settings } = useSettings();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISS_KEY) === "1") setDismissed(true);
    } catch {}
  }, []);

  const nb = settings?.noticeBanner;
  if (dismissed || !nb?.enabled || !nb?.imageUrl) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {}
  };

  const img = (
    <img
      src={nb.imageUrl}
      alt={nb.title || "নোটিশ"}
      className="aspect-video w-full object-cover"
      loading="eager"
    />
  );

  const media = nb.linkUrl ? (
    <a
      href={nb.linkUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      {img}
    </a>
  ) : (
    img
  );

  const closeBtn = (
    <button
      type="button"
      onClick={dismiss}
      aria-label="নোটিশ বন্ধ করুন"
      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/70 text-white backdrop-blur-sm transition hover:bg-red-600"
    >
      <X size={16} />
    </button>
  );

  // Floating popup variant: centered modal overlay above page content
  if (nb.style === "floating") {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        onClick={dismiss}
        role="dialog"
        aria-modal="true"
        aria-label="নোটিশ"
      >
        <div
          className="w-full max-w-2xl notice-pop overflow-hidden rounded-2xl border border-emerald-500/30 bg-slate-950 shadow-2xl shadow-emerald-950/50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            {media}
            {closeBtn}
          </div>
          {nb.title ? (
            <p className="px-4 py-3 text-center text-sm font-medium text-emerald-200/90">
              {nb.title}
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  // Default: top banner variant
  return (
    <div className="relative w-full border-b border-emerald-500/20 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="relative overflow-hidden rounded-xl border border-emerald-500/25 shadow-lg shadow-emerald-950/40">
          {media}
          {closeBtn}
        </div>
        {nb.title ? (
          <p className="mt-2 text-center text-sm font-medium text-emerald-200/90">
            {nb.title}
          </p>
        ) : null}
      </div>
    </div>
  );
}
