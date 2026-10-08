"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { ShieldAlert, TriangleAlert, LogIn } from "lucide-react";
import { ToastProvider } from "./Toast";
import { db, firebaseReady, getAuthInstance } from "@/lib/firebase";

function Gate({ children }) {
  const router = useRouter();
  const [status, setStatus] = useState("checking"); // checking | ok | noaccess

  useEffect(() => {
    if (!firebaseReady || !db) return;
    const auth = getAuthInstance();
    if (!auth) return;

    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/admin/login");
        return;
      }
      try {
        const snap = await getDoc(doc(db, "settings", "main"));
        const admins = snap.exists() ? snap.data().admins || [] : [];
        if (admins.includes(user.email)) {
          setStatus("ok");
        } else {
          await signOut(auth);
          setStatus("noaccess");
        }
      } catch (err) {
        await signOut(auth);
        setStatus("noaccess");
      }
    });

    return () => unsub();
  }, [router]);

  if (!firebaseReady || !db) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-950 p-4">
        <div className="max-w-md rounded-2xl border border-red-500/30 bg-navy-900 p-8 text-center">
          <TriangleAlert className="mx-auto mb-4 h-10 w-10 text-red-400" />
          <p className="font-body text-white">
            Firebase কনফিগার করা হয়নি। .env.local এ Firebase কী বসান।
          </p>
        </div>
      </div>
    );
  }

  if (status === "checking") {
    return (
      <div className="min-h-screen bg-navy-950 p-6">
        <div className="mx-auto max-w-6xl space-y-4">
          <div className="h-14 animate-pulse rounded-xl bg-navy-800" />
          <div className="grid gap-4 md:grid-cols-3">
            <div className="h-28 animate-pulse rounded-xl bg-navy-800" />
            <div className="h-28 animate-pulse rounded-xl bg-navy-800" />
            <div className="h-28 animate-pulse rounded-xl bg-navy-800" />
          </div>
          <div className="h-64 animate-pulse rounded-xl bg-navy-800" />
        </div>
      </div>
    );
  }

  if (status === "noaccess") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-950 p-4">
        <div className="max-w-md rounded-2xl border border-red-500/30 bg-navy-900 p-8 text-center">
          <ShieldAlert className="mx-auto mb-4 h-10 w-10 text-red-400" />
          <p className="mb-6 font-body text-white">
            আপনার এই অ্যাকাউন্টের অ্যাডমিন অ্যাক্সেস নেই।
          </p>
          <button
            onClick={() => router.replace("/admin/login")}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-400 px-5 py-2.5 font-body font-semibold text-navy-950 transition hover:bg-cyan-300"
          >
            <LogIn className="h-4 w-4" />
            লগইন পেজে ফিরুন
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function ProtectedRoute({ children }) {
  return (
    <ToastProvider>
      <Gate>{children}</Gate>
    </ToastProvider>
  );
}
