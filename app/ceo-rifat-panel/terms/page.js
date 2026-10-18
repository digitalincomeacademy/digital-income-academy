"use client";
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/components/admin/Toast";
import { Save, Eye } from "lucide-react";

const inputCls =
  "w-full rounded-lg border border-white/10 bg-navy-950 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-brand-400";
const areaCls =
  "w-full rounded-lg border border-white/10 bg-navy-950 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-brand-400 font-mono leading-relaxed";

function Inner() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("শর্তাবলী");
  const [content, setContent] = useState("");

  useEffect(() => {
    (async () => {
      if (!db) {
        setLoading(false);
        return;
      }
      try {
        const snap = await getDoc(doc(db, "settings", "main"));
        if (snap.exists()) {
          const d = snap.data();
          setTitle(d.termsTitle || "শর্তাবলী");
          setContent(d.termsContent || "");
        }
      } catch {
        toast.error("লোড ব্যর্থ হয়েছে");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function save() {
    if (!db) return toast.error("Firebase সংযুক্ত নয়");
    if (!title.trim()) return toast.error("শিরোনাম আবশ্যক");
    if (!content.trim()) return toast.error("বিষয়বস্তু আবশ্যক");
    setSaving(true);
    try {
      await setDoc(
        doc(db, "settings", "main"),
        {
          termsTitle: title.trim(),
          termsContent: content.trim(),
          termsUpdatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      toast.success("শর্তাবলী সংরক্ষণ হয়েছে ✅");
    } catch {
      toast.error("সংরক্ষণ ব্যর্থ হয়েছে");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout title="শর্তাবলী">
      <div className="max-w-3xl space-y-5">
        <p className="text-sm text-white/50">
          এখানে লিখলে ওয়েবসাইটের{" "}
          <a
            href="/terms"
            target="_blank"
            rel="noreferrer"
            className="text-cyan-400 hover:underline inline-flex items-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" /> /terms
          </a>{" "}
          পেজে সাথে সাথে দেখা যাবে।
        </p>

        {loading ? (
          <div className="space-y-3">
            <div className="skeleton h-10 w-full" />
            <div className="skeleton h-64 w-full" />
          </div>
        ) : (
          <>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-white/70">
                শিরোনাম
              </span>
              <input
                className={inputCls}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="শর্তাবলী"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium text-white/70">
                বিষয়বস্তু
              </span>
              <textarea
                className={areaCls}
                rows={18}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={"## ১. শিরোনাম\nএখানে লেখা...\n\n- পয়েন্ট ১\n- পয়েন্ট ২"}
              />
            </label>
            <p className="text-xs text-white/40">
              ফরম্যাট: <code className="text-cyan-300">## </code> দিয়ে বড়
              শিরোনাম, <code className="text-cyan-300">- </code> দিয়ে পয়েন্ট
              লিখুন। খালি লাইন দিয়ে অনুচ্ছেদ আলাদা করুন।
            </p>

            <button
              onClick={save}
              disabled={saving}
              className="btn btn-primary disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
            </button>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

export default function TermsAdminPage() {
  return (
    <ProtectedRoute>
      <Inner />
    </ProtectedRoute>
  );
}
