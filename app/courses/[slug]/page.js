"use client";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Clock, BarChart3, CheckCircle2, ArrowLeft, Loader2, BadgeCheck } from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, firebaseReady } from "@/lib/firebase";
import { useCollection } from "@/hooks/useCollection";
import { normCourse } from "@/lib/siteData";
import Reveal from "@/components/Reveal";

const bn = (n) => Number(n).toLocaleString("bn-BD");

function Curriculum({ curriculum = [] }) {
  const [open, setOpen] = useState(0);
  if (!curriculum.length) return null;
  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4">কারিকুলাম</h3>
      <div className="space-y-3">
        {curriculum.map((m, i) => (
          <div key={i} className="glass rounded-2xl overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? -1 : i)}
              className="w-full flex items-center justify-between gap-3 p-4 text-left font-semibold"
              aria-expanded={open === i}
            >
              <span>{m.title || `মডিউল ${bn(i + 1)}`}</span>
              <ChevronDown size={18} className={`shrink-0 text-brand-400 transition-transform ${open === i ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  {(m.lessons || []).map((l, j) => (
                    <li key={j} className="px-4 py-2.5 border-t border-white/5 text-slate-300 text-sm flex items-center gap-2">
                      <CheckCircle2 size={15} className="text-brand-400 shrink-0" />
                      {typeof l === "string" ? l : l.title}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

function EnrollForm({ course }) {
  const [form, setForm] = useState({ name: "", phone: "", trxId: "" });
  const [state, setState] = useState("idle"); // idle | sending | done | error
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const valid = form.name.trim().length >= 3 && /^[0-9+\- ]{6,}$/.test(form.phone.trim()) && form.trxId.trim().length >= 4;

  async function submit(e) {
    e.preventDefault();
    if (!valid || state === "sending") return;
    if (!firebaseReady || !db) { setState("error"); return; }
    setState("sending");
    try {
      await addDoc(collection(db, "enrollments"), {
        courseSlug: course.slug,
        courseTitle: course.title,
        name: form.name.trim(),
        phone: form.phone.trim(),
        trxId: form.trxId.trim(),
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-8 text-center">
        <BadgeCheck size={48} className="mx-auto text-brand-400" />
        <h3 className="mt-4 text-2xl font-bold">ভর্তির আবেদন পৌঁছেছে!</h3>
        <p className="mt-2 text-slate-300">
          আপনার তথ্য আমরা পেয়েছি। পেমেন্ট যাচাই করে শিগগিরই যোগাযোগ করা হবে।
        </p>
        <Link href="/courses" className="btn btn-gold mt-6">অন্য কোর্স দেখুন</Link>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} className="glass rounded-3xl p-6 md:p-8">
      <h3 className="text-2xl font-bold">ভর্তি ফর্ম</h3>
      <p className="mt-1 text-sm text-slate-400">bKash-এ পেমেন্ট করে নিচের তথ্য দিন।</p>
      <label className="block mt-5">
        <span className="text-sm text-slate-300">আপনার নাম *</span>
        <input value={form.name} onChange={set("name")} required placeholder="পুরো নাম"
          className="mt-1.5 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-brand-400 placeholder:text-slate-500" />
      </label>
      <label className="block mt-4">
        <span className="text-sm text-slate-300">মোবাইল নম্বর *</span>
        <input value={form.phone} onChange={set("phone")} required inputMode="tel" placeholder="01XXXXXXXXX"
          className="mt-1.5 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-brand-400 placeholder:text-slate-500" />
      </label>
      <label className="block mt-4">
        <span className="text-sm text-slate-300">bKash Transaction ID *</span>
        <input value={form.trxId} onChange={set("trxId")} required placeholder="যেমন: 9HXK2LM4PQ"
          className="mt-1.5 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-brand-400 placeholder:text-slate-500" />
      </label>
      {state === "error" && (
        <p className="mt-4 text-sm text-red-400">দুঃখিত, জমা দেওয়া যায়নি। আবার চেষ্টা করুন।</p>
      )}
      <button type="submit" disabled={!valid || state === "sending"} className="btn btn-primary w-full mt-6 disabled:opacity-50">
        {state === "sending" ? <><Loader2 size={18} className="animate-spin" /> পাঠানো হচ্ছে…</> : "ভর্তি নিশ্চিত করুন"}
      </button>
      <p className="mt-3 text-xs text-slate-500 text-center">জমা দিলে আমাদের টিম পেমেন্ট যাচাই করে যোগাযোগ করবে।</p>
    </form>
  );
}

export default function CourseDetailPage() {
  const { slug } = useParams();
  const { data, loading } = useCollection("courses", (c) => c.active !== false);
  const course = useMemo(() => {
    const raw = data.find((c) => c.slug === slug);
    return raw ? normCourse(raw) : null;
  }, [data, slug]);

  if (loading) {
    return (
      <div className="pt-28 pb-16 mx-auto max-w-[1200px] px-4">
        <div className="skeleton h-64" />
        <div className="skeleton h-10 w-2/3 mt-6" />
        <div className="skeleton h-40 mt-4" />
      </div>
    );
  }
  if (!course) {
    return (
      <div className="pt-32 pb-20 text-center mx-auto max-w-[1200px] px-4">
        <p className="text-xl text-slate-300">এই কোর্সটি খুঁজে পাওয়া যায়নি।</p>
        <Link href="/courses" className="btn btn-primary mt-6 inline-flex"><ArrowLeft size={18} /> সব কোর্স</Link>
      </div>
    );
  }

  const discount = course.oldPrice > course.price
    ? Math.round(((course.oldPrice - course.price) / course.oldPrice) * 100) : 0;

  return (
    <div className="pt-24 md:pt-28 pb-16 md:pb-24">
      <div className="mx-auto max-w-[1200px] px-4">
        <Link href="/courses" className="inline-flex items-center gap-2 text-slate-400 hover:text-brand-400 mb-6">
          <ArrowLeft size={18} /> সব কোর্স
        </Link>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Reveal>
              {course.imageUrl && (
                <div className="relative aspect-video rounded-3xl overflow-hidden glass">
                  <Image src={course.imageUrl} alt={course.title} fill sizes="(max-width:1024px) 100vw, 66vw" className="object-cover" />
                </div>
              )}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-extrabold flex-1 min-w-[200px]">{course.title}</h1>
                {discount > 0 && (
                  <span className="rounded-full bg-gold-400 text-navy-950 text-sm font-bold px-3 py-1">{bn(discount)}% ছাড়</span>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-400">
                {course.duration && <span className="inline-flex items-center gap-1.5"><Clock size={15} className="text-brand-400" />{course.duration}</span>}
                {course.level && <span className="inline-flex items-center gap-1.5"><BarChart3 size={15} className="text-brand-400" />{course.level}</span>}
              </div>
              <p className="mt-5 text-slate-300 text-lg whitespace-pre-line">{course.description}</p>
              {course.learn && course.learn.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-2xl font-bold mb-4">যা যা শিখবেন</h3>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {course.learn.map((l, i) => (
                      <li key={i} className="glass rounded-xl p-3.5 text-sm text-slate-200 flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-brand-400 shrink-0 mt-0.5" />
                        {typeof l === "string" ? l : l.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <Curriculum curriculum={course.curriculum} />
            </Reveal>
          </div>
          <div className="lg:sticky lg:top-28 self-start space-y-6">
            <Reveal className="glass rounded-3xl p-6">
              <div className="flex items-end gap-2">
                <span className="text-3xl font-extrabold text-gold-400">৳{bn(course.price ?? 0)}</span>
                {course.oldPrice > course.price && (
                  <span className="line-through text-slate-500 mb-1">৳{bn(course.oldPrice)}</span>
                )}
              </div>
              <a href="#enroll" className="btn btn-primary w-full mt-4">এখনই ভর্তি হন</a>
              <p className="mt-3 text-xs text-slate-500">bKash পেমেন্টে ভর্তি। আয় নির্ভর করবে আপনার কাজ ও ফলাফলের ওপর।</p>
            </Reveal>
            <div id="enroll" className="scroll-mt-28">
              <EnrollForm course={course} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
