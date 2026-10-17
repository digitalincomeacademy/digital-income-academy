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
  whatsappEnabled: true,
  kajlaChatEnabled: true,
  telegramChat: "",
  telegramChatEnabled: true,
  telegramAutoPost: false,
  contactEmail: "",
  socials: { facebook: "", instagram: "", tiktok: "", telegram: "", youtube: "" },
  payment: { method: "", bkashNumber: "", bkashMerchantLink: "", instructions: "",
    bkashUsername: "", bkashPassword: "", bkashAppKey: "", bkashAppSecret: "" },
  admins: [],
  sectionOrder: ["courses", "tools", "videos", "posts", "success", "apps", "about", "team", "portfolio"],
  sectionVisibility: {},
};

const SECTION_LABELS = {
  courses: "আমাদের জনপ্রিয় কোর্সসমূহ",
  tools: "স্মার্ট ডিজিটাল টুলস",
  videos: "শিক্ষামূলক ভিডিও রিসোর্স",
  posts: "সাম্প্রতিক পোস্ট ও বার্তা",
  success: "আমাদের হাত ধরে সফলতা",
  about: "আমাদের সম্পর্কে",
  team: "মেন্টর টিম",
  apps: "দরকারি অ্যাপস",
  portfolio: "ফাউন্ডারের পোর্টফোলিও",
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
            sectionOrder: Array.isArray(d.sectionOrder) ? d.sectionOrder : [],
            sectionVisibility: d.sectionVisibility || {},
            contactPhone: d.contactPhone || "",
            whatsapp: d.whatsapp || "",
            whatsappEnabled: d.whatsappEnabled !== false,
            kajlaChatEnabled: d.kajlaChatEnabled !== false,
            telegramChat: d.telegramChat || "",
            telegramChatEnabled: d.telegramChatEnabled !== false,
            telegramAutoPost: d.telegramAutoPost === true,
            contactEmail: d.contactEmail || "",
            socials: {
              facebook: d.socials?.facebook || "",
              instagram: d.socials?.instagram || "",
              tiktok: d.socials?.tiktok || "",
              telegram: d.socials?.telegram || "",
              youtube: d.socials?.youtube || "",
            },
            payment: {
              method: d.payment?.method || "",
              bkashNumber: d.payment?.bkashNumber || "",
              bkashMerchantLink: d.payment?.bkashMerchantLink || "",
              instructions: d.payment?.instructions || "",
              bkashUsername: d.payment?.bkashUsername || "",
              bkashPassword: d.payment?.bkashPassword || "",
              bkashAppKey: d.payment?.bkashAppKey || "",
              bkashAppSecret: d.payment?.bkashAppSecret || "",
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

  const ToggleSwitch = ({ checked, onChange }) => (
    <button
      type="button"
      role="switch"
      aria-checked={!!checked}
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${checked ? "bg-emerald-500" : "bg-white/15"}`}
      aria-label="চালু/বন্ধ"
    >
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${checked ? "left-[22px]" : "left-0.5"}`}
      />
    </button>
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

      <Section title="সেকশন সাজান (উপরে-নিচে)">
        <p className="text-xs text-white/50 -mt-2">
          হোমপেজে সেকশনগুলো কোন ক্রমে দেখাবে — ↑ ↓ দিয়ে সাজান
        </p>
        <div className="space-y-2">
          {(() => {
            const base = form.sectionOrder?.length ? form.sectionOrder : defaults.sectionOrder;
            const merged = [...base];
            defaults.sectionOrder.forEach((k) => { if (!merged.includes(k)) merged.push(k); });
            return merged;
          })().map((key, idx, arr) => (
            <div
              key={key}
              className="flex items-center justify-between rounded-lg border border-white/10 bg-navy-950 px-3 py-2"
            >
              <span className="text-sm text-white/85">
                <span className="text-white/40 mr-2">{idx + 1}.</span>
                {SECTION_LABELS[key] || key}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  role="switch"
                  aria-checked={(form.sectionVisibility?.[key] !== false)}
                  onClick={() => {
                    const v = { ...(form.sectionVisibility || {}) };
                    v[key] = !(v[key] !== false);
                    set("sectionVisibility", v);
                  }}
                  className={`relative w-11 h-6 rounded-full transition-colors ${(form.sectionVisibility?.[key] !== false) ? "bg-emerald-500" : "bg-white/15"}`}
                  aria-label="চালু/বন্ধ"
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${(form.sectionVisibility?.[key] !== false) ? "left-[22px]" : "left-0.5"}`}
                  />
                </button>
                <div className="flex gap-1">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => {
                    const a = [...arr];
                    [a[idx - 1], a[idx]] = [a[idx], a[idx - 1]];
                    set("sectionOrder", a);
                  }}
                  className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 text-sm"
                  aria-label="উপরে"
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={idx === arr.length - 1}
                  onClick={() => {
                    const a = [...arr];
                    [a[idx + 1], a[idx]] = [a[idx], a[idx + 1]];
                    set("sectionOrder", a);
                  }}
                  className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 text-sm"
                  aria-label="নিচে"
                >
                  ↓
                </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="ঘোষণা">
        <Field label="ঘোষণা বার্তা">
          <textarea value={form.announcement} onChange={(e) => set("announcement", e.target.value)} rows={3} className={inputCls} />
        </Field>
      </Section>

      <Section title="যোগাযোগ">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="ফোন">
            <input value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} className={inputCls} />
          </Field>
          <Field label="ইমেইল">
            <input value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} className={inputCls} />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-navy-800 bg-navy-950 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-200">💬 হোয়াটসঅ্যাপ চ্যাট বাটন</span>
              <ToggleSwitch checked={form.whatsappEnabled} onChange={(v) => set("whatsappEnabled", v)} />
            </div>
            <Field label="হোয়াটসঅ্যাপ নম্বর">
              <input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} className={inputCls} placeholder="8801XXXXXXXXX" />
            </Field>
          </div>
          <div className="rounded-xl border border-navy-800 bg-navy-950 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-200">🤖 কাজলা AI চ্যাট বাটন</span>
              <ToggleSwitch checked={form.kajlaChatEnabled} onChange={(v) => set("kajlaChatEnabled", v)} />
            </div>
            <p className="text-xs text-white/40">চালু থাকলে ভিজিটররা একাডেমি সম্পর্কে AI-এর কাছে প্রশ্ন করতে পারবে (ফ্রি, কোনো API খরচ নেই)।</p>
          </div>
          <div className="rounded-xl border border-navy-800 bg-navy-950 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-200">✈️ টেলিগ্রাম চ্যাট বাটন</span>
              <ToggleSwitch checked={form.telegramChatEnabled} onChange={(v) => set("telegramChatEnabled", v)} />
            </div>
            <Field label="টেলিগ্রাম ইউজারনেম / লিংক">
              <input value={form.telegramChat} onChange={(e) => set("telegramChat", e.target.value)} className={inputCls} placeholder="@username বা https://t.me/username" />
            </Field>
          </div>
        </div>
      </Section>

      <Section title="টেলিগ্রাম অটো-পোস্ট">
        <div className="rounded-xl border border-navy-800 bg-navy-950 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-200">✈️ নতুন পোস্ট স্বয়ংক্রিয়ভাবে টেলিগ্রামে পাঠাও</span>
            <ToggleSwitch checked={form.telegramAutoPost} onChange={(v) => set("telegramAutoPost", v)} />
          </div>
          <p className="text-xs text-white/40">
            চালু থাকলে নতুন পোস্ট publish করার সাথে সাথে আপনার টেলিগ্রাম চ্যানেল ও গ্রুপে চলে যাবে (ছবি + শিরোনাম + লিংকসহ)।
          </p>
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
          <Field label="ইউটিউব">
            <input value={form.socials.youtube} onChange={(e) => setNested("socials", "youtube", e.target.value)} className={inputCls} placeholder="https://" />
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
          <Field label="বিকাশ মার্চেন্ট লিংক (ঐচ্ছিক)">
            <input value={form.payment.bkashMerchantLink} onChange={(e) => setNested("payment", "bkashMerchantLink", e.target.value)} className={inputCls} placeholder="https://..." />
          </Field>
        </div>
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <h4 className="text-sm font-bold text-amber-400 mb-1">🔑 বিকাশ মার্চেন্ট API (অটো পেমেন্টের জন্য)</h4>
          <p className="text-xs text-white/50 mb-3">খালি রাখুন — যখন API credentials পাবেন তখন বসিয়ে Save দিন, যেকোনো সময় বদলাতে পারবেন</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Username">
              <input value={form.payment.bkashUsername} onChange={(e) => setNested("payment", "bkashUsername", e.target.value)} className={inputCls} placeholder="বিকাশ মার্চেন্ট username" />
            </Field>
            <Field label="Password">
              <input type="password" value={form.payment.bkashPassword} onChange={(e) => setNested("payment", "bkashPassword", e.target.value)} className={inputCls} placeholder="••••••••" />
            </Field>
            <Field label="App Key">
              <input value={form.payment.bkashAppKey} onChange={(e) => setNested("payment", "bkashAppKey", e.target.value)} className={inputCls} placeholder="App Key" />
            </Field>
            <Field label="App Secret">
              <input type="password" value={form.payment.bkashAppSecret} onChange={(e) => setNested("payment", "bkashAppSecret", e.target.value)} className={inputCls} placeholder="••••••••" />
            </Field>
          </div>
        </div>
        <Field label="নির্দেশনা">
          <textarea value={form.payment.instructions} onChange={(e) => setNested("payment", "instructions", e.target.value)} rows={3} className={inputCls} />
        </Field>
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
