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

function TextField({ label, value, onChange, required, placeholder }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-white/70">
        {label}
        {required && <span className="text-red-400"> *</span>}
      </span>
      <input
        type="text"
        className={inputCls}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
      />
    </label>
  );
}

function AreaField({ label, value, onChange, placeholder, rows = 4 }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-white/70">{label}</span>
      <textarea
        className={inputCls}
        rows={rows}
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

const emptyLive = {
  enabled: false,
  title: "",
  description: "",
  platform: "",
  url: "",
  thumbnailUrl: "",
  startTime: "",
};

function Inner() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyLive);

  useEffect(() => {
    (async () => {
      if (!db) {
        setLoading(false);
        return;
      }
      try {
        const snap = await getDoc(doc(db, "settings", "main"));
        if (snap.exists()) {
          const live = snap.data().live || {};
          setForm({
            enabled: live.enabled === true,
            title: live.title || "",
            description: live.description || "",
            platform: live.platform || "",
            url: live.url || "",
            thumbnailUrl: live.thumbnailUrl || "",
            startTime: live.startTime || "",
          });
        }
      } catch {
        toast.error("লাইভ সেটিংস লোড ব্যর্থ হয়েছে");
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
    setSaving(true);
    try {
      await setDoc(doc(db, "settings", "main"), { live: form }, { merge: true });
      toast.success("লাইভ সেটিংস সংরক্ষণ হয়েছে");
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
        label="লাইভ ব্যানার চালু (সাইটে দেখাবে)"
        checked={form.enabled}
        onChange={set("enabled")}
      />
      <TextField
        label="লাইভের শিরোনাম"
        value={form.title}
        onChange={set("title")}
        placeholder="যেমন: আজকের স্পেশাল লাইভ"
      />
      <AreaField
        label="বিবরণ"
        value={form.description}
        onChange={set("description")}
        placeholder="লাইভ সম্পর্কে লিখুন..."
      />
      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="প্ল্যাটফর্ম"
          value={form.platform}
          onChange={set("platform")}
          placeholder="যেমন: Facebook"
        />
        <TextField
          label="শুরুর সময়"
          value={form.startTime}
          onChange={set("startTime")}
          placeholder="যেমন: আজ রাত ৯:০০ টা"
        />
      </div>
      <TextField
        label="লাইভ URL"
        value={form.url}
        onChange={set("url")}
        placeholder="https://..."
      />
      <ImageUpload
        label="থাম্বনেইল ছবি"
        value={form.thumbnailUrl}
        onChange={set("thumbnailUrl")}
      />
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

export default function LivePage() {
  return (
    <ProtectedRoute>
      <AdminLayout title="লাইভ ব্যানার">
        <Inner />
      </AdminLayout>
    </ProtectedRoute>
  );
}
