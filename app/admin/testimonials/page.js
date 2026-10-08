"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { collection, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable from "@/components/admin/DataTable";
import { useToast } from "@/components/admin/Toast";
import ImageUpload from "@/components/admin/ImageUpload";
import { useCollection } from "@/hooks/useCollection";

const COLL = "testimonials";

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

const emptyForm = { name: "", text: "", image: "", approved: false };

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
      name: row.name || "",
      text: row.text || "",
      image: row.image || "",
      approved: row.approved === true,
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
    if (!form.name.trim() || !form.text.trim()) return toast.error("নাম ও মতামত আবশ্যক");
    setSaving(true);
    try {
      const payload = { ...form, updatedAt: serverTimestamp() };
      if (editing) {
        await updateDoc(doc(db, COLL, editing.id), payload);
        toast.success("মতামত আপডেট হয়েছে");
      } else {
        await addDoc(collection(db, COLL), { ...payload, createdAt: serverTimestamp() });
        toast.success("মতামত যোগ করা হয়েছে");
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
    if (!window.confirm(`"${row.name}"-এর মতামত মুছে ফেলবেন?`)) return;
    try {
      await deleteDoc(doc(db, COLL, row.id));
      toast.success("মুছে ফেলা হয়েছে");
    } catch {
      toast.error("মোছা ব্যর্থ হয়েছে");
    }
  }

  const columns = [
    { key: "name", label: "নাম", render: (r) => <span className="font-medium">{r.name}</span> },
    {
      key: "text",
      label: "মতামত",
      render: (r) => <span className="line-clamp-2 max-w-xl">{r.text}</span>,
    },
    {
      key: "approved",
      label: "অবস্থা",
      render: (r) =>
        r.approved ? (
          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-300">অনুমোদিত</span>
        ) : (
          <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs text-amber-300">অপেক্ষমাণ</span>
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
          emptyText="এখনো কোনো মতামত যোগ করা হয়নি"
        />
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={close}>
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-white/10 bg-navy-900 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-head text-lg font-bold text-white">
              {editing ? "মতামত সম্পাদনা" : "নতুন মতামত"}
            </h2>
            <form onSubmit={save} className="mt-4 space-y-4">
              <TextField label="নাম" value={form.name} onChange={set("name")} required placeholder="যার মতামত" />
              <AreaField label="মতামত" value={form.text} onChange={set("text")} required placeholder="মতামত লিখুন..." />
              <ImageUpload label="ছবি" value={form.image} onChange={set("image")} />
              <CheckField label="অনুমোদিত" checked={form.approved} onChange={set("approved")} />
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

export default function TestimonialsPage() {
  return (
    <ProtectedRoute>
      <AdminLayout title="মতামত ম্যানেজমেন্ট">
        <Inner />
      </AdminLayout>
    </ProtectedRoute>
  );
}
