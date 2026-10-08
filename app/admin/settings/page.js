"use client";
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, firebaseReady } from "@/lib/firebase";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/components/admin/Toast";
import { Save, X, Plus } from "lucide-react";

const defaults = {
  academyName: "",
  tagline: "",
  announcement: "",
  contactPhone: "",
  whatsapp: "",
  contactEmail: "",
  socials: { facebook: "", instagram: "", tiktok: "", telegram: "" },
  payment: { method: "", bkashNumber: "", instructions: "" },
  stats: { students: "", courses: "", videos: "", resources: "" },
  admins: [],
};

function SettingsInner() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(defaults);
  const [adminInput, setAdminInput] = useState("");

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
          setForm({
            academyName: d.academyName || "",
            tagline: d.tagline || "",
            announcement: d.announcement || "",
            contactPhone: d.contactPhone || "",
            whatsapp: d.whatsapp || "",
            contactEmail: d.contactEmail || "",
            socials: {
              facebook: d.socials?.facebook || "",
              instagram: d.socials?.instagram || "",
              tiktok: d.socials?.tiktok || "",
              telegram: d.socials?.telegram || "",
            },
            payment: {
              method: d.payment?.method || "",
              bkashNumber: d.payment?.bkashNumber || "",
              instructions: d.payment?.instructions || "",
            },
            stats: {
              students: d.stats?.students || "",
              courses: d.stats?.courses || "",
              videos: d.stats?.videos || "",
              resources: d.stats?.resources || "",
            },
            admins: Array.isArray(d.admins) ? d.admins : [],
          });
        }
      } catch (e) {
        toast.error("সেটিংস লোড ব্যর্থ: " + (e.message || e));
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setNested = (group, k, v) =>
    setForm((f) => ({ ...f, [group]: { ...f[group], [k]: v } }));

  const addAdmin = () => {
    const email = adminInput.trim();
    if (!email) return;
    if (form.admins.includes(email)) return toast.error("এই ইমেইল ইতিমধ্যে আছে");
    set("admins", [...form.admins, email]);
    setAdminInput("");
  };

  const removeAdmin = (email) => set("admins", form.admins.filter((a) => a !== email));

  const save = async () => {
    if (!db) return toast.error("Firebase সংযোগ নেই");
    setSaving(true);
    try {
      await setDoc(doc(db, "settings", "main"), { ...form }, { merge: true });
      toast.success("সেটিংস সংরক্ষণ হয়েছে");
    } catch (e) {
      toast.error("সংরক্ষণ ব্যর্থ: " + (e.message || e));
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "w-full rounded-lg bg-navy-950 border border-navy-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-brand-400 focus:outline-none";

  const Section = ({ title, children }) => (
    <section className="rounded-2xl border border-navy-800 bg-navy-900/60 p-5 space-y-4">
      <h3 className="font-head text-base font-bold text-slate-100">{title}</h3>
      {children}
    </section>
  );

  const Field = ({ label, children }) => (
    <div>
      <label className="mb-1 block text-xs text-slate-400">{label}</label>
      {children}
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border border-navy-800 bg-navy-900/60 p-5 space-y-3">
            <div className="h-5 w-32 rounded bg-navy-800" />
            <div className="h-10 rounded bg-navy-800" />
            <div className="h-10 rounded bg-navy-800" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Section title="সাধারণ">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="একাডেমির নাম">
            <input value={form.academyName} onChange={(e) => set("academyName", e.target.value)} className={inputCls} />
          </Field>
          <Field label="ট্যাগলাইন">
            <input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} className={inputCls} />
          </Field>
        </div>
      </Section>

      <Section title="ঘোষণা">
        <Field label="ঘোষণা বার্তা">
          <textarea value={form.announcement} onChange={(e) => set("announcement", e.target.value)} rows={3} className={inputCls} />
        </Field>
      </Section>

      <Section title="যোগাযোগ">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="ফোন">
            <input value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} className={inputCls} />
          </Field>
          <Field label="হোয়াটসঅ্যাপ">
            <input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} className={inputCls} />
          </Field>
          <Field label="ইমেইল">
            <input value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} className={inputCls} />
          </Field>
        </div>
      </Section>

      <Section title="সোশ্যাল লিংক">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="ফেসবুক">
            <input value={form.socials.facebook} onChange={(e) => setNested("socials", "facebook", e.target.value)} className={inputCls} placeholder="https://" />
          </Field>
          <Field label="ইনস্টাগ্রাম">
            <input value={form.socials.instagram} onChange={(e) => setNested("socials", "instagram", e.target.value)} className={inputCls} placeholder="https://" />
          </Field>
          <Field label="টিকটক">
            <input value={form.socials.tiktok} onChange={(e) => setNested("socials", "tiktok", e.target.value)} className={inputCls} placeholder="https://" />
          </Field>
          <Field label="টেলিগ্রাম">
            <input value={form.socials.telegram} onChange={(e) => setNested("socials", "telegram", e.target.value)} className={inputCls} placeholder="https://" />
          </Field>
        </div>
      </Section>

      <Section title="পেমেন্ট">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="পেমেন্ট মেথড">
            <input value={form.payment.method} onChange={(e) => setNested("payment", "method", e.target.value)} className={inputCls} placeholder="বিকাশ" />
          </Field>
          <Field label="বিকাশ নম্বর">
            <input value={form.payment.bkashNumber} onChange={(e) => setNested("payment", "bkashNumber", e.target.value)} className={inputCls} />
          </Field>
        </div>
        <Field label="নির্দেশনা">
          <textarea value={form.payment.instructions} onChange={(e) => setNested("payment", "instructions", e.target.value)} rows={3} className={inputCls} />
        </Field>
      </Section>

      <Section title="পরিসংখ্যান">
        <div className="grid gap-4 sm:grid-cols-4">
          <Field label="শিক্ষার্থী">
            <input value={form.stats.students} onChange={(e) => setNested("stats", "students", e.target.value)} className={inputCls} />
          </Field>
          <Field label="কোর্স">
            <input value={form.stats.courses} onChange={(e) => setNested("stats", "courses", e.target.value)} className={inputCls} />
          </Field>
          <Field label="ভিডিও">
            <input value={form.stats.videos} onChange={(e) => setNested("stats", "videos", e.target.value)} className={inputCls} />
          </Field>
          <Field label="রিসোর্স">
            <input value={form.stats.resources} onChange={(e) => setNested("stats", "resources", e.target.value)} className={inputCls} />
          </Field>
        </div>
      </Section>

      <Section title="অ্যাডমিন">
        <div className="space-y-2">
          {form.admins.length === 0 && <p className="text-xs text-slate-500">কোনো অ্যাডমিন ইমেইল নেই।</p>}
          {form.admins.map((email) => (
            <div key={email} className="flex items-center justify-between rounded-lg border border-navy-800 bg-navy-950 px-3 py-2">
              <span className="text-sm text-slate-200">{email}</span>
              <button onClick={() => removeAdmin(email)} className="text-slate-500 hover:text-red-400" title="মুছুন">
                <X size={16} />
              </button>
            </div>
          ))}
          <div className="flex gap-2 pt-1">
            <input
              value={adminInput}
              onChange={(e) => setAdminInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addAdmin()}
              className={inputCls}
              placeholder="admin@example.com"
            />
            <button
              onClick={addAdmin}
              className="inline-flex items-center gap-1 rounded-lg bg-navy-800 px-4 py-2 text-sm text-brand-400 hover:bg-navy-700"
            >
              <Plus size={15} /> যোগ করুন
            </button>
          </div>
        </div>
      </Section>

      <div className="flex justify-end">
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-400 px-5 py-2.5 text-sm font-semibold text-navy-950 hover:opacity-90 disabled:opacity-50"
        >
          <Save size={16} /> {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
        </button>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <AdminLayout title="সেটিংস">
        <SettingsInner />
      </AdminLayout>
    </ProtectedRoute>
  );
}
