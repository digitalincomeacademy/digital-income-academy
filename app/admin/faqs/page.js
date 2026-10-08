"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { collection, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable from "@/components/admin/DataTable";
import { useToast } from "@/components/admin/Toast";
import { useCollection } from "@/hooks/useCollection";

const COLL = "faqs";

const inputCls =
  "w-full rounded-lg border border-white/10 bg-navy-950 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-brand-400";

function TextField({ label, value, onChange, type = "text", required, placeholder }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-white/70">
        {label}
        {required && <span className="text-red-400"> *</span>}
      </span>
      <input
        type={type}
        className={inputCls}
        value={value ?? ""}
        onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
        placeholder={placeholder}
        required={required}
      />
    </label>
  );
}

function AreaField({ label, value, onChange, required, placeholder, rows = 4 }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-white/70">
        {label}
        {required && <span className="text-red-400"> *</span>}
      </span>
      <textarea
        className={inputCls}
        rows={rows}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
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

const emptyForm = { question: "", answer: "", order: 0, active: true };

function Inner() {
  const toast = useToast();
  const { data, loading } = useCollection(COLL);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  function openNew() {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function onEdit(row) {
    setEditing(row);
    setForm({
      question: row.question || "",
      answer: row.answer || "",
      order: row.order ?? 0,
      active: row.active !== false,
    });
    setOpen(true);
  }

  function close() {
    setOpen(false);
    setEditing(null);
    setForm(emptyForm);
  }

  async function save(e) {
    e.preventDefault();
    if (!db) return toast.error("Firebase সংযুক্ত নয়");
    if (!form.question.trim() || !form.answer.trim()) return toast.error("প্রশ্ন ও উত্তর আবশ্যক");
    setSaving(true);
    try {
      const payload = { ...form, order: Number(form.order) || 0, updatedAt: serverTimestamp() };
      if (editing) {
        await updateDoc(doc(db, COLL, editing.id), payload);
        toast.success("প্রশ্ন আপডেট হয়েছে");
      } else {
        await addDoc(collection(db, COLL), { ...payload, createdAt: serverTimestamp() });
        toast.success("প্রশ্ন যোগ করা হয়েছে");
      }
      close();
    } catch {
      toast.error("সংরক্ষণ ব্যর্থ হয়েছে");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(row) {
    if (!db) return toast.error("Firebase সংযুক্ত নয়");
    if (!window.confirm("এই প্রশ্ন মুছে ফেলবেন?")) return;
    try {
      await deleteDoc(doc(db, COLL, row.id));
      toast.success("মুছে ফেলা হয়েছে");
    } catch {
      toast.error("মোছা ব্যর্থ হয়েছে");
    }
  }

  const columns = [
    {
      key: "question",
      label: "প্রশ্ন",
      render: (r) => <span className="font-medium">{r.question}</span>,
    },
    {
      key: "active",
      label: "অবস্থা",
      render: (r) =>
        r.active !== false ? (
          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-300">সক্রিয়</span>
        ) : (
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/50">নিষ্ক্রিয়</span>
        ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={openNew}
          className="flex items-center gap-2 rounded-lg bg-brand-400 px-4 py-2 text-sm font-semibold text-navy-950 hover:opacity-90"
        >
          <Plus size={16} /> নতুন যোগ করুন
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg bg-white/5" />
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={data}
          onEdit={onEdit}
          onDelete={onDelete}
          emptyText="এখনো কোনো প্রশ্নোত্তর যোগ করা হয়নি"
        />
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={close}>
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-white/10 bg-navy-900 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-head text-lg font-bold text-white">
              {editing ? "প্রশ্ন সম্পাদনা" : "নতুন প্রশ্ন"}
            </h2>
            <form onSubmit={save} className="mt-4 space-y-4">
              <TextField label="প্রশ্ন" value={form.question} onChange={set("question")} required placeholder="প্রশ্ন লিখুন..." />
              <AreaField label="উত্তর" value={form.answer} onChange={set("answer")} required placeholder="উত্তর লিখুন..." />
              <TextField label="ক্রম" value={form.order} onChange={set("order")} type="number" />
              <CheckField label="সক্রিয়" checked={form.active} onChange={set("active")} />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={close}
                  className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white/70 hover:bg-white/5"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-brand-400 px-4 py-2 text-sm font-semibold text-navy-950 hover:opacity-90 disabled:opacity-50"
                >
                  {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FAQsPage() {
  return (
    <ProtectedRoute>
      <AdminLayout title="জিজ্ঞাসা ম্যানেজমেন্ট">
        <Inner />
      </AdminLayout>
    </ProtectedRoute>
  );
}
