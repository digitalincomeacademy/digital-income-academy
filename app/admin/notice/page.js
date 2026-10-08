"use client";
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/components/admin/Toast";
import ImageUpload from "@/components/admin/ImageUpload";
import { Save } from "lucide-react";

const inputCls =
  "w-full rounded-lg border border-white/10 bg-navy-950 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-brand-400";

function TextField({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-white/70">{label}</span>
      <input
        type="text"
        className={inputCls}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

function CheckField({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-white/80">
      <input
        type="checkbox"
        className="h-4 w-4 rounded accent-cyan-400"
        checked={!!checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}

const emptyNotice = {
  enabled: false,
  style: "banner",
  imageUrl: "",
  linkUrl: "",
  title: "",
};

function Inner() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyNotice);

  useEffect(() => {
    (async () => {
      if (!db) {
        setLoading(false);
        return;
      }
      try {
        const snap = await getDoc(doc(db, "settings", "main"));
        if (snap.exists()) {
          const nb = snap.data().noticeBanner || {};
          setForm({
            enabled: nb.enabled === true,
            style: nb.style === "floating" ? "floating" : "banner",
            imageUrl: nb.imageUrl || "",
            linkUrl: nb.linkUrl || "",
            title: nb.title || "",
          });
        }
      } catch {
        toast.error("নোটিশ ব্যানার সেটিংস লোড ব্যর্থ হয়েছে");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  async function save(e) {
    e.preventDefault();
    if (!db) return toast.error("Firebase সংযুক্ত নয়");
    if (form.enabled && !form.imageUrl.trim()) {
      return toast.error("চালু করতে হলে ছবির লিংক দিন");
    }
    setSaving(true);
    try {
      await setDoc(
        doc(db, "settings", "main"),
        {
          noticeBanner: {
            enabled: form.enabled,
            style: form.style === "floating" ? "floating" : "banner",
            imageUrl: form.imageUrl.trim(),
            linkUrl: form.linkUrl.trim(),
            title: form.title.trim(),
          },
        },
        { merge: true }
      );
      toast.success("নোটিশ ব্যানার সংরক্ষণ হয়েছে");
    } catch {
      toast.error("সংরক্ষণ ব্যর্থ হয়েছে");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-white/5" />
        ))}
      </div>
    );
  }

  return (
    <form
      onSubmit={save}
      className="mx-auto max-w-2xl space-y-4 rounded-xl border border-white/10 bg-navy-900 p-6"
    >
      <CheckField
        label="নোটিশ ব্যানার চালু (সাইটে দেখাবে)"
        checked={form.enabled}
        onChange={set("enabled")}
      />
      <div>
        <span className="mb-1 block text-xs font-medium text-white/70">
          দেখানোর ধরন
        </span>
        <div className="flex gap-2">
          {[
            { value: "banner", label: "📐 টপ ব্যানার" },
            { value: "floating", label: "💬 ফ্লোটিং পপআপ" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => set("style")(opt.value)}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                form.style === opt.value
                  ? "border-cyan-400 bg-cyan-400/10 text-white"
                  : "border-white/10 bg-navy-950 text-white/60 hover:border-white/25"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <p className="mt-1 text-xs text-white/40">
          {form.style === "floating"
            ? "পেজের মাঝখানে ভাসমান পপআপ হিসেবে দেখাবে (ব্যাকড্রপে ক্লিক করলেও বন্ধ হবে)।"
            : "সাইটের একদম উপরে চওড়া ব্যানার হিসেবে দেখাবে।"}
        </p>
      </div>
      <ImageUpload
        label="ছবির লিংক (16:9 সাইজ ভালো)"
        value={form.imageUrl}
        onChange={set("imageUrl")}
      />
      <TextField
        label="শিরোনাম (ঐচ্ছিক — ছবির নিচে দেখাবে)"
        value={form.title}
        onChange={set("title")}
        placeholder="যেমন: নতুন কোর্সে ভর্তি চলছে"
      />
      <TextField
        label="ক্লিক লিংক (ঐচ্ছিক — ছবিতে ক্লিক করলে যাবে)"
        value={form.linkUrl}
        onChange={set("linkUrl")}
        placeholder="https://..."
      />
      <p className="text-xs text-white/40">
        ভিজিটর ❌ চাপ দিলে ব্যানার বন্ধ হবে এবং ওই ব্রাউজার সেশনে আর দেখাবে না।
      </p>
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-brand-400 px-5 py-2 text-sm font-semibold text-navy-950 hover:opacity-90 disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
        </button>
      </div>
    </form>
  );
}

export default function NoticePage() {
  return (
    <ProtectedRoute>
      <AdminLayout title="নোটিশ ব্যানার">
        <Inner />
      </AdminLayout>
    </ProtectedRoute>
  );
}
