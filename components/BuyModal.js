"use client";
import { useState, useEffect } from "react";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";
import { motion, AnimatePresence } from "framer-motion";
import { X, Smartphone, Copy, CheckCircle2, ExternalLink } from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useSettings } from "@/hooks/useSettings";

export default function BuyModal({ item, itemType, onClose, linkOpened = false }) {
  const { settings } = useSettings();
  const [form, setForm] = useState({ name: "", phone: "", trxId: "" });
  const [state, setState] = useState("idle"); // idle | sending | done | error
  const [error, setError] = useState("");

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    lockScroll();
    return () => {
      window.removeEventListener("keydown", onKey);
      unlockScroll();
    };
  }, [onClose]);

  const payment = settings?.payment || {};
  const bkashNumber = payment.bkashNumber || "";
  const merchantLinkTemplate = payment.bkashMerchantLink || "";
  const instructions = payment.instructions || "";

  // মার্চেন্ট লিংকে {amount} থাকলে আইটেমের দাম বসিয়ে দাও
  // যেমন: https://bkash.com/pay?amount={amount} → https://bkash.com/pay?amount=1999
  const getMerchantLink = () => {
    if (!merchantLinkTemplate) return "";
    const numericPrice = String(item.price || "").replace(/[^0-9]/g, "");
    return merchantLinkTemplate
      .replace("{amount}", numericPrice)
      .replace("{price}", numericPrice);
  };
  const merchantLink = getMerchantLink();

  const copyNumber = () => {
    if (navigator.clipboard && bkashNumber) {
      navigator.clipboard.writeText(bkashNumber);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.trxId.trim()) {
      setError("নাম, মোবাইল নম্বর ও ট্রানজেকশন আইডি দিন");
      return;
    }
    if (!db) { setError("সংযোগ সমস্যা"); return; }
    setState("sending");
    setError("");
    try {
      await addDoc(collection(db, "purchases"), {
        itemType,
        itemId: item.id,
        itemTitle: item.title || item.name,
        price: item.price,
        currency: item.currency || "৳",
        name: form.name.trim(),
        phone: form.phone.trim(),
        trxId: form.trxId.trim(),
        status: "pending",
        downloadUrl: item.downloadUrl || "",
        createdAt: serverTimestamp(),
      });
      setState("done");
    } catch {
      setError("জমা ব্যর্থ হয়েছে, আবার চেষ্টা করুন");
      setState("idle");
    }
  };

  const typeLabel = itemType === "course" ? "কোর্স" : itemType === "tool" ? "টুল" : "অ্যাপ";

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl"
          >
            <button
              onClick={onClose}
              aria-label="বন্ধ করুন"
              className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 sm:p-8">
              {state === "done" ? (
                <div className="text-center py-6">
                  <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white">অর্ডার পাঠানো হয়েছে!</h3>
                  <p className="mt-2 text-slate-400 text-sm leading-relaxed">
                    পেমেন্ট যাচাই করে অনুমোদন দেওয়া হবে।<br />
                    অনুমোদনের পর ডাউনলোড লিংক পেতে আপনার মোবাইল নম্বর দিয়ে চেক করুন।
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-6 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
                  >
                    ঠিক আছে
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-white pr-10">
                    {typeLabel} কিনুন
                  </h3>
                  <p className="mt-1 text-slate-400 text-sm">{item.title || item.name}</p>
                  <div className="mt-2 text-2xl font-extrabold text-emerald-400">
                    {item.price} {item.currency || "৳"}
                  </div>

                  <div className="mt-5 rounded-2xl bg-pink-500/10 border border-pink-500/20 p-4">
                    <div className="flex items-center gap-2 text-pink-400 font-semibold text-sm">
                      <Smartphone className="w-4 h-4" />
                      <span>বিকাশে পেমেন্ট করুন</span>
                    </div>
                    {linkOpened ? (
                      <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                        ✅ পেমেন্ট পেজ নতুন ট্যাবে খুলেছে। পেমেন্ট শেষ করে ট্রানজেকশন আইডি নিচে দিন।
                      </p>
                    ) : merchantLink ? (
                      <a
                        href={merchantLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-pink-500 hover:bg-pink-400 text-white font-bold transition-all hover:scale-[1.02]"
                      >
                        <span>বিকাশে পেমেন্ট করুন</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    ) : bkashNumber ? (
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <span className="text-lg font-mono font-bold text-white tracking-wider">
                          {bkashNumber}
                        </span>
                        <button
                          onClick={copyNumber}
                          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                          aria-label="নম্বর কপি"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    ) : null}
                    {instructions && (
                      <p className="mt-2 text-xs text-slate-400 leading-relaxed whitespace-pre-wrap">
                        {instructions}
                      </p>
                    )}
                    {merchantLink && (
                      <p className="mt-2 text-xs text-slate-400">
                        পেমেন্ট শেষে নিচে ট্রানজেকশন আইডি দিন
                      </p>
                    )}
                  </div>

                  <form onSubmit={submit} className="mt-5 space-y-3">
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="আপনার নাম"
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white placeholder-white/30 outline-none focus:border-emerald-400"
                    />
                    <input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="মোবাইল নম্বর"
                      inputMode="tel"
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white placeholder-white/30 outline-none focus:border-emerald-400"
                    />
                    <input
                      value={form.trxId}
                      onChange={(e) => setForm({ ...form, trxId: e.target.value })}
                      placeholder="বিকাশ ট্রানজেকশন আইডি (TrxID)"
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white placeholder-white/30 outline-none focus:border-emerald-400"
                    />
                    {error && (
                      <p className="text-sm text-red-400">{error}</p>
                    )}
                    <button
                      type="submit"
                      disabled={state === "sending"}
                      className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold transition-colors"
                    >
                      {state === "sending" ? "পাঠানো হচ্ছে..." : "পেমেন্ট কনফার্ম করুন"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
