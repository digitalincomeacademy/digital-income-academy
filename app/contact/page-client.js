"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Facebook, Instagram, Send, Loader2, MessageCircle } from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, firebaseReady } from "@/lib/firebase";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";

const socials = [
  { name: "Facebook", url: "https://www.facebook.com/Digital.Incomee.Academy", icon: Facebook, desc: "পেজে ফলো করুন" },
  { name: "Instagram", url: "https://www.instagram.com/digtalincomeacademy", icon: Instagram, desc: "রিলস ও আপডেট" },
  { name: "TikTok", url: "https://www.tiktok.com/@digtalincomeacademy", icon: MessageCircle, desc: "শর্ট ভিডিও" },
  { name: "Telegram", url: "https://t.me/digitalincomeaacademy", icon: Send, desc: "কমিউনিটিতে যোগ দিন" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [state, setState] = useState("idle"); // idle | sending | done | error
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const valid = form.name.trim().length >= 3 && /^[0-9+\- ]{6,}$/.test(form.phone.trim()) && form.message.trim().length >= 5;

  async function submit(e) {
    e.preventDefault();
    if (!valid || state === "sending") return;
    if (!firebaseReady || !db) { setState("error"); return; }
    setState("sending");
    try {
      await addDoc(collection(db, "messages"), {
        name: form.name.trim(), phone: form.phone.trim(),
        message: form.message.trim(), createdAt: serverTimestamp(),
      });
      setState("done");
    } catch {
      setState("error");
    }
  }

  const inputCls = "mt-1.5 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-brand-400 placeholder:text-slate-500";

  return (
    <div className="pt-28 md:pt-32 pb-16 md:pb-24">
      <div className="mx-auto max-w-[1200px] px-4">
        <SectionHeading title="যোগাযোগ" sub="প্রশ্ন থাকলে মেসেজ পাঠান — আমরা উত্তর দেওয়ার চেষ্টা করবো।" />
        <div className="grid lg:grid-cols-2 gap-8">
          <Reveal>
            {state === "done" ? (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-10 text-center h-full flex flex-col justify-center">
                <p className="text-2xl font-bold">মেসেজ পৌঁছেছে!</p>
                <p className="mt-2 text-slate-300">ধন্যবাদ। শিগগিরই আপনার সাথে যোগাযোগ করা হবে।</p>
              </motion.div>
            ) : (
              <form onSubmit={submit} className="glass rounded-3xl p-6 md:p-8">
                <label className="block">
                  <span className="text-sm text-slate-300">আপনার নাম *</span>
                  <input value={form.name} onChange={set("name")} required placeholder="পুরো নাম" className={inputCls} />
                </label>
                <label className="block mt-4">
                  <span className="text-sm text-slate-300">মোবাইল নম্বর *</span>
                  <input value={form.phone} onChange={set("phone")} required inputMode="tel" placeholder="01XXXXXXXXX" className={inputCls} />
                </label>
                <label className="block mt-4">
                  <span className="text-sm text-slate-300">আপনার বার্তা *</span>
                  <textarea value={form.message} onChange={set("message")} required rows={5} placeholder="কী জানতে চান লিখুন…" className={`${inputCls} resize-y`} />
                </label>
                {state === "error" && <p className="mt-4 text-sm text-red-400">দুঃখিত, পাঠানো যায়নি। আবার চেষ্টা করুন।</p>}
                <button type="submit" disabled={!valid || state === "sending"} className="btn btn-primary w-full mt-6 disabled:opacity-50">
                  {state === "sending" ? <><Loader2 size={18} className="animate-spin" /> পাঠানো হচ্ছে…</> : "মেসেজ পাঠান"}
                </button>
              </form>
            )}
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-4 content-start">
            {socials.map((s, i) => (
              <Reveal key={s.name} className="">
                <a href={s.url} target="_blank" rel="noopener noreferrer"
                  className="glass rounded-2xl p-5 flex items-center gap-4 hover:border-brand-400 transition group block">
                  <span className="rounded-xl bg-brand-400/10 text-brand-400 p-3 group-hover:scale-110 transition">
                    <s.icon size={22} />
                  </span>
                  <span>
                    <span className="block font-bold">{s.name}</span>
                    <span className="block text-sm text-slate-400">{s.desc}</span>
                  </span>
                </a>
              </Reveal>
            ))}
            <Reveal className="sm:col-span-2 glass rounded-2xl p-5">
              <p className="text-slate-300 text-sm">
                দ্রুত উত্তরের জন্য টেলিগ্রাম চ্যানেলে যোগ দিন — গুরুত্বপূর্ণ আপডেট সবার আগে ওখানেই দেওয়া হয়।
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
