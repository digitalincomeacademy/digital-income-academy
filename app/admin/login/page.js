"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { LogIn, Info, TriangleAlert } from "lucide-react";
import { db, firebaseReady, getAuthInstance } from "@/lib/firebase";

function mapAuthError(code) {
  switch (code) {
    case "auth/invalid-email":
      return "ইমেইল ঠিকানা সঠিক নয়।";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "ইমেইল বা পাসওয়ার্ড ভুল হয়েছে।";
    case "auth/user-disabled":
      return "এই অ্যাকাউন্টটি নিষ্ক্রিয় করা হয়েছে।";
    case "auth/too-many-requests":
      return "অনেকবার ভুল চেষ্টা করা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।";
    case "auth/network-request-failed":
      return "নেটওয়ার্ক সমস্যা হয়েছে। ইন্টারনেট সংযোগ দেখুন।";
    default:
      return "লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।";
  }
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const auth = getAuthInstance();
      if (!auth || !db) {
        setError("Firebase কনফিগার করা হয়নি। .env.local এ Firebase কী বসান।");
        return;
      }

      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const snap = await getDoc(doc(db, "settings", "main"));
      const admins = snap.exists() ? snap.data().admins || [] : [];

      if (!admins.includes(email.trim())) {
        await signOut(auth);
        setError("আপনার এই অ্যাকাউন্টের অ্যাডমিন অ্যাক্সেস নেই।");
        return;
      }

      router.push("/admin");
    } catch (err) {
      setError(mapAuthError(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-navy-900 p-8 shadow-2xl"
      >
        <div className="mb-6 text-center">
          <p className="font-head text-2xl font-bold text-white">Digital Income Academy</p>
          <p className="mt-1 font-body text-sm text-slate-400">অ্যাডমিন লগইন</p>
        </div>

        {!firebaseReady && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3">
            <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-yellow-400" />
            <p className="font-body text-sm text-yellow-200">
              সতর্কতা: Firebase কী পাওয়া যায়নি। .env.local ফাইলে Firebase কনফিগারেশন যোগ
              করুন।
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block font-body text-sm font-medium text-slate-200">
              ইমেইল
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full rounded-lg border border-white/10 bg-navy-800 px-4 py-2.5 font-body text-white placeholder:text-slate-500 focus:border-brand-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block font-body text-sm font-medium text-slate-200">
              পাসওয়ার্ড
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-white/10 bg-navy-800 px-4 py-2.5 font-body text-white placeholder:text-slate-500 focus:border-brand-400 focus:outline-none"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 font-body text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-400 px-4 py-2.5 font-body font-semibold text-navy-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogIn className="h-4 w-4" />
            {loading ? "লগইন হচ্ছে..." : "লগইন"}
          </button>
        </form>

        <div className="mt-6 rounded-xl border border-brand-400/30 bg-brand-400/5 p-4">
          <p className="mb-2 flex items-center gap-2 font-body text-sm font-semibold text-brand-400">
            <Info className="h-4 w-4" />
            প্রথমবার সেটআপ
          </p>
          <ol className="list-decimal space-y-1.5 pl-5 font-body text-xs leading-relaxed text-slate-300">
            <li>
              Firebase Console &gt; Authentication &gt; Add user দিয়ে অ্যাডমিন ইমেইল তৈরি
              করুন
            </li>
            <li>Firestore-এ settings/main ডকুমেন্টে admins অ্যারেতে ইমেইল যোগ করুন</li>
            <li>তারপর লগইন করুন</li>
          </ol>
        </div>
      </motion.div>
    </div>
  );
}
