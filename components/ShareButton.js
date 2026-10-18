"use client";
import { useState, useRef, useEffect } from "react";
import { Share2, Link2, Check } from "lucide-react";

export default function ShareButton({ title = "", url = "", size = "sm" }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const text = title || "ডিজিটাল ইনকাম একাডেমি";
  const enc = encodeURIComponent;

  const targets = [
    {
      name: "Facebook",
      icon: "📘",
      href: `https://www.facebook.com/sharer/sharer.php?u=${enc(shareUrl)}`,
    },
    {
      name: "WhatsApp",
      icon: "💬",
      href: `https://wa.me/?text=${enc(text + " " + shareUrl)}`,
    },
    {
      name: "Telegram",
      icon: "✈️",
      href: `https://t.me/share/url?url=${enc(shareUrl)}&text=${enc(text)}`,
    },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = shareUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setOpen(false);
    }, 1200);
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: text, url: shareUrl });
        setOpen(false);
        return true;
      } catch {
        return false;
      }
    }
    return false;
  };

  const onClick = async (e) => {
    e.stopPropagation();
    if (!open && (await nativeShare())) return;
    setOpen(!open);
  };

  const btnSize = size === "lg" ? "w-10 h-10" : "w-8 h-8";
  const iconSize = size === "lg" ? "w-5 h-5" : "w-4 h-4";

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={onClick}
        aria-label="শেয়ার করুন"
        title="শেয়ার করুন"
        className={`${btnSize} rounded-full bg-white/10 hover:bg-emerald-500/30 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors backdrop-blur-sm`}
      >
        <Share2 className={iconSize} />
      </button>

      {open && (
        <div className="absolute bottom-full mb-2 right-0 z-50 w-44 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden">
          {targets.map((t) => (
            <a
              key={t.name}
              href={t.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-200 hover:bg-emerald-500/15 transition-colors"
            >
              <span className="text-base">{t.icon}</span>
              <span>{t.name}</span>
            </a>
          ))}
          <button
            onClick={(e) => {
              e.stopPropagation();
              copyLink();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-200 hover:bg-emerald-500/15 transition-colors border-t border-slate-800"
          >
            <span className="text-base">{copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Link2 className="w-4 h-4" />}</span>
            <span>{copied ? "কপি হয়েছে!" : "লিংক কপি"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
